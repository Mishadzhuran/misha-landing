import { createHash } from "crypto";
import { NextResponse } from "next/server";
import {
  sendInquiryEmail,
  type InquiryAttachment,
  type InquiryFileMeta,
} from "@/lib/email/inquiry";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILES = 5;
const MAX_FILE_BYTES = 12 * 1024 * 1024;
const MAX_ATTACH_TOTAL_BYTES = 18 * 1024 * 1024;
const ALLOWED_EXT = new Set([
  "pdf",
  "png",
  "jpg",
  "jpeg",
  "webp",
  "fig",
  "zip",
  "doc",
  "docx",
  "ppt",
  "pptx",
  "key",
  "txt",
  "md",
]);

const BUCKET = "studio-inquiry-files";

function cleanText(value: FormDataEntryValue | null, max = 4000) {
  return String(value ?? "")
    .replace(/\0/g, "")
    .trim()
    .slice(0, max);
}

function parsePlatforms(raw: string) {
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function extensionOf(name: string) {
  const idx = name.lastIndexOf(".");
  if (idx < 0) return "";
  return name.slice(idx + 1).toLowerCase();
}

function safeFileName(name: string) {
  const base = name.replace(/[^\w.\-()+ ]+/g, "_").slice(0, 120);
  return base || "file";
}

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "";
  return request.headers.get("x-real-ip")?.trim() || "";
}

function hashIp(ip: string) {
  if (!ip) return null;
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const name = cleanText(form.get("name"), 120);
    const email = cleanText(form.get("email"), 200).toLowerCase();
    const platforms = parsePlatforms(cleanText(form.get("platforms"), 200));
    const timeline = cleanText(form.get("timeline"), 80);
    const brief = cleanText(form.get("brief"), 8000);
    const honeypot = cleanText(form.get("company"), 80);

    if (honeypot) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !email.includes("@") || !brief) {
      return NextResponse.json(
        { error: "Name, email, and a short brief are required." },
        { status: 400 },
      );
    }

    if (!platforms.length) {
      return NextResponse.json(
        { error: "Pick at least one platform." },
        { status: 400 },
      );
    }

    const incoming = form.getAll("files").filter((entry): entry is File => entry instanceof File && entry.size > 0);
    if (incoming.length > MAX_FILES) {
      return NextResponse.json(
        { error: `You can attach up to ${MAX_FILES} files.` },
        { status: 400 },
      );
    }

    for (const file of incoming) {
      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json(
          { error: `"${file.name}" is over 12 MB.` },
          { status: 400 },
        );
      }
      const ext = extensionOf(file.name);
      if (!ext || !ALLOWED_EXT.has(ext)) {
        return NextResponse.json(
          { error: `"${file.name}" is not an allowed file type.` },
          { status: 400 },
        );
      }
    }

    const admin = supabaseAdmin();
    const inquiryId = crypto.randomUUID();
    const fileMetas: InquiryFileMeta[] = [];
    const emailAttachments: InquiryAttachment[] = [];
    let attachBudget = MAX_ATTACH_TOTAL_BYTES;

    for (let i = 0; i < incoming.length; i += 1) {
      const file = incoming[i];
      const bytes = Buffer.from(await file.arrayBuffer());
      const contentType = file.type || "application/octet-stream";
      const path = `${inquiryId}/${String(i).padStart(2, "0")}-${safeFileName(file.name)}`;

      const { error: uploadError } = await admin.storage
        .from(BUCKET)
        .upload(path, bytes, {
          contentType,
          upsert: false,
        });

      if (uploadError) {
        console.error("inquiry upload failed", uploadError);
        return NextResponse.json(
          { error: "Could not store one of the attachments. Try again." },
          { status: 502 },
        );
      }

      const { data: signed, error: signError } = await admin.storage
        .from(BUCKET)
        .createSignedUrl(path, 60 * 60 * 24 * 7);

      if (signError || !signed?.signedUrl) {
        console.error("inquiry sign failed", signError);
        return NextResponse.json(
          { error: "Could not prepare attachment links. Try again." },
          { status: 502 },
        );
      }

      fileMetas.push({
        name: file.name,
        size: file.size,
        contentType,
        path,
        url: signed.signedUrl,
      });

      if (bytes.length <= attachBudget) {
        emailAttachments.push({
          filename: safeFileName(file.name),
          content: bytes,
          contentType,
        });
        attachBudget -= bytes.length;
      }
    }

    const createdAt = new Date().toISOString();
    const { error: insertError } = await admin.from("studio_inquiries").insert({
      id: inquiryId,
      name,
      email,
      platforms,
      timeline,
      brief,
      files: fileMetas,
      source: "misha-landing",
      user_agent: request.headers.get("user-agent")?.slice(0, 400) || null,
      ip_hash: hashIp(clientIp(request)),
    });

    if (insertError) {
      console.error("inquiry insert failed", insertError);
      return NextResponse.json(
        { error: "Could not save your message. Try again." },
        { status: 502 },
      );
    }

    try {
      await sendInquiryEmail({
        payload: {
          id: inquiryId,
          name,
          email,
          platforms,
          timeline,
          brief,
          files: fileMetas,
          createdAt,
        },
        attachments: emailAttachments,
      });

      await admin
        .from("studio_inquiries")
        .update({ email_sent_at: new Date().toISOString(), email_error: null })
        .eq("id", inquiryId);
    } catch (mailError) {
      const message =
        mailError instanceof Error ? mailError.message : "Email send failed";
      console.error("inquiry email failed", mailError);
      await admin
        .from("studio_inquiries")
        .update({ email_error: message.slice(0, 500) })
        .eq("id", inquiryId);

      return NextResponse.json(
        {
          error:
            "Saved your message, but email delivery failed. I still have it — try again or email hello@mishadzhuran.com.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, id: inquiryId });
  } catch (error) {
    console.error("contact route failed", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
