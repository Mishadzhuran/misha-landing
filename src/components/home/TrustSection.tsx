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
import { easeOut, springSoft, springUi } from "@/lib/motion";

const widgetShadow =
  "0 0 0 0.5px rgba(255,255,255,0.12), 0 8px 28px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2)";
const widgetShadowHover =
  "0 0 0 0.5px rgba(255,255,255,0.18), 0 14px 36px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.22)";
const darkWidgetShadow =
  "0 0 0 0.5px rgba(255,255,255,0.16), 0 8px 28px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.25)";
const darkWidgetShadowHover =
  "0 0 0 0.5px rgba(255,255,255,0.22), 0 14px 36px rgba(0,0,0,0.48), 0 4px 12px rgba(0,0,0,0.28)";

const sf =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif';

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
  const shadow = tone === "dark" ? darkWidgetShadow : widgetShadow;
  const shadowHover = tone === "dark" ? darkWidgetShadowHover : widgetShadowHover;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 14, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25, margin: "0px 0px -32px 0px" }}
      transition={
        reduce ? { duration: 0 } : { ...springSoft, delay, duration: 0.58 }
      }
      whileHover={
        reduce
          ? undefined
          : { y: -2, boxShadow: shadowHover, transition: springUi }
      }
      className={`relative flex h-full flex-col overflow-hidden rounded-[28px] md:rounded-[32px] ${className}`}
      style={{ fontFamily: sf, boxShadow: shadow, ...style }}
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
      delay={0.02}
      tone="dark"
      className="relative p-5 md:min-h-[300px] md:p-6"
      style={{ background: "#1c1c1e" }}
    >
      <div className="flex gap-5">
        <div className="flex w-[72px] shrink-0 flex-col items-center border-r border-white/[0.08] pt-0.5 pr-4">
          <p className="text-[13px] font-semibold uppercase tracking-[0.04em] text-[#FF453A]">
            Mon
          </p>
          <p className="mt-0.5 text-[52px] font-semibold leading-none tracking-[-0.05em] tabular-nums text-white">
            1
          </p>
          <p className="mt-2 text-center text-[11px] font-medium leading-tight text-white/45">
            First
            <br />
            week
          </p>
        </div>

        <ul className="min-w-0 flex-1 space-y-0 self-center">
          {events.map((e, i) => (
            <motion.li
              key={e.title}
              initial={reduce ? false : { opacity: 0, x: 8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ...springSoft, delay: 0.16 + i * 0.06 }}
              className={`flex items-start gap-2.5 py-2.5 ${
                i < events.length - 1 ? "border-b border-white/[0.08]" : ""
              }`}
            >
              <span
                className="mt-[6px] h-[7px] w-[7px] shrink-0 rounded-full"
                style={{
                  background: e.color,
                  boxShadow: `0 0 8px ${e.color}66`,
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold tracking-[-0.02em] text-white">
                  {e.title}
                </p>
                <p
                  className="mt-0.5 text-[12px] font-medium tabular-nums"
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

/** Stocks. delivery volume (not the same as Activity) */
function StocksCard() {
  const reduce = useReducedMotion();
  const rows = [
    { label: "Projects delivered", value: stats[0].value, delta: "+4" },
    { label: "Markets", value: stats[1].value, delta: "Map" },
    { label: "Systems wired", value: stats[2].value, delta: "Stack" },
    { label: "Typical reply", value: stats[4].value, delta: "SLA" },
  ];

  return (
    <Widget delay={0.06} className="bg-white p-5 md:min-h-[300px] md:p-6">
      <p className="text-[15px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
        Results
      </p>
      <ul className="mt-3 flex-1">
        {rows.map((r, i) => (
          <motion.li
            key={r.label}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...springSoft, delay: 0.14 + i * 0.05 }}
            className={`flex items-center justify-between gap-3 py-[11px] ${
              i < rows.length - 1 ? "border-b border-black/[0.05]" : ""
            }`}
          >
            <p className="min-w-0 truncate text-[13px] font-medium text-[#6e6e73]">
              {r.label}
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <p className="text-[17px] font-semibold tabular-nums tracking-[-0.03em] text-[#1d1d1f]">
                {r.value}
              </p>
              <span className="min-w-[42px] rounded-[6px] bg-[#34C759] px-1.5 py-[3px] text-center text-[11px] font-semibold tabular-nums leading-none !text-white">
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
      delay={0.1}
      tone="dark"
      className="relative p-5 md:min-h-[300px] md:p-6"
      style={{ background: "#1c1c1e" }}
    >
      <div className="relative flex h-full flex-col">
        <p className="text-[15px] font-semibold tracking-[-0.02em] text-white">
          Activity
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <ul className="space-y-3">
            {metrics.map((m, i) => (
              <motion.li
                key={m.key}
                initial={reduce ? false : { opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ ...springSoft, delay: 0.2 + i * 0.08 }}
                className="flex items-baseline gap-2"
              >
                <span
                  className="mt-[2px] h-2 w-2 shrink-0 rounded-full"
                  style={{
                    background: m.color,
                    boxShadow: `0 0 8px ${m.color}`,
                  }}
                />
                <div>
                  <p
                    className="text-[20px] font-semibold leading-none tracking-[-0.04em] tabular-nums"
                    style={{ color: m.color }}
                  >
                    {m.value}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-white/75">
                    {m.label}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>

          <svg width="124" height="124" viewBox="0 0 124 124" aria-hidden>
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
      delay={0.05}
      className="relative flex flex-col p-5 md:min-h-[300px] md:p-6"
      style={{
        background:
          "linear-gradient(180deg, #f2f2f7 0%, #ffffff 55%, #ffffff 100%)",
      }}
    >
      <div ref={ref} className="flex h-full flex-col">
        {/* Contact = the client (the other guy) */}
        <div className="flex items-center gap-2.5 border-b border-black/[0.05] pb-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#30D158] via-[#64D2FF] to-[#0A84FF] text-[18px] shadow-sm ring-2 ring-white"
            aria-hidden
          >
            👋
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
              Alex
            </p>
            <p className="text-[11px] font-medium text-[#8e8e93]">iMessage</p>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2.5 pt-5">
          {/* Incoming ask from the client */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ ...springSoft, delay: 0.08 }}
            className="max-w-[90%] self-start rounded-[20px] rounded-bl-[5px] bg-[#e9e9eb] px-3.5 py-2.5"
          >
            <p className="text-[15px] font-normal leading-snug tracking-[-0.01em] text-[#1d1d1f]">
              Hey, can we talk about a new product?
            </p>
          </motion.div>

          {/* You typing, then your blue reply */}
          {phase === "typing" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="self-end"
            >
              <div className="rounded-[20px] rounded-br-[5px] bg-[#e9e9eb] px-3.5 py-3">
                <TypingDots />
              </div>
            </motion.div>
          ) : null}

          {phase === "reply" ? (
            <>
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 10, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ ...springSoft, duration: 0.45 }}
                className="flex items-end justify-end gap-2 self-end"
              >
                <div className="max-w-[85%] rounded-[20px] rounded-br-[5px] bg-[#007AFF] px-3.5 py-2.5 shadow-[0_6px_16px_rgba(0,122,255,0.22)]">
                  <p className="text-[15px] font-normal leading-snug tracking-[-0.01em] !text-white">
                    Absolutely. I usually reply within{" "}
                    <span className="font-semibold">{site.responseTime}</span>.
                  </p>
                </div>
              </motion.div>
              <motion.p
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.35 }}
                className="self-end pr-1 text-[11px] font-medium text-[#8e8e93]"
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

/** Real app icons, locked to 44×44 so they never escape the tile. */
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
        src={`${src}?v=7`}
        alt=""
        width={44}
        height={44}
        decoding="async"
        draggable={false}
        className="pointer-events-none absolute inset-0 block"
        style={{ width: 44, height: 44, maxWidth: 44, maxHeight: 44, objectFit: "cover" }}
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
      className="relative overflow-hidden p-5 md:min-h-[300px] md:p-6"
      style={{ background: "#1c1c1e" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          background: `radial-gradient(ellipse at 30% 0%, ${now.color}88 0%, transparent 58%)`,
        }}
      />

      <div ref={ref} className="relative flex h-full flex-col">
        <p className="text-[15px] font-semibold tracking-[-0.02em] text-white">
          Selected work
        </p>

        <ul className="mt-3 flex-1">
          {playlist.map((c, i) => {
            const active = i === index;
            return (
              <li key={c.slug}>
                <Link
                  href={`/drafts/${c.slug}`}
                  onFocus={() => selectTrack(i)}
                  onClick={() => selectTrack(i)}
                  className={`flex items-center gap-3 rounded-[10px] px-1.5 py-2 transition-colors duration-[var(--duration-ui)] ease-[var(--ease-out)] ${
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
                      className="block truncate text-[15px] font-semibold tracking-[-0.02em]"
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
              </li>
            );
          })}
        </ul>

        {/* Scrubber above transport — Apple Music Now Playing order */}
        <div className="mt-3">
          <div
            className="relative h-[5px] rounded-full"
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
              className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
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
        <div className="mt-1 flex items-center justify-center gap-10">
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
    <Widget delay={0.13} className="bg-white p-5 md:min-h-[300px] md:p-6">
      <p className="text-[15px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
        Working together
      </p>

      <ul className="mt-4 flex-1 space-y-0">
        {items.map((item, i) => {
          const checked = done[i];
          return (
            <motion.li
              key={item.title}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springSoft, delay: 0.14 + i * 0.05 }}
            >
              <button
                type="button"
                onClick={() =>
                  setDone((d) => d.map((v, j) => (j === i ? !v : v)))
                }
                className={`flex w-full items-center gap-3 py-2.5 text-left ${
                  i < items.length - 1 ? "border-b border-black/[0.05]" : ""
                }`}
              >
                <span
                  className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full transition-colors ${
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
                    <svg width="11" height="11" viewBox="0 0 10 10" fill="none" aria-hidden>
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
                  className={`text-[14px] font-medium tracking-[-0.015em] ${
                    checked
                      ? "text-[#8e8e93] line-through decoration-[#c7c7cc]"
                      : "text-[#1d1d1f]"
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
        className="pressable mt-3 flex items-center justify-center rounded-full bg-[#007AFF] py-3 text-[14px] font-semibold !text-white transition-[filter] hover:brightness-110"
        style={{ boxShadow: "0 8px 20px rgba(0,122,255,0.25)" }}
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
const EXIT = [0, 0.35, 0.72] as const;

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
      initial={{ opacity: 0, y: 18 }}
      animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{
        duration: 0.4,
        delay: 0.05 + index * 0.04,
        ease: easeOut,
      }}
    >
      {letter}
    </motion.span>
  );
}

export function TrustSection() {
  const reduce = useReducedMotion();
  const pinRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleInView = useInView(titleRef, { once: true, amount: 0.35 });
  const [lockedBlack, setLockedBlack] = useState(false);

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end start"],
  });

  const stageBg = useTransform(
    scrollYProgress,
    EXIT,
    [PAGE_BG, MID_BG, STAGE_BG],
  );
  const titleScale = useTransform(scrollYProgress, [0, 0.58], [1, 1.55]);
  const titleOpacity = useTransform(scrollYProgress, [0.08, 0.55], [1, 0]);
  const titleBlur = useTransform(scrollYProgress, [0.08, 0.55], [0, 18]);
  const titleFilter = useTransform(titleBlur, (b) => `blur(${b}px)`);

  const boardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: boardProgress } = useScroll({
    target: boardRef,
    offset: ["start 0.92", "start 0.38"],
  });
  // Overview above the cards — reveals with scroll, not a static label
  const overviewOpacity = useTransform(boardProgress, [0, 0.55, 1], [0, 0.85, 1]);
  const overviewY = useTransform(boardProgress, [0, 1], [56, 0]);
  const overviewScale = useTransform(boardProgress, [0, 1], [0.92, 1]);
  const overviewBlur = useTransform(boardProgress, [0, 0.7, 1], [14, 2, 0]);
  const overviewFilter = useTransform(overviewBlur, (b) => `blur(${b}px)`);
  const overviewTrack = useTransform(boardProgress, [0, 1], [0.06, 0.01]);
  const overviewLetterSpacing = useTransform(
    overviewTrack,
    (v) => `${v}em`,
  );

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) return;
    const on = v >= EXIT[2];
    setLockedBlack(on);
    setPageBlack(on);
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
      {/* Pin: Deep Dive only */}
      <div ref={pinRef} className="relative h-[120vh] md:h-[125vh]">
        <div className="sticky top-0 flex h-svh w-full items-center justify-center overflow-hidden">
          <motion.div
            className="px-3 text-center sm:px-6"
            style={
              reduce
                ? { opacity: 0 }
                : {
                    scale: titleScale,
                    opacity: titleOpacity,
                    filter: titleFilter,
                  }
            }
          >
            <h2
              ref={titleRef}
              className="editorial-display mx-auto flex w-full max-w-[min(96vw,1100px)] flex-wrap justify-center pb-[0.18em] text-[clamp(3.2rem,11vw,6.25rem)] font-medium leading-[1.12] tracking-[-0.035em] text-[#1d1d1f]"
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

      <div ref={boardRef} className="relative">
        <Shell>
          <div className="relative mx-auto max-w-5xl overflow-visible">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[42%] z-0 h-[78%] w-[118%] -translate-x-1/2 -translate-y-1/2"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 38%, transparent 68%)",
                filter: "blur(28px)",
              }}
            />

            <motion.h3
              className="relative z-20 mb-8 block w-full pt-6 text-center text-[clamp(5.5rem,18vw,11rem)] leading-[0.9] text-white will-change-transform md:mb-10 md:pt-8"
              style={
                reduce
                  ? {
                      fontFamily:
                        "var(--font-italianno), var(--font-instrument), 'Segoe Script', Georgia, cursive",
                    }
                  : {
                      opacity: overviewOpacity,
                      y: overviewY,
                      scale: overviewScale,
                      filter: overviewFilter,
                      letterSpacing: overviewLetterSpacing,
                      fontFamily:
                        "var(--font-italianno), var(--font-instrument), 'Segoe Script', Georgia, cursive",
                    }
              }
            >
              Overview
            </motion.h3>

            <div className="relative z-10 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
              <CalendarCard />
              <StocksCard />
              <FitnessCard />
              <ResponseCard />
              <MusicCard />
              <TogetherCard />
            </div>

            <div className="relative z-10">
              <CapabilitiesBox />
            </div>
          </div>
        </Shell>
      </div>
    </motion.section>
  );
}
