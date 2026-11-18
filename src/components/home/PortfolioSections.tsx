"use client";

import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useId,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";
import { Shell } from "@/components/ui/Primitives";
import { easeOut } from "@/lib/motion";

export { WorkSection } from "@/components/home/WorkRail";
export { ConvinceRail } from "@/components/home/ConvinceRail";

const PLATFORMS = ["iOS", "Android", "Web"] as const;

const TIMELINES = [
  "ASAP",
  "4 to 6 weeks",
  "2 to 3 months",
  "Exploring",
] as const;

const MAX_FILES = 5;
const MAX_FILE_MB = 12;
const ACCEPT =
  ".pdf,.png,.jpg,.jpeg,.webp,.fig,.zip,.doc,.docx,.ppt,.pptx,.key,.txt,.md";

const fieldClass =
  "w-full rounded-[16px] border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-[15px] text-white outline-none transition-[border-color,background-color,box-shadow] duration-[var(--duration-ui)] ease-[var(--ease-out)] placeholder:text-white/28 focus:border-white/20 focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.16)]";

function toggleInList<T extends string>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function Chip({
  active,
  tone = "light",
  children,
  onClick,
}: {
  active: boolean;
  tone?: "light" | "blue";
  children: React.ReactNode;
  onClick: () => void;
}) {
  const activeClass =
    tone === "blue"
      ? "bg-[#0071e3] !text-white ring-[#0071e3]/80 shadow-[0_8px_22px_rgba(0,113,227,0.32)]"
      : "bg-white text-[#0a0a0a] ring-white";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`pressable inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium ring-1 transition-[background-color,color,box-shadow] duration-[var(--duration-ui)] ease-[var(--ease-out)] ${
        active
          ? activeClass
          : "bg-white/[0.03] text-white/65 ring-white/[0.1] hover:bg-white/[0.07] hover:text-white"
      }`}
    >
      {active ? (
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
          className="shrink-0"
        >
          <path
            d="M2.5 6.2L4.8 8.5L9.5 3.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
      {children}
    </button>
  );
}

export function FinalCTA() {
  const reduce = useReducedMotion();
  const fileInputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const [sent, setSent] = useState(false);
  const [platforms, setPlatforms] = useState<string[]>(["iOS"]);
  const [timeline, setTimeline] =
    useState<(typeof TIMELINES)[number]>("2 to 3 months");
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [dragging, setDragging] = useState(false);

  const addFiles = (incoming: FileList | File[]) => {
    const next = Array.from(incoming);
    const allowed: File[] = [];
    let error = "";

    for (const file of next) {
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        error = `"${file.name}" is over ${MAX_FILE_MB} MB.`;
        continue;
      }
      allowed.push(file);
    }

    setFiles((prev) => {
      const merged = [...prev];
      for (const file of allowed) {
        if (merged.length >= MAX_FILES) {
          error = `You can attach up to ${MAX_FILES} files.`;
          break;
        }
        if (
          merged.some((f) => f.name === file.name && f.size === file.size)
        ) {
          continue;
        }
        merged.push(file);
      }
      return merged;
    });
    setFileError(error);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = "";
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!platforms.length) return;
    setSent(true);
  };

  return (
    <section id="contact" className="scroll-mt-28 pb-16 pt-12 md:pb-24 md:pt-20">
      <Shell>
        <motion.div
          initial={
            reduce
              ? false
              : { opacity: 0, transform: "translateY(18px) scale(0.985)" }
          }
          whileInView={{
            opacity: 1,
            transform: "translateY(0px) scale(1)",
          }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="relative overflow-hidden rounded-[36px] ring-1 ring-white/[0.1] md:rounded-[44px]"
          style={{
            background:
              "radial-gradient(ellipse 90% 55% at 50% -15%, rgba(0,113,227,0.2), transparent 58%), linear-gradient(180deg, #161618 0%, #0e0e10 100%)",
            boxShadow:
              "inset 0 0.5px 0 rgba(255,255,255,0.12), 0 28px 80px rgba(0,0,0,0.35)",
          }}
        >
          <div className="grid lg:grid-cols-[0.9fr_1.15fr]">
            <div className="border-b border-white/[0.08] px-6 py-10 sm:px-8 sm:py-12 lg:border-b-0 lg:border-r lg:px-10 lg:py-14 xl:px-12">
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/40">
                Studio
              </p>
              <h2 className="mt-4 max-w-sm font-display text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-[1.08] tracking-[-0.045em] text-white">
                Start a project
                <br />
                with the studio.
              </h2>
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/45 sm:text-[16px]">
                Tell us what you want to build. We handle design, development,
                and launch, and reply within a day.
              </p>

              <ul className="mt-8 space-y-3.5 text-[14px] text-white/55">
                {[
                  "iOS, Android, and web apps",
                  "Clear scope before work starts",
                  "One studio from idea to release",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#0a84ff]"
                    />
                    {line}
                  </li>
                ))}
              </ul>

              <a
                href={`mailto:${site.email}`}
                className="mt-10 inline-flex text-[14px] font-medium text-[#0a84ff] transition-colors duration-[var(--duration-ui)] ease-[var(--ease-out)] hover:text-[#2997ff]"
              >
                {site.email}
              </a>
            </div>

            <div className="px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14 xl:px-12">
              {sent ? (
                <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                  <p className="font-display text-[28px] font-semibold tracking-[-0.04em] text-white">
                    Brief received.
                  </p>
                  <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-white/45">
                    Thanks for sharing. We will review it and reply within a
                    day.
                  </p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-[13px] font-medium text-white/45">
                        Name
                      </span>
                      <input
                        name="name"
                        required
                        autoComplete="name"
                        placeholder="Alex"
                        className={fieldClass}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-[13px] font-medium text-white/45">
                        Email
                      </span>
                      <input
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="alex@company.com"
                        className={fieldClass}
                      />
                    </label>
                  </div>

                  <fieldset>
                    <legend className="mb-1 text-[13px] font-medium text-white/45">
                      Platforms
                    </legend>
                    <p className="mb-3 text-[12px] text-white/30">
                      Select all that apply
                    </p>
                    <input
                      type="hidden"
                      name="platforms"
                      value={platforms.join(", ")}
                    />
                    <div className="flex flex-wrap gap-2">
                      {PLATFORMS.map((item) => (
                        <Chip
                          key={item}
                          active={platforms.includes(item)}
                          onClick={() =>
                            setPlatforms((prev) => toggleInList(prev, item))
                          }
                        >
                          {item}
                        </Chip>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="mb-3 text-[13px] font-medium text-white/45">
                      Timeline
                    </legend>
                    <input type="hidden" name="timeline" value={timeline} />
                    <div className="flex flex-wrap gap-2">
                      {TIMELINES.map((item) => (
                        <Chip
                          key={item}
                          tone="blue"
                          active={timeline === item}
                          onClick={() => setTimeline(item)}
                        >
                          {item}
                        </Chip>
                      ))}
                    </div>
                  </fieldset>

                  <label className="block">
                    <span className="mb-2 block text-[13px] font-medium text-white/45">
                      About the product
                    </span>
                    <textarea
                      name="brief"
                      required
                      rows={5}
                      placeholder="What are you building, who is it for, and what matters most?"
                      className={`${fieldClass} resize-none`}
                    />
                  </label>

                  <div>
                    <div className="mb-2.5 flex items-baseline justify-between gap-3">
                      <span className="text-[13px] font-medium text-white/45">
                        Attachments
                      </span>
                      <span className="text-[12px] text-white/28">
                        Optional · up to {MAX_FILES} files
                      </span>
                    </div>

                    <input
                      ref={fileRef}
                      id={fileInputId}
                      type="file"
                      multiple
                      accept={ACCEPT}
                      className="sr-only"
                      onChange={onFileChange}
                    />

                    <label
                      htmlFor={fileInputId}
                      onDragEnter={(e) => {
                        e.preventDefault();
                        setDragging(true);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        setDragging(false);
                      }}
                      onDrop={onDrop}
                      className={`flex cursor-pointer flex-col items-center justify-center rounded-[20px] border border-dashed px-4 py-7 text-center transition-[border-color,background-color] duration-[var(--duration-ui)] ease-[var(--ease-out)] ${
                        dragging
                          ? "border-[#0071e3] bg-[#0071e3]/12"
                          : "border-white/[0.12] bg-white/[0.025] hover:border-white/22 hover:bg-white/[0.045]"
                      }`}
                    >
                      <span className="flex size-10 items-center justify-center rounded-full bg-white/[0.07] text-white/75 ring-1 ring-white/[0.1]">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M9 12.5V3.5M9 3.5L5.5 7M9 3.5L12.5 7M3.5 14.5h11"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="mt-3 text-[14px] font-medium text-white/80">
                        Drop files here, or browse
                      </span>
                      <span className="mt-1 text-[12px] text-white/30">
                        PDF, images, decks, zip · max {MAX_FILE_MB} MB each
                      </span>
                    </label>

                    {fileError ? (
                      <p className="mt-2 text-[12px] text-[#ff453a]">
                        {fileError}
                      </p>
                    ) : null}

                    {files.length > 0 ? (
                      <ul className="mt-3 space-y-2">
                        {files.map((file) => (
                          <li
                            key={`${file.name}-${file.size}-${file.lastModified}`}
                            className="flex items-center gap-3 rounded-[16px] border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5"
                          >
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-white/[0.08] text-[11px] font-semibold uppercase tracking-wide text-white/60">
                              {file.name.split(".").pop()?.slice(0, 3) || "file"}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[13px] font-medium text-white/85">
                                {file.name}
                              </span>
                              <span className="text-[11px] text-white/35">
                                {formatBytes(file.size)}
                              </span>
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setFiles((prev) =>
                                  prev.filter(
                                    (f) =>
                                      !(
                                        f.name === file.name &&
                                        f.size === file.size &&
                                        f.lastModified === file.lastModified
                                      ),
                                  ),
                                )
                              }
                              className="pressable rounded-full px-2.5 py-1 text-[12px] font-medium text-white/45 hover:bg-white/[0.06] hover:text-white/75"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    disabled={!platforms.length}
                    className="pressable inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#0071e3] px-7 py-3.5 text-[15px] font-semibold !text-white shadow-[0_14px_36px_rgba(0,113,227,0.34)] hover:bg-[#0077ed] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Send brief
                  </button>

                  <p className="text-center text-[13px] text-white/35">
                    We reply within a day
                  </p>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </Shell>
    </section>
  );
}
