"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
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
  "0 0 0 0.5px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04), 0 12px 28px rgba(0,0,0,0.06)";
const widgetShadowHover =
  "0 0 0 0.5px rgba(0,0,0,0.05), 0 4px 14px rgba(0,0,0,0.06), 0 18px 40px rgba(0,0,0,0.08)";

const sf =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif';

function Widget({
  children,
  className = "",
  delay = 0,
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
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
          : { y: -2, boxShadow: widgetShadowHover, transition: springUi }
      }
      className={`flex h-full flex-col overflow-hidden rounded-[28px] md:rounded-[32px] ${className}`}
      style={{ fontFamily: sf, boxShadow: widgetShadow, ...style }}
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
  ];

  return (
    <Widget
      delay={0.02}
      className="bg-white p-5 md:min-h-[300px] md:p-6"
      style={{ background: "#ffffff" }}
    >
      <div className="flex gap-5">
        <div className="flex w-[72px] shrink-0 flex-col items-center pt-0.5">
          <p className="text-[13px] font-semibold uppercase tracking-[0.04em] text-[#FF3B30]">
            Mon
          </p>
          <p className="mt-0.5 text-[52px] font-semibold leading-none tracking-[-0.05em] tabular-nums text-[#1d1d1f]">
            1
          </p>
          <p className="mt-2 text-center text-[11px] font-medium leading-tight text-[#8e8e93]">
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
                i < events.length - 1 ? "border-b border-black/[0.05]" : ""
              }`}
            >
              <span
                className="mt-[6px] h-[7px] w-[7px] shrink-0 rounded-full"
                style={{ background: e.color }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
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
      className="relative p-5 md:min-h-[300px] md:p-6"
      style={{ background: "#000000" }}
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
                  <p className="mt-0.5 text-[11px] font-medium text-white/40">
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

function PlayingBars({ active }: { active: boolean }) {
  return (
    <span
      className="flex h-3.5 w-3.5 items-end justify-center gap-[2px]"
      aria-hidden
    >
      {[0.55, 1, 0.7].map((h, i) => (
        <motion.span
          key={i}
          className="w-[2.5px] rounded-full bg-[#FF375F]"
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
          style={{ height: `${h * 100}%` }}
        />
      ))}
    </span>
  );
}

const trackTimes = ["3:24", "2:58", "4:11"] as const;
const MUSIC_TICK_MS = 5000;

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
  const [pausedUntil, setPausedUntil] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.35 });
  const total = playlist.length;
  const now = playlist[index] ?? playlist[0];

  const bump = useCallback(() => {
    setPausedUntil(Date.now() + 8000);
  }, []);

  useEffect(() => {
    if (!inView || reduce || total < 2) return;
    if (Date.now() < pausedUntil) {
      const left = Math.max(0, pausedUntil - Date.now());
      const t = window.setTimeout(() => setPausedUntil(0), left + 16);
      return () => window.clearTimeout(t);
    }
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, MUSIC_TICK_MS);
    return () => window.clearInterval(id);
  }, [inView, reduce, pausedUntil, total]);

  return (
    <Widget
      delay={0.09}
      className="relative overflow-hidden p-5 md:min-h-[300px] md:p-6"
      style={{ background: "#0a0a0a" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          background: `radial-gradient(ellipse at 28% 0%, ${now.color}88 0%, transparent 55%), linear-gradient(180deg, #1a1a1c 0%, #0a0a0a 70%)`,
        }}
      />

      <div ref={ref} className="relative flex h-full flex-col">
        <p className="text-[15px] font-semibold tracking-[-0.02em] text-white">
          Selected work
        </p>

        <ul className="mt-4 flex-1">
          {playlist.map((c, i) => {
            const playing = i === index;
            return (
              <li key={c.slug}>
                <Link
                  href={`/drafts/${c.slug}`}
                  onClick={bump}
                  onFocus={() => {
                    bump();
                    setIndex(i);
                  }}
                  className={`flex items-center gap-3 rounded-[12px] px-1.5 py-2 transition-colors ${
                    playing ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"
                  }`}
                >
                  <span
                    style={{
                      boxShadow: playing
                        ? "0 8px 20px rgba(0,0,0,0.45)"
                        : "0 2px 8px rgba(0,0,0,0.25)",
                    }}
                    className="shrink-0 rounded-[12px]"
                  >
                    <WorkMark slug={c.slug} title={c.title} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate text-[14px] font-semibold tracking-[-0.015em] ${
                        playing ? "text-[#FF375F]" : "text-white"
                      }`}
                    >
                      {c.title}
                    </span>
                    <span className="mt-0.5 block truncate text-[12px] font-medium text-white/40">
                      {playing ? "Now playing" : c.tagline}
                    </span>
                  </span>
                  {playing ? (
                    <PlayingBars active={!reduce} />
                  ) : (
                    <span className="text-[12px] font-medium tabular-nums text-white/30">
                      {trackTimes[i] ?? "3:00"}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-3">
          <div className="h-[3px] overflow-hidden rounded-full bg-white/15">
            <motion.div
              key={`prog-${now.slug}-${index}`}
              className="h-full rounded-full bg-white"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: MUSIC_TICK_MS / 1000, ease: "linear" }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] font-medium tabular-nums text-white/35">
            <span>0:00</span>
            <span>−{trackTimes[index] ?? "3:00"}</span>
          </div>
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
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#007AFF]">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M3.5 7.2l2.2 2.2L10.5 4.2"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <p className="text-[15px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
          Working together
        </p>
      </div>

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

export function TrustSection() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-x-clip py-14 md:py-24">
      <Shell className="relative">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-[clamp(2rem,4.2vw,2.85rem)] font-semibold tracking-[-0.045em] text-[#1d1d1f]">
            What you get with me
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[16px] font-medium leading-relaxed text-[#6e6e73]">
            Clear process, verified delivery, and production systems from
            products already in market.
          </p>
        </motion.div>

        <div className="mx-auto max-w-5xl">
          <div className="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4 md:mt-10">
            <CalendarCard />
            <StocksCard />
            <FitnessCard />
            <ResponseCard />
            <MusicCard />
            <TogetherCard />
          </div>

          <CapabilitiesBox />
        </div>
      </Shell>
    </section>
  );
}
