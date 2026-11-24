"use client";

import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useId,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";
import { Shell } from "@/components/ui/Primitives";
import { easeOut, springSoft, springSnap } from "@/lib/motion";

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

/** Same settle as Overview widgets */
const windowEnter = {
  ...springSoft,
  duration: 0.58,
  bounce: 0.08,
};

const rowEnter = {
  duration: 0.28,
  ease: easeOut,
};

const fieldClass =
  "w-full rounded-full border-0 bg-white/[0.07] px-5 py-[14px] font-body text-[15px] tracking-[-0.01em] text-white outline-none transition-[background-color,box-shadow] duration-[var(--duration-ui)] ease-[var(--ease-out)] placeholder:text-white/28 focus:bg-white/[0.1] focus:shadow-[0_0_0_3px_rgba(10,132,255,0.18)]";

const areaClass =
  "w-full rounded-[28px] border-0 bg-white/[0.07] px-5 py-4 font-body text-[15px] tracking-[-0.01em] text-white outline-none transition-[background-color,box-shadow] duration-[var(--duration-ui)] ease-[var(--ease-out)] placeholder:text-white/28 focus:bg-white/[0.1] focus:shadow-[0_0_0_3px_rgba(10,132,255,0.18)]";

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
      ? "bg-[#0a84ff] !text-white"
      : "bg-white text-[#0a0a0a]";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`pressable inline-flex min-h-[42px] items-center gap-1.5 rounded-full px-4 py-2 font-display text-[13px] font-semibold tracking-[-0.02em] transition-[background-color,color,box-shadow] duration-[var(--duration-ui)] ease-[var(--ease-out)] ${
        active
          ? activeClass
          : "bg-white/[0.07] text-white/60 hover:bg-white/[0.11] hover:text-white/85"
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

function IconCheck({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5.5 12.5 10 17l8.5-9.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrafficLights() {
  return (
    <div className="flex items-center gap-[7px]" aria-hidden>
      <span
        className="size-[12px] rounded-full"
        style={{
          background: "linear-gradient(180deg, #ff6b63 0%, #ff5f57 100%)",
          boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.35)",
        }}
      />
      <span
        className="size-[12px] rounded-full"
        style={{
          background: "linear-gradient(180deg, #ffc145 0%, #febc2e 100%)",
          boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.35)",
        }}
      />
      <span
        className="size-[12px] rounded-full"
        style={{
          background: "linear-gradient(180deg, #36d44a 0%, #28c840 100%)",
          boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.35)",
        }}
      />
    </div>
  );
}

export function FinalCTA() {
  const reduce = useReducedMotion();
  const fileInputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
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

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!platforms.length || sending || sent) return;

    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("platforms", platforms.join(", "));
    data.set("timeline", timeline);
    data.delete("files");
    for (const file of files) data.append("files", file);

    setSending(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: data,
      });
      const json = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || "Could not send your message.");
      }

      setSent(true);
      setFiles([]);
      form.reset();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Could not send your message. Try again.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative scroll-mt-28 overflow-hidden bg-[#0a0a0a] pb-16 pt-12 md:pb-24 md:pt-20"
    >
      {/* Soft ambient so glass has something to catch — stays dark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 30%, rgba(255,255,255,0.09), transparent 68%), radial-gradient(ellipse 45% 40% at 18% 75%, rgba(10,132,255,0.1), transparent 62%), radial-gradient(ellipse 35% 30% at 85% 60%, rgba(255,255,255,0.04), transparent 55%)",
        }}
      />

      <Shell className="relative z-10">
        <motion.div
          initial={
            reduce
              ? false
              : { opacity: 0, transform: "translateY(28px) scale(0.97)" }
          }
          whileInView={{
            opacity: 1,
            transform: "translateY(0px) scale(1)",
          }}
          viewport={{ once: true, amount: 0.15, margin: "0px 0px -8% 0px" }}
          transition={reduce ? { duration: 0 } : windowEnter}
          className="liquid-glass-dark relative mx-auto max-w-5xl overflow-hidden rounded-[22px] sm:rounded-[28px]"
        >
          <div className="absolute left-5 top-5 z-10 sm:left-6 sm:top-6">
            <TrafficLights />
          </div>

          <div className="grid lg:grid-cols-[0.92fr_1.2fr]">
            {/* Meet pane — no separator */}
            <motion.div
              initial={
                reduce ? false : { opacity: 0, transform: "translateY(12px)" }
              }
              whileInView={{ opacity: 1, transform: "translateY(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={reduce ? { duration: 0 } : { ...rowEnter, delay: 0.1 }}
              className="relative flex min-h-[520px] flex-col px-6 pb-6 pt-12 sm:min-h-[560px] sm:px-8 sm:pb-8 sm:pt-14 lg:min-h-full lg:px-10 lg:pb-10 lg:pt-14"
            >
              <div className="relative flex flex-1 flex-col">
                <h2 className="font-display text-[clamp(2rem,4.2vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-white">
                  Let’s get it started
                </h2>
                <p className="mt-4 max-w-sm font-body text-[15px] leading-relaxed tracking-[-0.01em] text-white/45 sm:text-[16px]">
                  Share what you want to build. I will get back to you within a
                  day.
                </p>

                <a
                  href={site.upwork}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pressable mt-6 block max-w-sm rounded-[16px] border border-white/[0.1] bg-white/[0.04] p-4 transition-colors hover:border-white/[0.16] hover:bg-white/[0.06]"
                  aria-label="Read 5.0 Upwork review"
                >
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="inline-flex items-center gap-[2px]" aria-hidden>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="#FC8A06"
                        >
                          <path d="M6 0.8l1.5 3.2 3.5.4-2.6 2.4.7 3.4L6 8.6 2.9 10.2l.7-3.4L1 4.4l3.5-.4L6 .8z" />
                        </svg>
                      ))}
                    </span>
                    <span className="font-display text-[14px] font-semibold tabular-nums tracking-[-0.02em] text-white">
                      {site.upworkReview.rating}
                    </span>
                    <span className="text-white/25" aria-hidden>
                      |
                    </span>
                    <span className="font-body text-[12px] text-white/45">
                      {site.upworkReview.dateRange}
                    </span>
                  </span>
                  <p className="mt-3 font-body text-[14px] italic leading-relaxed tracking-[-0.01em] text-white/80">
                    “{site.upworkReview.quote}”
                  </p>
                  <p className="mt-3 font-body text-[12px] font-medium text-white/50">
                    {site.upworkReview.endorsement}
                  </p>
                </a>

                <div className="mt-auto flex items-center gap-3.5 pt-8">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-white/10 shadow-[0_10px_28px_rgba(0,0,0,0.35)] ring-[2px] ring-white/18 sm:size-14">
                    <Image
                      src="/me/portrait.jpg"
                      alt={site.name}
                      fill
                      className="object-cover object-[center_12%]"
                      sizes="56px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-[15px] font-semibold tracking-[-0.02em] text-white">
                      {site.name}
                    </p>
                    <p className="mt-0.5 font-body text-[13px] text-white/40">
                      Founder
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Form pane */}
            <motion.div
              initial={
                reduce ? false : { opacity: 0, transform: "translateY(12px)" }
              }
              whileInView={{ opacity: 1, transform: "translateY(0px)" }}
              viewport={{ once: true, amount: 0.25 }}
              transition={
                reduce ? { duration: 0 } : { ...rowEnter, delay: 0.16 }
              }
              className="px-6 py-8 pt-12 sm:px-8 sm:py-10 sm:pt-14 lg:px-9 lg:py-11 lg:pt-14"
            >
              <AnimatePresence mode="wait" initial={false}>
                {sent ? (
                  <motion.div
                    key="sent"
                    initial={
                      reduce
                        ? false
                        : {
                            opacity: 0,
                            transform: "translateY(10px) scale(0.98)",
                          }
                    }
                    animate={{
                      opacity: 1,
                      transform: "translateY(0px) scale(1)",
                    }}
                    exit={{ opacity: 0 }}
                    transition={springSoft}
                    className="flex min-h-[360px] flex-col items-start justify-center"
                  >
                    <span className="flex size-12 items-center justify-center rounded-full bg-[#30d158]/15 text-[#30d158] ring-1 ring-[#30d158]/28">
                      <IconCheck size={20} />
                    </span>
                    <p className="mt-5 font-display text-[26px] font-semibold tracking-[-0.04em] text-white">
                      Message sent.
                    </p>
                    <p className="mt-2 max-w-sm font-body text-[15px] leading-relaxed text-white/45">
                      Thanks. I will reply within a day.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={(e) => void onSubmit(e)}
                    initial={false}
                    exit={
                      reduce
                        ? undefined
                        : { opacity: 0, transform: "translateY(-8px)" }
                    }
                    transition={{ duration: 0.28, ease: easeOut }}
                    className="relative space-y-5"
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
                    >
                      <label>
                        Company
                        <input
                          name="company"
                          type="text"
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block font-display text-[11px] font-semibold uppercase tracking-[0.08em] text-white/35">
                          Name
                        </span>
                        <input
                          name="name"
                          required
                          autoComplete="name"
                          placeholder="Your name"
                          className={fieldClass}
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block font-display text-[11px] font-semibold uppercase tracking-[0.08em] text-white/35">
                          Email
                        </span>
                        <input
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          placeholder="you@company.com"
                          className={fieldClass}
                        />
                      </label>
                    </div>

                    <fieldset>
                      <legend className="mb-2.5 font-display text-[11px] font-semibold uppercase tracking-[0.08em] text-white/35">
                        Platforms
                      </legend>
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
                      <legend className="mb-2.5 font-display text-[11px] font-semibold uppercase tracking-[0.08em] text-white/35">
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
                      <span className="mb-2 block font-display text-[11px] font-semibold uppercase tracking-[0.08em] text-white/35">
                        About the product
                      </span>
                      <textarea
                        name="brief"
                        required
                        rows={4}
                        placeholder="What are you building, who is it for, and what matters most?"
                        className={`${areaClass} min-h-[112px] resize-none`}
                      />
                    </label>

                    <div>
                      <div className="mb-2">
                        <span className="font-display text-[11px] font-semibold uppercase tracking-[0.08em] text-white/35">
                          Attachments
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
                        className={`group flex cursor-pointer items-center gap-3.5 rounded-full px-4 py-3.5 transition-[background-color,box-shadow] duration-[var(--duration-ui)] ease-[var(--ease-out)] ${
                          dragging
                            ? "bg-[#0a84ff]/16 shadow-[0_0_0_3px_rgba(10,132,255,0.18)]"
                            : "bg-white/[0.07] hover:bg-white/[0.1]"
                        }`}
                      >
                        <span
                          className={`flex size-9 shrink-0 items-center justify-center rounded-full text-white/80 transition-[background-color,color] duration-[var(--duration-ui)] ease-[var(--ease-out)] ${
                            dragging
                              ? "bg-[#0a84ff] text-white"
                              : "bg-white/[0.08]"
                          }`}
                        >
                          <svg
                            width="14"
                            height="14"
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
                        <span className="min-w-0 text-left">
                          <span className="block font-display text-[13px] font-semibold tracking-[-0.02em] text-white/85">
                            Add files
                          </span>
                        </span>
                      </label>

                      {fileError ? (
                        <p className="mt-2 font-body text-[12px] text-[#ff453a]">
                          {fileError}
                        </p>
                      ) : null}

                      {files.length > 0 ? (
                        <ul className="mt-2.5 space-y-2">
                          {files.map((file) => (
                            <li
                              key={`${file.name}-${file.size}-${file.lastModified}`}
                              className="flex items-center gap-3 rounded-full bg-white/[0.07] px-3.5 py-2"
                            >
                              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/[0.1] font-display text-[10px] font-semibold uppercase tracking-wide text-white/60">
                                {file.name.split(".").pop()?.slice(0, 3) ||
                                  "file"}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate font-body text-[13px] font-medium text-white/85">
                                  {file.name}
                                </span>
                                <span className="font-body text-[11px] text-white/35">
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
                                className="pressable rounded-full px-2 py-1 font-display text-[12px] font-medium text-white/45 hover:bg-white/[0.06] hover:text-white/75"
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>

                    {submitError ? (
                      <p
                        role="alert"
                        className="font-body text-[13px] leading-relaxed text-[#ff453a]"
                      >
                        {submitError}
                      </p>
                    ) : null}

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        disabled={!platforms.length || sending}
                        className="pressable relative inline-flex min-h-[48px] w-full items-center justify-center overflow-hidden rounded-full bg-[#0a84ff] px-7 font-display text-[15px] font-semibold tracking-[-0.02em] !text-white transition-[filter] duration-[var(--duration-ui)] ease-[var(--ease-out)] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto sm:min-w-[168px]"
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          {sending ? (
                            <motion.span
                              key="sending"
                              initial={reduce ? false : { opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={springSnap}
                              className="inline-flex items-center gap-2"
                            >
                              <span
                                className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white"
                                aria-hidden
                              />
                              Sending
                            </motion.span>
                          ) : (
                            <motion.span
                              key="idle"
                              initial={reduce ? false : { opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={springSnap}
                            >
                              Send message
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </Shell>
    </section>
  );
}
