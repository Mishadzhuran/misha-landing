"use client";

import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  featuredCases,
  liveUsersCount,
  site,
  stats,
  systemsWiredCount,
} from "@/data/site";
import { CapabilitiesBox } from "@/components/home/CapabilitiesBox";
import { Shell } from "@/components/ui/Primitives";
import { easeOut, springSoft } from "@/lib/motion";

const widgetShadow = "0 18px 50px rgba(0,0,0,0.35)";
const darkWidgetShadow =
  "inset 0 0.5px 0 rgba(255,255,255,0.16), 0 0 0 0.5px rgba(255,255,255,0.12), 0 18px 50px rgba(0,0,0,0.45)";
const sf =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif';

/** Always starts false so SSR + first client paint match; flips after mount. */
function useIsPhone() {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setPhone(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return phone;
}

/** Card rise — transform string stays on the compositor. */
const widgetEnter = {
  ...springSoft,
  duration: 0.58,
  bounce: 0.08,
};

/** Row / bubble stagger after the card lands. */
const rowEnter = {
  duration: 0.28,
  ease: easeOut,
};

function Widget({
  children,
  className = "",
  delay = 0,
  style,
  tone = "light",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
  tone?: "light" | "dark";
}) {
  const reduce = useReducedMotion();
  const phone = useIsPhone();
  const shadow = tone === "dark" ? darkWidgetShadow : widgetShadow;

  return (
    <motion.div
      initial={
        reduce
          ? false
          : { opacity: 0, transform: "translateY(28px) scale(0.97)" }
      }
      whileInView={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
      viewport={{
        once: true,
        amount: 0.22,
        margin: "0px 0px -8% 0px",
      }}
      transition={
        reduce
          ? { duration: 0 }
          : { ...widgetEnter, delay: phone ? delay * 0.45 : delay }
      }
      className={`trust-widget pointer-events-none relative flex h-full min-w-0 flex-col overflow-hidden rounded-[32px] [&_a]:pointer-events-auto [&_button]:pointer-events-auto [&_[role=slider]]:pointer-events-auto ${
        tone === "dark" ? "trust-widget--dark" : ""
      } ${className}`}
      style={{
        fontFamily: sf,
        boxShadow: shadow,
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

function CalendarCard() {
  const reduce = useReducedMotion();
  const events = [
    { time: "10:00", title: "Discovery call", color: "#FF3B30" },
    { time: "14:00", title: "Statement of work", color: "#007AFF" },
    { time: "Week 2", title: "First TestFlight", color: "#FF9500" },
    { time: "Week 6", title: "App launch", color: "#34C759" },
  ];

  return (
    <Widget
      delay={0.04}
      tone="dark"
      className="relative min-h-[340px] p-7 sm:min-h-[300px] sm:p-6"
    >
      <div className="flex h-full gap-4 sm:gap-5">
        <div className="flex w-[72px] shrink-0 flex-col items-center border-r border-white/[0.08] pt-0.5 pr-3.5 sm:w-[72px] sm:pr-4">
          <p className="text-[13px] font-semibold uppercase tracking-[0.04em] text-[#FF453A]">
            Mon
          </p>
          <p className="mt-0.5 text-[52px] font-semibold leading-none tracking-[-0.05em] tabular-nums text-white sm:text-[52px]">
            1
          </p>
          <p className="mt-2 text-center text-[12px] font-medium leading-tight text-white/60 sm:text-[11px]">
            First
            <br />
            week
          </p>
        </div>

        <ul className="flex min-w-0 flex-1 flex-col justify-center space-y-0">
          {events.map((e, i) => (
            <motion.li
              key={e.title}
              initial={
                reduce
                  ? false
                  : { opacity: 0, transform: "translateY(10px)" }
              }
              whileInView={{ opacity: 1, transform: "translateY(0px)" }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ ...rowEnter, delay: 0.16 + i * 0.06 }}
              className={`flex items-start gap-2.5 py-3 sm:py-2.5 ${
                i < events.length - 1 ? "border-b border-white/[0.1]" : ""
              }`}
            >
              <span
                className="mt-[7px] h-[8px] w-[8px] shrink-0 rounded-full"
                style={{
                  background: e.color,
                  boxShadow: `0 0 8px ${e.color}66`,
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-semibold tracking-[-0.02em] text-white sm:text-[14px]">
                  {e.title}
                </p>
                <p
                  className="mt-0.5 text-[13px] font-medium tabular-nums sm:text-[12px]"
                  style={{ color: e.color }}
                >
                  {e.time}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </Widget>
  );
}

const RESULT_ROWS = [
  { label: "Projects delivered", value: stats[0].value, delta: "+4" },
  { label: "Markets", value: stats[1].value, delta: "Map" },
  { label: "Systems wired", value: stats[2].value, delta: "Stack" },
  { label: "Typical reply", value: stats[4].value, delta: "SLA" },
] as const;

/** Stocks. delivery volume — same on every breakpoint */
function StocksCard() {
  const reduce = useReducedMotion();

  return (
    <Widget
      delay={0.06}
      tone="dark"
      className="min-h-[340px] p-7 sm:min-h-[300px] sm:p-6"
    >
      <p className="text-[17px] font-semibold tracking-[-0.02em] text-white sm:text-[15px]">
        Results
      </p>
      <ul className="mt-4 flex flex-1 flex-col justify-center sm:mt-3">
        {RESULT_ROWS.map((r, i) => (
          <motion.li
            key={r.label}
            initial={
              reduce ? false : { opacity: 0, transform: "translateY(10px)" }
            }
            whileInView={{ opacity: 1, transform: "translateY(0px)" }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ ...rowEnter, delay: 0.14 + i * 0.06 }}
            className={`flex items-center justify-between gap-3 py-3.5 sm:py-3 ${
              i < RESULT_ROWS.length - 1 ? "border-b border-white/[0.1]" : ""
            }`}
          >
            <p className="min-w-0 flex-1 pr-2 text-[15px] font-medium leading-snug text-white/50 sm:text-[14px]">
              {r.label}
            </p>
            <div className="flex shrink-0 items-center gap-2.5">
              <p className="text-[22px] font-semibold tabular-nums tracking-[-0.03em] text-white sm:text-[18px]">
                {r.value}
              </p>
              <span className="min-w-[48px] rounded-[6px] bg-[#34C759] px-1.5 py-[6px] text-center text-[12px] font-semibold tabular-nums leading-none !text-white sm:min-w-[44px] sm:py-[4px] sm:text-[11px]">
                {r.delta}
              </span>
            </div>
          </motion.li>
        ))}
      </ul>
    </Widget>
  );
}

/** Activity. engagement quality (distinct from Results) */
function FitnessCard() {
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, "");

  const metrics = [
    {
      key: "users",
      label: "Live users",
      value: `${(liveUsersCount / 1000).toFixed(0)}k+`,
      progress: 0.88,
      color: "#FF2D55",
      track: "#3A0F1C",
      r: 50,
    },
    {
      key: "score",
      label: "Client score",
      value: "4.9",
      /** Visual fill a bit under full. still reads as strong 4.9 */
      progress: 0.72,
      color: "#30D158",
      track: "#14301A",
      r: 36,
    },
    {
      key: "systems",
      label: "Systems wired",
      value: `${systemsWiredCount}+`,
      progress: 0.78,
      color: "#64D2FF",
      track: "#0E2A36",
      r: 22,
    },
  ];

  return (
    <Widget
      delay={0.08}
      tone="dark"
      className="relative min-h-[340px] p-7 sm:min-h-[300px] sm:p-6"
    >
      <div className="relative flex h-full flex-col">
        <p className="text-[17px] font-semibold tracking-[-0.02em] text-white sm:text-[15px]">
          Activity
        </p>

        <div className="mt-auto flex min-w-0 items-center justify-between gap-4 pt-4 sm:gap-3 sm:pt-3">
          <ul className="min-w-0 flex-1 space-y-4 sm:space-y-3">
            {metrics.map((m, i) => (
              <motion.li
                key={m.key}
                initial={
                  reduce
                    ? false
                    : { opacity: 0, transform: "translateY(10px)" }
                }
                whileInView={{ opacity: 1, transform: "translateY(0px)" }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ ...rowEnter, delay: 0.18 + i * 0.07 }}
                className="flex items-baseline gap-2.5"
              >
                <span
                  className="mt-[2px] h-2.5 w-2.5 shrink-0 rounded-full sm:h-2 sm:w-2"
                  style={{
                    background: m.color,
                    boxShadow: `0 0 8px ${m.color}`,
                  }}
                />
                <div className="min-w-0">
                  <p
                    className="text-[22px] font-semibold leading-none tracking-[-0.04em] tabular-nums sm:text-[20px]"
                    style={{ color: m.color }}
                  >
                    {m.value}
                  </p>
                  <p className="mt-0.5 text-[13px] font-medium leading-snug text-white/75 sm:text-[11px]">
                    {m.label}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>

          <svg
            className="h-[112px] w-[112px] shrink-0 sm:h-[124px] sm:w-[124px]"
            width="124"
            height="124"
            viewBox="0 0 124 124"
            aria-hidden
          >
            <defs>
              <filter
                id={`ag-${uid}`}
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feGaussianBlur stdDeviation="0.7" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {metrics.map((ring, i) => {
              const c = 2 * Math.PI * ring.r;
              return (
                <g key={ring.key} transform="translate(62 62) rotate(-90)">
                  <circle
                    r={ring.r}
                    fill="none"
                    stroke={ring.track}
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <motion.circle
                    r={ring.r}
                    fill="none"
                    stroke={ring.color}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={c}
                    initial={
                      reduce
                        ? { strokeDashoffset: c * (1 - ring.progress) }
                        : { strokeDashoffset: c }
                    }
                    whileInView={{
                      strokeDashoffset: c * (1 - ring.progress),
                    }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.18 + i * 0.14,
                      duration: 1.35,
                      ease: easeOut,
                    }}
                    style={{ filter: `url(#ag-${uid})` }}
                  />
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </Widget>
  );
}

/** iMessage typing dots */
function TypingDots() {
  return (
    <span className="flex items-center gap-[5px] px-1 py-0.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-[7px] w-[7px] rounded-full bg-[#8e8e93]"
          animate={{ opacity: [0.35, 1, 0.35], y: [0, -2.5, 0] }}
          transition={{
            duration: 1.05,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.16,
          }}
        />
      ))}
    </span>
  );
}

/** Messages. chat with a client; you (Misha) reply in blue */
function ResponseCard() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const [phase, setPhase] = useState<"idle" | "typing" | "reply">("idle");

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setPhase("reply");
      return;
    }
    setPhase("typing");
    const t = window.setTimeout(() => setPhase("reply"), 1600);
    return () => window.clearTimeout(t);
  }, [inView, reduce]);

  return (
    <Widget
      delay={0.08}
      tone="dark"
      className="relative flex min-h-[340px] flex-col p-7 sm:min-h-[300px] sm:p-6"
    >
      <div ref={ref} className="flex h-full flex-col">
        <div className="flex items-center gap-3 border-b border-white/[0.1] pb-3.5 sm:gap-2.5 sm:pb-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#30D158] via-[#64D2FF] to-[#0A84FF] text-[19px] shadow-sm ring-2 ring-white/15 sm:h-9 sm:w-9 sm:text-[18px]"
            aria-hidden
          >
            👋
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[16px] font-semibold tracking-[-0.02em] text-white sm:text-[15px]">
              Alex
            </p>
            <p className="text-[12px] font-medium text-white/60 sm:text-[11px]">
              iMessage
            </p>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-3 pt-6 sm:gap-2.5 sm:pt-5">
          <motion.div
            initial={
              reduce ? false : { opacity: 0, transform: "translateY(12px)" }
            }
            whileInView={{ opacity: 1, transform: "translateY(0px)" }}
            viewport={{ once: true }}
            transition={{ ...rowEnter, delay: 0.12 }}
            className="max-w-[92%] self-start rounded-[22px] rounded-bl-[6px] bg-[#1c1c1e] px-4 py-3 sm:rounded-[20px] sm:rounded-bl-[5px] sm:px-3.5 sm:py-2.5"
          >
            <p className="text-[16px] font-normal leading-snug tracking-[-0.01em] text-white sm:text-[15px]">
              Hey, can we talk about a new product?
            </p>
          </motion.div>

          {phase === "typing" ? (
            <motion.div
              initial={{ opacity: 0, transform: "translateY(8px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              transition={rowEnter}
              className="self-end"
            >
              <div className="rounded-[22px] rounded-br-[6px] bg-[#1c1c1e] px-4 py-3.5 sm:rounded-[20px] sm:rounded-br-[5px] sm:px-3.5 sm:py-3">
                <TypingDots />
              </div>
            </motion.div>
          ) : null}

          {phase === "reply" ? (
            <>
              <motion.div
                initial={
                  reduce
                    ? false
                    : { opacity: 0, transform: "translateY(12px) scale(0.98)" }
                }
                animate={{
                  opacity: 1,
                  transform: "translateY(0px) scale(1)",
                }}
                transition={{ ...springSoft, duration: 0.48 }}
                className="flex items-end justify-end gap-2 self-end"
              >
                <div className="max-w-[88%] rounded-[22px] rounded-br-[6px] bg-[#0A84FF] px-4 py-3 shadow-[0_6px_16px_rgba(10,132,255,0.28)] sm:rounded-[20px] sm:rounded-br-[5px] sm:px-3.5 sm:py-2.5">
                  <p className="text-[16px] font-normal leading-snug tracking-[-0.01em] !text-white sm:text-[15px]">
                    Absolutely. I usually reply within{" "}
                    <span className="font-semibold">{site.responseTime}</span>.
                  </p>
                </div>
              </motion.div>
              <motion.p
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.22, duration: 0.3, ease: easeOut }}
                className="self-end pr-1 text-[12px] font-medium text-white/55 sm:text-[11px]"
              >
                Delivered
              </motion.p>
            </>
          ) : null}
        </div>
      </div>
    </Widget>
  );
}

/** Apple Music red — now-playing accent */
const MUSIC_RED = "#FA2D48";

function PlayingBars({ active }: { active: boolean }) {
  return (
    <span
      className="flex h-3.5 w-3.5 items-end justify-center gap-[2px]"
      aria-hidden
    >
      {[0.55, 1, 0.7].map((h, i) => (
        <motion.span
          key={i}
          className="w-[2.5px] rounded-full"
          style={{ background: MUSIC_RED, height: `${h * 100}%` }}
          animate={
            active
              ? { height: [`${28 + i * 10}%`, `${70 + i * 12}%`, `${28 + i * 10}%`] }
              : { height: "28%" }
          }
          transition={
            active
              ? {
                  duration: 0.7 + i * 0.12,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              : { duration: 0.25 }
          }
        />
      ))}
    </span>
  );
}

/** SF Symbol weights — Apple Music Now Playing transport */
function IconBackward({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.5 5.25a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0v-12a.75.75 0 0 1 .75-.75Z" />
      <path d="M19.9 5.52c.7-.42 1.6.08 1.6.9v11.16c0 .82-.9 1.32-1.6.9L8.95 12.9a1.05 1.05 0 0 1 0-1.8L19.9 5.52Z" />
    </svg>
  );
}

function IconForward({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.5 5.25a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0v-12a.75.75 0 0 1 .75-.75Z" />
      <path d="M4.1 5.52c-.7-.42-1.6.08-1.6.9v11.16c0 .82.9 1.32 1.6.9L15.05 12.9a1.05 1.05 0 0 0 0-1.8L4.1 5.52Z" />
    </svg>
  );
}

function IconPause({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="5.25" y="4" width="4.5" height="16" rx="1.5" />
      <rect x="14.25" y="4" width="4.5" height="16" rx="1.5" />
    </svg>
  );
}

function IconPlay({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      style={{ marginLeft: size * 0.06 }}
    >
      <path d="M7.2 3.95c0-.62.67-1.01 1.21-.7l12.1 7.05c.55.32.55 1.08 0 1.4L8.41 18.75c-.54.31-1.21-.08-1.21-.7V3.95Z" />
    </svg>
  );
}

const trackTimes = ["3:24", "2:58", "4:11"] as const;
const MUSIC_TICK_MS = 5000;

function parseTrackSeconds(label: string) {
  const [m, s] = label.split(":").map(Number);
  return (m || 0) * 60 + (s || 0);
}

function formatTrackTime(totalSec: number) {
  const s = Math.max(0, Math.floor(totalSec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

const WORK_MARKS: Record<string, string> = {
  lifemaxxing: "/work/icons/lifemaxxing.png",
  anita: "/work/icons/anita.png",
  "big-red-map": "/work/icons/big-red-map.png",
};

/** Real app icons, locked to 44×44 — next/image so we don't ship 50KB for a tile. */
function WorkMark({ slug, title }: { slug: string; title: string }) {
  const src = WORK_MARKS[slug];
  if (!src) {
    return (
      <span
        className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-white/10 text-[15px] font-bold text-white ring-1 ring-white/15"
        aria-hidden
      >
        {title.slice(0, 1)}
      </span>
    );
  }

  return (
    <span
      className="relative block size-11 shrink-0 overflow-hidden rounded-[12px] bg-black ring-1 ring-white/15"
      style={{ width: 44, height: 44, minWidth: 44, minHeight: 44, maxWidth: 44, maxHeight: 44 }}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src.replace(/\.png$/, ".webp")}
        alt=""
        width={44}
        height={44}
        decoding="async"
        loading="lazy"
        draggable={false}
        className="pointer-events-none absolute inset-0 block"
        style={{ width: 44, height: 44, maxWidth: 44, maxHeight: 44, objectFit: "cover" }}
        onError={(e) => {
          const el = e.currentTarget;
          if (!el.src.endsWith(".png")) el.src = src;
        }}
      />
    </span>
  );
}

/** Music playlist. app icons, 5s each, BRM last */
function MusicCard() {
  const reduce = useReducedMotion();
  const playlist = featuredCases;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  /** Bumps whenever playback should restart from 0 so the rAF loop rebinds. */
  const [epoch, setEpoch] = useState(0);
  const progressRef = useRef(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.35 });
  const total = playlist.length;
  const now = playlist[index] ?? playlist[0];
  const trackSec = parseTrackSeconds(trackTimes[index] ?? "3:00");
  const elapsedSec = progress * trackSec;
  const remainingSec = Math.max(0, trackSec - elapsedSec);

  const seekToStart = useCallback(() => {
    progressRef.current = 0;
    setProgress(0);
    setEpoch((e) => e + 1);
  }, []);

  const selectTrack = useCallback(
    (i: number) => {
      setIndex(i);
      seekToStart();
    },
    [seekToStart],
  );

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + total) % total);
    seekToStart();
  }, [total, seekToStart]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % total);
    seekToStart();
  }, [total, seekToStart]);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    if (!inView || reduce || !playing || total < 1) return;
    let start = performance.now() - progressRef.current * MUSIC_TICK_MS;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / MUSIC_TICK_MS);
      setProgress(p);
      progressRef.current = p;
      if (p >= 1) {
        setIndex((i) => (i + 1) % total);
        progressRef.current = 0;
        setProgress(0);
        setEpoch((e) => e + 1);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, playing, index, total, epoch]);

  return (
    <Widget
      delay={0.09}
      tone="dark"
      className="relative min-h-[360px] overflow-hidden p-7 sm:min-h-[300px] sm:p-6"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          background: `radial-gradient(ellipse at 30% 0%, ${now.color}88 0%, transparent 58%)`,
        }}
      />

      <div ref={ref} className="relative flex h-full flex-col">
        <p className="text-[17px] font-semibold tracking-[-0.02em] text-white sm:text-[15px]">
          Selected work
        </p>

        <ul className="mt-4 flex-1 sm:mt-3">
          {playlist.map((c, i) => {
            const active = i === index;
            return (
              <motion.li
                key={c.slug}
                initial={
                  reduce
                    ? false
                    : { opacity: 0, transform: "translateY(10px)" }
                }
                whileInView={{ opacity: 1, transform: "translateY(0px)" }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ ...rowEnter, delay: 0.14 + i * 0.06 }}
              >
                <Link
                  href={`/drafts/${c.slug}`}
                  onFocus={() => selectTrack(i)}
                  onClick={() => selectTrack(i)}
                  className={`flex min-h-[48px] items-center gap-3 rounded-[12px] px-1.5 py-3 transition-colors duration-[var(--duration-ui)] ease-[var(--ease-out)] sm:min-h-[44px] sm:rounded-[10px] sm:py-2.5 ${
                    active ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"
                  }`}
                >
                  <span
                    style={{
                      boxShadow: active
                        ? "0 8px 20px rgba(0,0,0,0.45)"
                        : "0 2px 8px rgba(0,0,0,0.25)",
                    }}
                    className="shrink-0 rounded-[12px]"
                  >
                    <WorkMark slug={c.slug} title={c.title} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className="block truncate text-[16px] font-semibold tracking-[-0.02em] sm:text-[15px]"
                      style={{ color: active ? MUSIC_RED : "#FFFFFF" }}
                    >
                      {c.title}
                    </span>
                    <span
                      className="mt-0.5 block truncate text-[13px] font-normal"
                      style={{ color: "rgba(235,235,245,0.4)" }}
                    >
                      {active ? "Now Playing" : c.tagline}
                    </span>
                  </span>
                  {active ? (
                    <PlayingBars active={playing && !reduce} />
                  ) : (
                    <span
                      className="text-[13px] font-normal tabular-nums"
                      style={{ color: "rgba(235,235,245,0.3)" }}
                    >
                      {trackTimes[i] ?? "3:00"}
                    </span>
                  )}
                </Link>
              </motion.li>
            );
          })}
        </ul>

        {/* Scrubber above transport — Apple Music Now Playing order */}
        <div className="mt-3">
          <div
            className="relative h-2 rounded-full"
            style={{ background: "rgba(235,235,245,0.22)" }}
            role="slider"
            aria-label="Playback position"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            aria-valuetext={`${formatTrackTime(elapsedSec)} of ${trackTimes[index] ?? "3:00"}`}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white"
              style={{ width: `${progress * 100}%` }}
            />
            <div
              aria-hidden
              className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
              style={{
                left: `${Math.min(100, Math.max(0, progress * 100))}%`,
                boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
              }}
            />
          </div>
          <div
            className="mt-1.5 flex justify-between text-[11px] font-normal tabular-nums"
            style={{ color: "rgba(235,235,245,0.4)" }}
          >
            <span>{formatTrackTime(elapsedSec)}</span>
            <span>−{formatTrackTime(remainingSec)}</span>
          </div>
        </div>

        {/* Transport — 44pt hit targets, centered like Music */}
        <div className="mt-1 flex items-center justify-center gap-6 sm:gap-10">
          <button
            type="button"
            aria-label="Previous track"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="pressable flex h-11 w-11 items-center justify-center text-white"
          >
            <IconBackward size={28} />
          </button>

          <button
            type="button"
            aria-label={playing ? "Pause" : "Play"}
            onClick={(e) => {
              e.stopPropagation();
              setPlaying((p) => !p);
            }}
            className="pressable flex h-12 w-12 items-center justify-center text-white"
          >
            {playing ? <IconPause size={36} /> : <IconPlay size={36} />}
          </button>

          <button
            type="button"
            aria-label="Next track"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="pressable flex h-11 w-11 items-center justify-center text-white"
          >
            <IconForward size={28} />
          </button>
        </div>
      </div>
    </Widget>
  );
}

/** Reminders widget. working together */
function TogetherCard() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState([true, true, true, false]);

  const items = [
    { title: "You approve each milestone", tint: "#007AFF" },
    { title: "Transparent weekly updates", tint: "#AF52DE" },
    { title: "Scope & timeline in writing", tint: "#FF9500" },
    { title: "Support after launch", tint: "#34C759" },
  ];

  return (
    <Widget
      delay={0.1}
      tone="dark"
      className="min-h-[340px] p-7 sm:min-h-[300px] sm:p-6"
    >
      <p className="text-[17px] font-semibold tracking-[-0.02em] text-white sm:text-[15px]">
        Working together
      </p>

      <ul className="mt-5 flex-1 space-y-0 sm:mt-4">
        {items.map((item, i) => {
          const checked = done[i];
          return (
            <motion.li
              key={item.title}
              initial={
                reduce ? false : { opacity: 0, transform: "translateY(10px)" }
              }
              whileInView={{ opacity: 1, transform: "translateY(0px)" }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ ...rowEnter, delay: 0.16 + i * 0.06 }}
            >
              <button
                type="button"
                onClick={() =>
                  setDone((d) => d.map((v, j) => (j === i ? !v : v)))
                }
                className={`flex min-h-[48px] w-full items-center gap-3.5 py-3 text-left sm:min-h-[44px] sm:gap-3 sm:py-2.5 ${
                  i < items.length - 1 ? "border-b border-white/[0.1]" : ""
                }`}
              >
                <span
                  className={`flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full transition-colors sm:h-[22px] sm:w-[22px] ${
                    checked ? "" : "bg-transparent"
                  }`}
                  style={{
                    background: checked ? item.tint : "transparent",
                    boxShadow: checked
                      ? "none"
                      : `inset 0 0 0 1.5px ${item.tint}`,
                  }}
                >
                  {checked ? (
                    <svg width="12" height="12" viewBox="0 0 10 10" fill="none" aria-hidden>
                      <path
                        d="M2 5.2L4.1 7.2L8 2.8"
                        stroke="white"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </span>
                <span
                  className={`text-[16px] font-medium tracking-[-0.015em] sm:text-[14px] ${
                    checked
                      ? "text-white/55 line-through decoration-white/30"
                      : "text-white"
                  }`}
                >
                  {item.title}
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>

      <Link
        href="/contact"
        className="pressable mt-4 flex min-h-[52px] items-center justify-center rounded-full bg-[#0A84FF] py-3.5 text-[16px] font-semibold !text-white transition-[filter] hover:brightness-110 sm:mt-3 sm:min-h-[48px] sm:py-3 sm:text-[15px]"
        style={{ boxShadow: "0 8px 20px rgba(10,132,255,0.3)" }}
      >
        Start a conversation
      </Link>
    </Widget>
  );
}

const STAGE_TITLE = "Deep Dive";
const PAGE_BG = "#f5f5f7";
const MID_BG = "#2c2c2e";
const STAGE_BG = "#0a0a0a";
/** Black finishes inside the pin — before any cards enter */
const EXIT = [0, 0.35, 0.72];

function setPageBlack(on: boolean) {
  const bg = on ? STAGE_BG : "";
  document.documentElement.style.backgroundColor = bg;
  document.body.style.backgroundColor = bg;
}

function StageTitleLetter({
  letter,
  index,
  reduce,
  entered,
}: {
  letter: string;
  index: number;
  reduce: boolean | null;
  entered: boolean;
}) {
  if (letter === " ") {
    return <span className="inline-block w-[0.26em]" aria-hidden />;
  }

  if (reduce) {
    return <span className="inline-block">{letter}</span>;
  }

  return (
    <motion.span
      className="inline-block"
      initial={{ opacity: 0, transform: "translateY(16px)" }}
      animate={
        entered
          ? { opacity: 1, transform: "translateY(0px)" }
          : { opacity: 0, transform: "translateY(16px)" }
      }
      transition={{
        duration: 0.36,
        delay: 0.04 + index * 0.035,
        ease: easeOut,
      }}
    >
      {letter}
    </motion.span>
  );
}

/** Piecewise lerp — avoids framer range-transform edge cases */
function lerpStops(v: number, stops: number[], values: number[]) {
  if (v <= stops[0]) return values[0];
  if (v >= stops[stops.length - 1]) return values[values.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (v >= a && v <= b) {
      const t = (v - a) / (b - a);
      return values[i] + (values[i + 1] - values[i]) * t;
    }
  }
  return values[values.length - 1];
}

function mixHex(a: string, b: string, t: number) {
  const parse = (h: string) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const c = (x: number, y: number) =>
    Math.round(x + (y - x) * Math.min(1, Math.max(0, t)))
      .toString(16)
      .padStart(2, "0");
  return `#${c(ar, br)}${c(ag, bg)}${c(ab, bb)}`;
}

/**
 * Italianno script — one string, scroll-linked write (undoes on scroll up).
 */
function OverviewHandwrite({ reduce }: { reduce: boolean | null }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const phone = useIsPhone();
  const [motionReady, setMotionReady] = useState(false);
  useEffect(() => {
    setMotionReady(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: phone
      ? ["start 0.95", "start 0.5"]
      : ["start 0.98", "start 0.42"],
  });

  // Function form of useTransform — stable in FM 13; reverses on scroll up
  const clipPath = useTransform(scrollYProgress, (v) => {
    const wipe = lerpStops(v, [0, 0.15, 0.55, 1], [102, 78, 22, -2]);
    return `inset(-10% ${wipe}% -14% -3%)`;
  });
  const opacity = useTransform(scrollYProgress, (v) =>
    lerpStops(v, [0, 0.06, 0.18, 1], [0, 0.4, 1, 1]),
  );
  const y = useTransform(scrollYProgress, (v) =>
    lerpStops(v, [0, 1], [phone ? 18 : 22, 0]),
  );
  const scale = useTransform(scrollYProgress, (v) =>
    lerpStops(v, [0, 0.35, 1], [phone ? 0.96 : 0.94, 0.985, 1]),
  );
  const filter = useTransform(scrollYProgress, (v) => {
    // Blur is paint-heavy on iOS — keep the style key stable, zero it on phone
    if (phone) return "blur(0px)";
    const blur = lerpStops(v, [0, 0.25, 0.7, 1], [8, 4, 1, 0]);
    return `blur(${blur}px)`;
  });
  const letterSpacing = useTransform(scrollYProgress, (v) => {
    const em = lerpStops(v, [0, 1], [0.05, 0.012]);
    return `${em}em`;
  });

  return (
    <motion.h3
      ref={ref}
      className="script-write pointer-events-none relative z-30 -mb-6 w-full overflow-visible px-0.5 pt-2 text-center text-[clamp(6.25rem,26vw,11rem)] leading-[0.95] text-white -rotate-[1.4deg] sm:text-[clamp(5.5rem,20vw,11rem)] md:-mb-9 md:-translate-y-5 md:text-[clamp(5.5rem,18vw,11rem)] md:will-change-[clip-path,opacity,filter,transform] lg:-mb-11 lg:-translate-y-6"
      aria-label="Overview"
      style={
        reduce || !motionReady
          ? { transformOrigin: "50% 70%" }
          : {
              clipPath,
              opacity,
              y,
              scale,
              filter,
              letterSpacing,
              transformOrigin: "50% 70%",
            }
      }
    >
      Overview
    </motion.h3>
  );
}

export function TrustSection() {
  const reduce = useReducedMotion();
  const phone = useIsPhone();
  const pinRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleInView = useInView(titleRef, { once: true, amount: 0.35 });
  const [lockedBlack, setLockedBlack] = useState(false);
  const [coarse, setCoarse] = useState(false);
  /** Gate scroll-linked styles until after hydrate — avoids opacity number/string mismatch. */
  const [motionReady, setMotionReady] = useState(false);

  useEffect(() => {
    setMotionReady(true);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const sync = () => setCoarse(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end start"],
  });

  const stageBg = useTransform(scrollYProgress, (v) => {
    if (v <= EXIT[0]) return PAGE_BG;
    if (v >= EXIT[2]) return STAGE_BG;
    if (v <= EXIT[1]) {
      const t = (v - EXIT[0]) / (EXIT[1] - EXIT[0]);
      return mixHex(PAGE_BG, MID_BG, t);
    }
    const t = (v - EXIT[1]) / (EXIT[2] - EXIT[1]);
    return mixHex(MID_BG, STAGE_BG, t);
  });

  // Soft dissolve — skip heavy blur on phone for scroll smoothness
  const blurPeak = coarse || phone ? [0, 6, 14, 22, 30, 36] : [0, 12, 36, 64, 90, 110];
  const titleScale = useTransform(scrollYProgress, (v) =>
    lerpStops(
      v,
      [0, 0.18, 0.4, 0.68],
      phone ? [1, 1.06, 1.16, 1.28] : [1, 1.12, 1.32, 1.6],
    ),
  );
  const titleOpacity = useTransform(scrollYProgress, (v) =>
    lerpStops(
      v,
      [0.06, 0.18, 0.32, 0.48, 0.62, 0.72],
      [1, 0.7, 0.4, 0.18, 0.05, 0],
    ),
  );
  const titleFilter = useTransform(scrollYProgress, (v) => {
    if (phone) return "blur(0px)";
    const blur = lerpStops(
      v,
      [0.06, 0.16, 0.3, 0.46, 0.62, 0.72],
      blurPeak,
    );
    return `blur(${blur.toFixed(2)}px)`;
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) return;
    if (v >= EXIT[2]) {
      setLockedBlack(true);
      setPageBlack(true);
      return;
    }
    // Only unlock while scrolling back through the pin — not after it leaves view
    const top = pinRef.current?.getBoundingClientRect().top ?? -Infinity;
    const stillInPin = top > -48 && top < window.innerHeight * 0.6;
    if (v < EXIT[2] - 0.08 && stillInPin) {
      setLockedBlack(false);
      setPageBlack(false);
    }
  });
  useEffect(() => {
    return () => setPageBlack(false);
  }, []);

  return (
    <motion.section
      className="relative pb-12 md:pb-16"
      style={
        reduce || lockedBlack
          ? { backgroundColor: STAGE_BG }
          : { backgroundColor: stageBg }
      }
    >
      <div ref={pinRef} className="relative h-[115svh] md:h-[125vh]">
        <div className="sticky top-0 flex h-svh w-full items-center justify-center overflow-hidden px-4 sm:px-6">
          <motion.div
            className={`px-2 text-center sm:px-6 md:will-change-[opacity,filter,transform] ${
              reduce ? "opacity-0" : ""
            }`}
            style={
              reduce || !motionReady
                ? { transformOrigin: "50% 50%" }
                : {
                    // Same keys every client frame — phone zeros blur inside titleFilter
                    scale: titleScale,
                    opacity: titleOpacity,
                    filter: titleFilter,
                    transformOrigin: "50% 50%",
                  }
            }
          >
            <h2
              ref={titleRef}
              className="editorial-display mx-auto flex w-full max-w-[min(96vw,1100px)] flex-wrap justify-center pb-[0.18em] text-[clamp(3.1rem,11vw,6.25rem)] font-medium leading-[1.12] tracking-[-0.035em] text-[#1d1d1f]"
              aria-label="Deep Dive"
            >
              {STAGE_TITLE.split("").map((letter, i) => (
                <StageTitleLetter
                  key={`${letter}-${i}`}
                  letter={letter}
                  index={i}
                  reduce={reduce}
                  entered={Boolean(reduce || titleInView)}
                />
              ))}
            </h2>
          </motion.div>
        </div>
      </div>

      <div className="relative overflow-x-clip pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <Shell className="max-md:!w-[calc(100%-1.5rem)]">
          <div className="relative mx-auto max-w-5xl overflow-x-clip md:overflow-visible">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[42%] z-0 hidden h-[78%] w-[118%] -translate-x-1/2 -translate-y-1/2 md:block"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 38%, transparent 68%)",
                filter: "blur(28px)",
              }}
            />

            <OverviewHandwrite reduce={reduce} />

            {/*
              Phone: 1 full-width column (bigger, native). Tablet: 2. Large: 3.
              Each widget rises in as it enters the viewport.
            */}
            <div className="relative z-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4 md:gap-5 lg:grid-cols-3">
              <CalendarCard />
              <StocksCard />
              <FitnessCard />
              <ResponseCard />
              <MusicCard />
              <TogetherCard />
            </div>

            <div className="relative z-10 mt-5 sm:mt-4 md:mt-5">
              <CapabilitiesBox />
            </div>
          </div>
        </Shell>
      </div>
    </motion.section>
  );
}
