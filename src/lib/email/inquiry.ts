import { Resend } from "resend";
import { site } from "@/data/site";

export type InquiryFileMeta = {
  name: string;
  size: number;
  contentType: string;
  path: string;
  url: string;
};

export type InquiryPayload = {
  id: string;
  name: string;
  email: string;
  platforms: string[];
  timeline: string;
  brief: string;
  files: InquiryFileMeta[];
  createdAt: string;
};

export type InquiryAttachment = {
  filename: string;
  content: Buffer;
  contentType?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function buildInquiryEmail(payload: InquiryPayload) {
  const platforms = payload.platforms.length
    ? payload.platforms.join(", ")
    : "—";
  const briefHtml = escapeHtml(payload.brief).replaceAll("\n", "<br />");

  const filesHtml =
    payload.files.length === 0
      ? `<p style="margin:0;color:#6b6560;">No files attached.</p>`
      : `<ul style="margin:0;padding-left:18px;color:#1c1917;">${payload.files
          .map(
            (file) =>
              `<li style="margin:0 0 8px;">
                <a href="${escapeHtml(file.url)}" style="color:#0a84ff;text-decoration:none;">${escapeHtml(file.name)}</a>
                <span style="color:#6b6560;"> · ${formatBytes(file.size)}</span>
              </li>`,
          )
          .join("")}</ul>
        <p style="margin:12px 0 0;font-size:13px;color:#6b6560;">Links stay valid for 7 days. Files are also kept in the database.</p>`;

  const subject = `New project brief from ${payload.name}`;

  const text = [
    `New project brief`,
    ``,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Platforms: ${platforms}`,
    `Timeline: ${payload.timeline || "—"}`,
    ``,
    `About the product:`,
    payload.brief,
    ``,
    payload.files.length
      ? `Files:\n${payload.files.map((f) => `- ${f.name} (${formatBytes(f.size)}): ${f.url}`).join("\n")}`
      : `Files: none`,
    ``,
    `Inquiry ID: ${payload.id}`,
    `Received: ${payload.createdAt}`,
  ].join("\n");

  const html = `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f4f2ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1c1917;">
    <div style="max-width:640px;margin:0 auto;padding:32px 20px;">
      <div style="background:#fff;border-radius:16px;padding:28px 24px;border:1px solid #e8e4df;">
        <p style="margin:0 0 6px;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;color:#8a827b;">Studio inquiry</p>
        <h1 style="margin:0 0 20px;font-size:24px;line-height:1.2;letter-spacing:-0.03em;">New project brief</h1>
        <table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.5;">
          <tr>
            <td style="padding:8px 0;color:#6b6560;width:120px;vertical-align:top;">Name</td>
            <td style="padding:8px 0;font-weight:600;">${escapeHtml(payload.name)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6b6560;vertical-align:top;">Email</td>
            <td style="padding:8px 0;"><a href="mailto:${escapeHtml(payload.email)}" style="color:#0a84ff;text-decoration:none;">${escapeHtml(payload.email)}</a></td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6b6560;vertical-align:top;">Platforms</td>
            <td style="padding:8px 0;">${escapeHtml(platforms)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6b6560;vertical-align:top;">Timeline</td>
            <td style="padding:8px 0;">${escapeHtml(payload.timeline || "—")}</td>
          </tr>
        </table>
        <div style="margin:20px 0;height:1px;background:#ece8e3;"></div>
        <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;color:#8a827b;">About the product</p>
        <p style="margin:0;font-size:15px;line-height:1.6;white-space:pre-wrap;">${briefHtml}</p>
        <div style="margin:20px 0;height:1px;background:#ece8e3;"></div>
        <p style="margin:0 0 10px;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;color:#8a827b;">Files</p>
        ${filesHtml}
        <p style="margin:24px 0 0;font-size:12px;color:#9a928b;">ID ${escapeHtml(payload.id)} · ${escapeHtml(payload.createdAt)}</p>
      </div>
    </div>
  </body>
</html>`;

  return { subject, text, html };
}

export async function sendInquiryEmail(input: {
  payload: InquiryPayload;
  attachments: InquiryAttachment[];
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured.");

  const to =
    process.env.CONTACT_TO_EMAIL?.trim() ||
    site.email ||
    "hello@mishadzhuran.com";
  const from =
    process.env.RESEND_FROM?.trim() ||
    `Misha Dzhuran <maps@lifemaxxing.io>`;

  const { subject, text, html } = buildInquiryEmail(input.payload);
  const resend = new Resend(apiKey);

  const result = await resend.emails.send({
    from,
    to: [to],
    replyTo: input.payload.email,
    subject,
    text,
    html,
    attachments: input.attachments.map((file) => ({
      filename: file.filename,
      content: file.content,
      contentType: file.contentType,
    })),
  });

  if (result.error) {
    throw new Error(result.error.message || "Failed to send inquiry email.");
  }

  return result.data;
}
