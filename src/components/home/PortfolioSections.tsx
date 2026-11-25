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
  duration: 0.5,
  bounce: 0.06,
};

const rowEnter = {
  duration: 0.28,
  ease: easeOut,
};

const formStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.045, delayChildren: 0.06 },
  },
};

const formItem = {
  hidden: { opacity: 0, transform: "translateY(10px)" },
  show: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.28, ease: easeOut },
  },
};

/** 16px+ so iOS Safari does not zoom the page on focus */
const fieldClass =
  "w-full rounded-full border-0 bg-white/[0.07] px-5 py-[14px] font-body text-[16px] tracking-[-0.01em] text-white outline-none transition-[background-color,box-shadow] duration-[var(--duration-ui)] ease-[var(--ease-out)] placeholder:text-white/28 focus:bg-white/[0.1] focus:shadow-[0_0_0_3px_rgba(10,132,255,0.18)]";

const areaClass =
  "w-full rounded-[28px] border-0 bg-white/[0.07] px-5 py-4 font-body text-[16px] tracking-[-0.01em] text-white outline-none transition-[background-color,box-shadow] duration-[var(--duration-ui)] ease-[var(--ease-out)] placeholder:text-white/28 focus:bg-white/[0.1] focus:shadow-[0_0_0_3px_rgba(10,132,255,0.18)]";

const labelClass =
  "mb-2 block font-display text-[11px] font-semibold uppercase tracking-[0.08em] text-white/35";

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
      className={`pressable inline-flex min-h-[44px] touch-manipulation items-center gap-1.5 rounded-full px-4 py-2.5 font-display text-[14px] font-semibold tracking-[-0.02em] transition-[background-color,color] duration-[var(--duration-ui)] ease-[var(--ease-out)] select-none ${
        active
          ? activeClass
          : "bg-white/[0.07] text-white/60 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/[0.11] [@media(hover:hover)_and_(pointer:fine)]:hover:text-white/85"
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
      className="relative scroll-mt-24 overflow-hidden bg-[#0a0a0a] pb-[max(4rem,env(safe-area-inset-bottom)+2rem)] pt-10 md:pb-24 md:pt-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 30%, rgba(255,255,255,0.09), transparent 68%), radial-gradient(ellipse 45% 40% at 18% 75%, rgba(10,132,255,0.1), transparent 62%)",
        }}
      />

      <Shell className="relative z-10">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 sm:gap-6">
          {/* Form window only */}
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
            viewport={{ once: true, amount: 0.12, margin: "0px 0px -8% 0px" }}
            transition={reduce ? { duration: 0 } : windowEnter}
            className="liquid-glass-dark relative overflow-hidden rounded-[26px] sm:rounded-[32px]"
          >
            <div className="absolute left-5 top-5 z-10 sm:left-6 sm:top-6">
              <TrafficLights />
            </div>

            <div className="px-5 pb-7 pt-12 sm:px-8 sm:pb-9 sm:pt-14 lg:px-10">
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
                    className="flex min-h-[280px] flex-col items-start justify-center"
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
                    initial={reduce ? false : "hidden"}
                    animate="show"
                    variants={reduce ? undefined : formStagger}
                    exit={
                      reduce
                        ? undefined
                        : { opacity: 0, transform: "translateY(-8px)" }
                    }
                    transition={{ duration: 0.28, ease: easeOut }}
                    className="relative space-y-5"
                  >
                    <motion.div variants={reduce ? undefined : formItem}>
                      <h2 className="font-display text-[clamp(1.85rem,4.5vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-white">
                        Let’s get it started
                      </h2>
                      <p className="mt-2 max-w-md font-body text-[15px] leading-relaxed text-white/45 sm:text-[16px]">
                        Tell me what you want to build. I reply within a day.
                      </p>
                    </motion.div>

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

                    <motion.div
                      variants={reduce ? undefined : formItem}
                      className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4"
                    >
                      <label className="block min-w-0">
                        <span className={labelClass}>Name</span>
                        <input
                          name="name"
                          required
                          autoComplete="name"
                          placeholder="Your name"
                          className={fieldClass}
                        />
                      </label>
                      <label className="block min-w-0">
                        <span className={labelClass}>Email</span>
                        <input
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          inputMode="email"
                          placeholder="you@company.com"
                          className={fieldClass}
                        />
                      </label>
                    </motion.div>

                    <motion.fieldset variants={reduce ? undefined : formItem}>
                      <legend className={labelClass}>Platforms</legend>
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
                    </motion.fieldset>

                    <motion.fieldset variants={reduce ? undefined : formItem}>
                      <legend className={labelClass}>Timeline</legend>
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
                    </motion.fieldset>

                    <motion.label
                      variants={reduce ? undefined : formItem}
                      className="block"
                    >
                      <span className={labelClass}>About the product</span>
                      <textarea
                        name="brief"
                        required
                        rows={4}
                        placeholder="What are you building, who is it for, and what matters most?"
                        className={`${areaClass} min-h-[112px] resize-none`}
                      />
                    </motion.label>

                    <motion.div variants={reduce ? undefined : formItem}>
                      <span className={labelClass}>Attachments</span>
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
                            : "bg-white/[0.07] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/[0.1]"
                        }`}
                      >
                        <span
                          className={`flex size-9 shrink-0 items-center justify-center rounded-full text-white/80 ${
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
                        <span className="font-display text-[13px] font-semibold tracking-[-0.02em] text-white/85">
                          Add files
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
                              <span className="min-w-0 flex-1 truncate font-body text-[13px] font-medium text-white/85">
                                {file.name}
                              </span>
                              <span className="font-body text-[11px] text-white/35">
                                {formatBytes(file.size)}
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
                                className="pressable rounded-full px-2 py-1 font-display text-[12px] font-medium text-white/45 [@media(hover:hover)_and_(pointer:fine)]:hover:text-white/75"
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </motion.div>

                    {submitError ? (
                      <p
                        role="alert"
                        className="font-body text-[13px] leading-relaxed text-[#ff453a]"
                      >
                        {submitError}
                      </p>
                    ) : null}

                    <motion.div
                      variants={reduce ? undefined : formItem}
                      className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <p className="order-2 text-center font-body text-[13px] text-white/35 sm:order-1 sm:text-left">
                        No spam. Reply in about a day.
                      </p>
                      <button
                        type="submit"
                        disabled={!platforms.length || sending}
                        className="pressable relative order-1 inline-flex min-h-[52px] w-full touch-manipulation items-center justify-center overflow-hidden rounded-full bg-[#0a84ff] px-7 font-display text-[16px] font-semibold tracking-[-0.02em] !text-white select-none transition-[filter] duration-[var(--duration-ui)] ease-[var(--ease-out)] disabled:cursor-not-allowed disabled:opacity-45 sm:order-2 sm:w-auto sm:min-h-[48px] sm:min-w-[168px] [@media(hover:hover)_and_(pointer:fine)]:hover:brightness-110"
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          {sending ? (
                            <motion.span
                              key="sending"
                              initial={
                                reduce
                                  ? false
                                  : { opacity: 0, transform: "translateY(6px)" }
                              }
                              animate={{
                                opacity: 1,
                                transform: "translateY(0px)",
                              }}
                              exit={{
                                opacity: 0,
                                transform: "translateY(-6px)",
                              }}
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
                              initial={
                                reduce
                                  ? false
                                  : { opacity: 0, transform: "translateY(6px)" }
                              }
                              animate={{
                                opacity: 1,
                                transform: "translateY(0px)",
                              }}
                              exit={{
                                opacity: 0,
                                transform: "translateY(-6px)",
                              }}
                              transition={springSnap}
                            >
                              Send message
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* About + links under the form window */}
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
            viewport={{ once: true, amount: 0.25 }}
            transition={
              reduce
                ? { duration: 0 }
                : { ...windowEnter, delay: 0.1 }
            }
            className="w-full"
          >
            <div className="flex flex-col gap-5 rounded-[26px] bg-white/[0.05] p-5 sm:rounded-[32px] sm:gap-5 sm:p-6">
              <div className="flex items-center gap-3.5">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-white/10 ring-[1.5px] ring-white/18">
                  <Image
                    src={site.portrait}
                    alt={site.name}
                    fill
                    className="object-cover object-[center_12%]"
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-[15px] font-semibold tracking-[-0.02em] text-white">
                    {site.name}
                  </p>
                  <p className="mt-0.5 font-body text-[13px] text-white/40">
                    {site.roleLabel}
                  </p>
                </div>
              </div>

              <a
                href={site.upwork}
                target="_blank"
                rel="noopener noreferrer"
                className="pressable block rounded-[22px] bg-black/25 px-4 py-4 transition-colors [@media(hover:hover)_and_(pointer:fine)]:hover:bg-black/35"
                aria-label="Read 5.0 Upwork review"
              >
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span
                    className="inline-flex items-center gap-[2px]"
                    aria-hidden
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        width="10"
                        height="10"
                        viewBox="0 0 12 12"
                        fill="#FC8A06"
                      >
                        <path d="M6 0.8l1.5 3.2 3.5.4-2.6 2.4.7 3.4L6 8.6 2.9 10.2l.7-3.4L1 4.4l3.5-.4L6 .8z" />
                      </svg>
                    ))}
                  </span>
                  <span className="font-display text-[13px] font-semibold tabular-nums tracking-[-0.02em] text-white">
                    {site.upworkReview.rating}
                  </span>
                  <span className="font-body text-[11px] text-white/40">
                    Upwork
                  </span>
                </span>
                <p className="mt-3 font-body text-[13px] leading-relaxed tracking-[-0.01em] text-white/70">
                  “{site.upworkReview.quote}”
                </p>
                <p className="mt-3 font-body text-[11px] font-medium text-white/40">
                  {site.upworkReview.endorsement}
                </p>
              </a>

              <ul
                className="grid grid-cols-3 gap-2.5 sm:gap-3"
                aria-label="Profiles"
              >
                {site.socials.map((social) => (
                  <li key={social.label} className="min-w-0">
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pressable flex min-h-[44px] w-full touch-manipulation items-center justify-center gap-1.5 rounded-full bg-white/[0.07] px-2 text-[12px] font-medium text-white/70 select-none transition-colors sm:text-[13px] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-white/[0.11] [@media(hover:hover)_and_(pointer:fine)]:hover:text-white"
                    >
                      <Image
                        src={social.icon}
                        alt=""
                        width={14}
                        height={14}
                        className={
                          social.label === "GitHub"
                            ? "brightness-0 invert opacity-90"
                            : undefined
                        }
                      />
                      <span className="truncate">{social.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </Shell>
    </section>
  );
}
