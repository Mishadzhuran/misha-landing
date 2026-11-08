"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { easeOut, springSnap, springSoft, springUi } from "@/lib/motion";

const ease = easeOut;
const spring = springSnap;
const soft = springSoft;

const FLOW = [
  { id: "talk", label: "Talk", title: "Talk" },
  { id: "agree", label: "Agree", title: "Agree" },
  { id: "build", label: "Build", title: "Build" },
  { id: "launch", label: "Launch", title: "Launch" },
] as const;

/** Dwell = original animation end + 1.5s hold (animations unchanged) */
const HOLD_AFTER_MS = 1500;
const STEP_DURATION_MS = [
  2150 + HOLD_AFTER_MS, // Talk — calendar “Booked”
  1050 + 550 + 1050 + HOLD_AFTER_MS, // Agree — PDF open + signature draw
  500 + 3 * 900 + HOLD_AFTER_MS, // Build — last check + ring
  1200 + HOLD_AFTER_MS, // Launch
] as const;

function Glass({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[16px] bg-white/78 ring-1 ring-black/[0.04] shadow-[0_1px_0_rgba(255,255,255,0.7)_inset] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

function ScreenTalk() {
  return (
    <div className="flex h-full flex-col gap-2.5">
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.15, ...soft }}
        className="ml-auto max-w-[86%] rounded-[18px] rounded-br-[5px] bg-[#0071e3] px-3.5 py-2.5 shadow-[0_8px_20px_rgba(0,113,227,0.25)]"
      >
        <p className="text-[12px] leading-snug !text-white">
          Hey, thinking about building an app
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.75, ...soft }}
      >
        <Glass className="max-w-[90%] rounded-bl-[5px] px-3.5 py-2.5">
          <p className="text-[12px] leading-snug text-[#1d1d1f]">
            Love that. Want to hop on a quick call this week?
          </p>
        </Glass>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.35, ...soft }}
        className="ml-auto max-w-[86%] rounded-[18px] rounded-br-[5px] bg-[#0071e3] px-3.5 py-2.5 shadow-[0_8px_20px_rgba(0,113,227,0.25)]"
      >
        <p className="text-[12px] leading-snug !text-white">
          Yeah, that’d be great
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.95, ...soft }}
        className="mt-auto"
      >
        <Glass className="flex items-center gap-2.5 px-3 py-2.5">
          <div className="flex size-9 shrink-0 flex-col overflow-hidden rounded-[8px] bg-white ring-1 ring-black/[0.08]">
            <span className="bg-[#ff3b30] py-px text-center text-[6px] font-bold uppercase leading-none tracking-[0.04em] !text-white">
              Mon
            </span>
            <span className="flex flex-1 items-center justify-center text-[14px] font-semibold leading-none tracking-[-0.04em] text-[#1d1d1f]">
              30
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-[#1d1d1f]">
              Discovery call
            </p>
            <p className="mt-0.5 text-[10px] font-medium text-[#86868b]">
              10:00 to 10:30 AM
            </p>
          </div>
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.15, ...spring }}
            className="shrink-0 rounded-full bg-[#34c759]/15 px-2.5 py-0.5 text-[10px] font-semibold text-[#248a3d]"
          >
            Booked
          </motion.span>
        </Glass>
      </motion.div>
    </div>
  );
}

function PdfGlyph({ size = 36 }: { size?: number }) {
  const r = Math.round(size * 0.22);
  return (
    <div
      className="relative flex shrink-0 items-end justify-center overflow-hidden pb-[5px]"
      style={{
        width: size,
        height: size * 1.15,
        borderRadius: r,
        background: "linear-gradient(180deg, #ff6961 0%, #ff3b30 55%, #e0352b 100%)",
        boxShadow:
          "0 0.5px 0 rgba(255,255,255,0.25) inset, 0 1px 2px rgba(255,59,48,0.28)",
      }}
    >
      <span
        aria-hidden
        className="absolute right-0 top-0"
        style={{
          width: size * 0.32,
          height: size * 0.32,
          background: "#ffe3e1",
          clipPath: "polygon(0 0, 100% 100%, 100% 0)",
          boxShadow: "-0.5px 0.5px 0 rgba(0,0,0,0.06)",
        }}
      />
      <span
        className="font-bold tracking-[0.06em] !text-white"
        style={{ fontSize: Math.max(7, size * 0.22) }}
      >
        PDF
      </span>
    </div>
  );
}

function ScreenAgree() {
  const [phase, setPhase] = useState<"list" | "pressed" | "open">("list");
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setPhase("open");
      return;
    }
    const press = window.setTimeout(() => setPhase("pressed"), 700);
    const open = window.setTimeout(() => setPhase("open"), 1050);
    return () => {
      window.clearTimeout(press);
      window.clearTimeout(open);
    };
  }, [reduce]);

  const bullets = [
    "Design the full product experience",
    "Build and ship a working MVP",
    "Get it onto TestFlight and the App Store",
  ];

  return (
    <div className="relative h-full overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        {phase !== "open" ? (
          <motion.div
            key="files"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease }}
            className="flex h-full flex-col"
          >
            <p className="mb-1.5 px-1 text-[13px] font-semibold tracking-[-0.01em] text-[#007aff]">
              Recents
            </p>

            {/* iOS Files inset list */}
            <div className="overflow-hidden rounded-[12px] bg-white">
              <motion.div
                animate={{
                  backgroundColor:
                    phase === "pressed" ? "#d1d1d6" : "#ffffff",
                }}
                transition={{ duration: 0.12, ease }}
                className="flex items-center gap-3 px-3 py-2.5"
              >
                <PdfGlyph size={34} />
                <div className="min-w-0 flex-1 border-b border-transparent py-0.5">
                  <p className="truncate text-[15px] font-normal tracking-[-0.02em] text-[#1d1d1f]">
                    Proposal.pdf
                  </p>
                  <p className="mt-0.5 text-[12px] font-normal text-[#8e8e93]">
                    Today · 240 KB
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="pdf"
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.8 }}
            className="flex h-full flex-col overflow-hidden rounded-[14px] bg-[#6d6d72]"
            style={{
              boxShadow:
                "0 0 0 0.5px rgba(0,0,0,0.2), 0 12px 28px rgba(0,0,0,0.18)",
            }}
          >
            {/* Quick Look toolbar */}
            <div
              className="flex shrink-0 items-center justify-between px-2.5 pb-1.5 pt-2"
              style={{
                background:
                  "linear-gradient(180deg, rgba(90,90,94,0.95) 0%, rgba(109,109,114,0.85) 100%)",
              }}
            >
              <span className="min-w-[36px] text-[13px] font-normal text-[#0a84ff]">
                Done
              </span>
              <div className="min-w-0 flex-1 px-1 text-center">
                <p className="truncate text-[11px] font-semibold !text-white">
                  Proposal.pdf
                </p>
                <p className="text-[9px] font-medium !text-white/55">Page 1 of 1</p>
              </div>
              <span className="flex min-w-[36px] justify-end">
                <span className="flex size-[26px] items-center justify-center rounded-full bg-white/12">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path
                      d="M6 1.2v6.2M3.4 5L6 7.6 8.6 5"
                      stroke="white"
                      strokeWidth="1.35"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 10.2h8"
                      stroke="white"
                      strokeWidth="1.35"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </span>
            </div>

            {/* Page well — real one-pager */}
            <div className="flex min-h-0 flex-1 items-stretch justify-center px-2 pb-2.5 pt-1">
              <div
                className="relative flex w-full flex-col overflow-hidden bg-[#fffefb] px-[14px] pt-4 pb-3"
                style={{
                  borderRadius: "2px",
                  boxShadow:
                    "0 1px 0 rgba(255,255,255,0.6) inset, 0 4px 16px rgba(0,0,0,0.22)",
                }}
              >
                <p
                  className="text-[8px] font-medium tracking-[0.02em] text-[#8e8e93]"
                  style={{ fontFamily: "ui-serif, Georgia, 'Times New Roman', serif" }}
                >
                  Appigon · Confidential
                </p>

                <p
                  className="mt-3 text-[16px] leading-none tracking-[-0.02em] text-[#1d1d1f]"
                  style={{
                    fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                    fontWeight: 600,
                  }}
                >
                  Build proposal
                </p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.35 }}
                  className="mt-3 text-[10px] leading-[1.55] text-[#3a3a3c]"
                  style={{ fontFamily: "ui-serif, Georgia, 'Times New Roman', serif" }}
                >
                  We’ll design and build your product MVP in six weeks for a fixed fee, from first screens to a live release.
                </motion.p>

                <p
                  className="mt-3.5 text-[10px] font-semibold text-[#1d1d1f]"
                  style={{ fontFamily: "ui-serif, Georgia, 'Times New Roman', serif" }}
                >
                  Included
                </p>
                <div className="mt-1.5 space-y-[4px]">
                  {bullets.map((b, i) => (
                    <motion.p
                      key={b}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.28 + i * 0.07, duration: 0.3 }}
                      className="text-[10px] leading-[1.45] text-[#3a3a3c]"
                      style={{
                        fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                      }}
                    >
                      • {b}
                    </motion.p>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55, duration: 0.35 }}
                  className="mt-auto"
                >
                  <motion.svg
                    width="78"
                    height="30"
                    viewBox="0 0 78 30"
                    fill="none"
                    aria-hidden
                    className="mb-0.5 text-[#111]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                  >
                    {/* Autograph: big J-loop → uu → tall l → exit tail */}
                    <motion.path
                      d="
                        M 4 11
                        C 7 7.5, 11 5.5, 15 5.2
                        C 18.5 5, 20.5 7.5, 19.5 11
                        C 18.2 15.5, 14 22, 10.5 26.5
                        C 8.5 29, 6.5 28.5, 7.5 25.5
                        C 9 21.5, 14 16, 20 14.5
                        C 23.5 13.6, 26 15.2, 25.2 17.8
                        C 24.5 20, 22.2 21.2, 20.5 20.2
                        C 22.5 18.8, 26.5 17.5, 30 18.2
                        C 32.5 18.7, 34.2 20.4, 33.4 22.2
                        C 32.7 23.8, 30.6 24.4, 29.2 23.2
                        C 31.5 21.5, 36 19.5, 40.5 16
                        C 43.5 13.6, 45.5 9.5, 45.8 5.5
                        C 46 2.8, 44.2 1.6, 42.5 3.2
                        C 40.5 5.2, 40.2 11, 41.5 16.5
                        C 42.5 20.5, 44.5 23.5, 47 24
                        C 49.5 22.5, 52.5 20.8, 55.5 21.2
                        C 57.5 21.5, 58.5 23, 57.5 24.2
                        C 56.6 25.3, 55 25.2, 54.2 24
                        C 56.5 23.2, 61 23.5, 66 21
                        C 70 18.8, 74 15.5, 76.5 12.5
                      "
                      stroke="currentColor"
                      strokeWidth="1.35"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.55, duration: 1.05, ease }}
                    />
                  </motion.svg>
                  <p
                    className="text-[9px] text-[#6e6e73]"
                    style={{
                      fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                    }}
                  >
                    Agreed · Today
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScreenBuild() {
  const STEPS = [
    { t: "Design system", color: "#ff9f0a" },
    { t: "Core product", color: "#007aff" },
    { t: "TestFlight", color: "#af52de" },
    { t: "Store release", color: "#30d158" },
  ] as const;

  // Ring reaches 100% with the last check
  const STEP_MS = 900;
  const START_MS = 500;
  const FILL_MS = START_MS + (STEPS.length - 1) * STEP_MS;

  const reduce = useReducedMotion();
  const [doneCount, setDoneCount] = useState(0);
  const [pctLabel, setPctLabel] = useState(0);
  const total = STEPS.length;
  const allDone = doneCount >= total;

  const r = 28;
  const circ = 2 * Math.PI * r;
  const progress = useMotionValue(0);
  const dashOffset = useTransform(progress, [0, 1], [circ, 0]);
  const checkSpring = { type: "spring" as const, stiffness: 520, damping: 32, mass: 0.7 };

  useEffect(() => {
    const unsub = progress.on("change", (v) => {
      setPctLabel(Math.round(v * 100));
    });

    if (reduce) {
      progress.set(1);
      setDoneCount(total);
      return () => unsub();
    }

    setDoneCount(0);
    progress.set(0);

    const fill = animate(progress, 1, {
      duration: FILL_MS / 1000,
      ease: [0.4, 0, 0.2, 1],
    });

    const timers: number[] = [];
    for (let i = 1; i <= total; i++) {
      timers.push(
        window.setTimeout(() => setDoneCount(i), START_MS + (i - 1) * STEP_MS),
      );
    }

    return () => {
      unsub();
      fill.stop();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [reduce, total, progress, FILL_MS, START_MS, STEP_MS]);

  return (
    <div className="flex h-full flex-col gap-3">
      {/* Fitness-style progress */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        className="flex items-center gap-3.5 px-1"
      >
        <div className="relative size-[72px] shrink-0">
          <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
            <circle
              cx="36"
              cy="36"
              r={r}
              fill="none"
              stroke="#e5e5ea"
              strokeWidth="6"
            />
            <motion.circle
              cx="36"
              cy="36"
              r={r}
              fill="none"
              stroke={allDone ? "#30d158" : "#007aff"}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circ}
              style={{ strokeDashoffset: dashOffset }}
              animate={{ stroke: allDone ? "#30d158" : "#007aff" }}
              transition={{ duration: 0.45, ease }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[17px] font-semibold leading-none tracking-[-0.045em] tabular-nums text-[#1d1d1f]">
              {pctLabel}
              <span className="text-[11px] font-semibold tracking-[-0.02em] text-[#8e8e93]">
                %
              </span>
            </p>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[20px] font-semibold tracking-[-0.04em] text-[#1d1d1f]">
            {allDone ? "Ready" : "In progress"}
          </p>
          <p className="mt-0.5 text-[13px] font-normal text-[#8e8e93]">
            {allDone ? "Ship when you’re set" : `Week 4 · ${doneCount}/${total}`}
          </p>
        </div>
      </motion.div>

      {/* Reminders list */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.4, ease }}
        className="overflow-hidden rounded-[14px] bg-white"
      >
        {STEPS.map((step, i) => {
          const done = doneCount > i;
          const active = !done && doneCount === i;

          return (
            <div
              key={step.t}
              className="relative flex items-center gap-3 px-3.5 py-[13px]"
            >
              {i < STEPS.length - 1 && (
                <span
                  className="absolute bottom-0 right-0 h-px bg-[#c6c6c8]/60"
                  style={{ left: 48 }}
                />
              )}

              <motion.span
                className="relative flex size-[22px] shrink-0 items-center justify-center rounded-full"
                animate={{
                  backgroundColor: done ? step.color : "rgba(0,0,0,0)",
                }}
                initial={false}
                transition={{ backgroundColor: { duration: 0.2, ease } }}
                style={{
                  borderWidth: done ? 0 : active ? 2.5 : 2,
                  borderStyle: "solid",
                  borderColor: step.color,
                }}
              >
                <motion.svg
                  width="11"
                  height="11"
                  viewBox="0 0 10 10"
                  fill="none"
                  aria-hidden
                  initial={false}
                  animate={{ opacity: done ? 1 : 0, scale: done ? 1 : 0.7 }}
                  transition={checkSpring}
                >
                  <path
                    d="M2 5.2L4.1 7.2L8 2.8"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </motion.span>

              <span
                className="min-w-0 flex-1 truncate text-[16px] tracking-[-0.022em] transition-[color,text-decoration-color] duration-300 ease-out"
                style={{
                  color: done ? "#8e8e93" : "#1d1d1f",
                  textDecoration: done ? "line-through" : "none",
                  textDecorationColor: done ? "#c7c7cc" : "transparent",
                }}
              >
                {step.t}
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

/** Mini status bar for App Store preview frames */
function ShotStatusBar({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className="flex h-[11px] shrink-0 items-center justify-between px-1.5"
      style={{ color: dark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)" }}
    >
      <span className="text-[5px] font-semibold tabular-nums leading-none">
        9:41
      </span>
      <span
        className="h-[3.5px] w-[10px] rounded-[1px]"
        style={{
          background: dark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)",
        }}
      />
    </div>
  );
}

/** App Store product page — polished screenshots + store chrome */
function ScreenLaunch() {
  const shots = [
    {
      key: "home",
      shell: "#f2f2f7",
      dark: false,
      ui: (
        <div className="flex min-h-0 flex-1 flex-col gap-1 px-1 pb-1">
          <p className="text-[7px] font-bold tracking-[-0.02em] text-[#1d1d1f]">
            Today
          </p>
          <div className="grid grid-cols-2 gap-1">
            <div className="rounded-[7px] bg-white p-1 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <p className="text-[5px] font-semibold text-[#8e8e93]">Tasks</p>
              <p className="mt-0.5 text-[10px] font-bold leading-none tracking-[-0.04em] text-[#1d1d1f]">
                12
              </p>
              <div className="mt-1 h-[3px] overflow-hidden rounded-full bg-[#007aff]/15">
                <div className="h-full w-[72%] rounded-full bg-[#007aff]" />
              </div>
            </div>
            <div className="rounded-[7px] bg-white p-1 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <p className="text-[5px] font-semibold text-[#8e8e93]">Done</p>
              <p className="mt-0.5 text-[10px] font-bold leading-none tracking-[-0.04em] text-[#34c759]">
                8
              </p>
              <div className="mt-1 h-[3px] overflow-hidden rounded-full bg-[#34c759]/15">
                <div className="h-full w-[66%] rounded-full bg-[#34c759]" />
              </div>
            </div>
          </div>
          <div className="min-h-0 flex-1 rounded-[7px] bg-white p-1 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <p className="text-[5px] font-semibold text-[#8e8e93]">This week</p>
            <div className="mt-1 flex h-[calc(100%-10px)] items-end gap-[2px]">
              {[35, 55, 42, 78, 50, 92, 68].map((h, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-[2px]"
                  style={{
                    height: `${h}%`,
                    background:
                      i === 5
                        ? "#007aff"
                        : "linear-gradient(180deg, #64d2ff, #007aff)",
                    opacity: i === 5 ? 1 : 0.45,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "focus",
      shell: "#000000",
      dark: true,
      ui: (
        <div className="flex min-h-0 flex-1 flex-col px-1.5 pb-1.5">
          <div className="flex items-center justify-between">
            <p className="text-[7px] font-bold !text-white">Focus</p>
            <span className="rounded-full bg-white/12 px-1 py-px text-[4px] font-semibold !text-white/70">
              Live
            </span>
          </div>
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
            <div className="relative size-[44px]">
              <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90">
                <circle
                  cx="22"
                  cy="22"
                  r="17"
                  fill="none"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="4"
                />
                <circle
                  cx="22"
                  cy="22"
                  r="17"
                  fill="none"
                  stroke="#30d158"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 17}`}
                  strokeDashoffset={`${2 * Math.PI * 17 * 0.28}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[11px] font-bold leading-none tracking-[-0.04em] !text-white">
                  42
                </span>
                <span className="text-[4px] font-medium !text-white/45">min</span>
              </div>
            </div>
            <p className="mt-1.5 text-[6px] font-semibold !text-white/55">
              Deep work
            </p>
          </div>
          <div className="flex gap-1">
            <div className="h-[14px] flex-1 rounded-full bg-white/10" />
            <div className="flex h-[14px] flex-1 items-center justify-center rounded-full bg-[#30d158]">
              <span className="text-[5px] font-bold !text-black">Start</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "team",
      shell: "#ffffff",
      dark: false,
      ui: (
        <div className="flex min-h-0 flex-1 flex-col gap-1 px-1 pb-1">
          <p className="text-[7px] font-bold tracking-[-0.02em] text-[#1d1d1f]">
            Team
          </p>
          <div className="space-y-[3px]">
            {[
              { c: "#007aff", n: "Alex", s: "Online" },
              { c: "#34c759", n: "Sam", s: "Design" },
              { c: "#ff9f0a", n: "Jordan", s: "Away" },
            ].map((p) => (
              <div
                key={p.n}
                className="flex items-center gap-1 rounded-[7px] bg-[#f2f2f7] px-1 py-[4px]"
              >
                <span
                  className="flex size-[12px] shrink-0 items-center justify-center rounded-full text-[5px] font-bold !text-white"
                  style={{ background: p.c }}
                >
                  {p.n[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[6px] font-semibold leading-none text-[#1d1d1f]">
                    {p.n}
                  </p>
                  <p className="mt-px truncate text-[4.5px] font-medium leading-none text-[#8e8e93]">
                    {p.s}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto flex h-[16px] items-center justify-center rounded-full bg-[#007aff] shadow-[0_2px_6px_rgba(0,122,255,0.3)]">
            <span className="text-[6px] font-bold !text-white">Share</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* App Store header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={soft}
        className="flex items-center gap-2.5"
      >
        <div
          className="relative size-[54px] shrink-0 overflow-hidden"
          style={{
            borderRadius: "22.37%",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.14), inset 0 0 0 0.5px rgba(255,255,255,0.2)",
            background:
              "linear-gradient(145deg, #3a3a3c 0%, #1c1c1e 45%, #000 100%)",
          }}
        >
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-[42%] bg-gradient-to-b from-white/22 to-transparent"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative size-[24px]">
              <span className="absolute inset-0 rounded-full border-[2.5px] border-white" />
              <span className="absolute left-1/2 top-1/2 size-[8px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold leading-tight tracking-[-0.025em] text-[#1d1d1f]">
            Your App
          </p>
          <p className="mt-0.5 truncate text-[11px] font-medium text-[#8e8e93]">
            Plan · Focus · Ship
          </p>
        </div>

        <motion.span
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, ...spring }}
          className="shrink-0 rounded-full bg-[#007aff] px-3.5 py-[6px] text-[12px] font-bold leading-none tracking-[0.02em] !text-white shadow-[0_4px_12px_rgba(0,122,255,0.28)]"
        >
          GET
        </motion.span>
      </motion.div>

      {/* Screenshot strip — three equal phone frames, no overflow clip */}
      <div className="mt-2.5 flex gap-1.5">
        {shots.map((shot, i) => (
          <motion.div
            key={shot.key}
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.12 + i * 0.06, ...soft }}
            className="relative flex aspect-[9/19] min-w-0 flex-1 flex-col overflow-hidden rounded-[11px] shadow-[0_3px_10px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.08]"
            style={{ background: shot.shell }}
          >
            <ShotStatusBar dark={shot.dark} />
            {shot.ui}
          </motion.div>
        ))}
      </div>

      {/* What’s New */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, ...soft }}
        className="mt-2.5"
      >
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[13px] font-bold tracking-[-0.02em] text-[#1d1d1f]">
            What&apos;s New
          </p>
          <p className="text-[10px] font-semibold text-[#007aff]">
            Version History
          </p>
        </div>
        <p className="mt-1 text-[10px] font-medium text-[#8e8e93]">
          Version 1.0 · Today
        </p>
        <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-[#1d1d1f]">
          First release. Built, reviewed, and live for customers.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, ...soft }}
        className="mt-auto flex items-center gap-1.5 rounded-full bg-[#e8f9ee] px-2.5 py-1.5"
      >
        <span className="flex size-3.5 items-center justify-center rounded-full bg-[#34c759]">
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path
              d="M2 5.2L4.1 7.2L8 2.8"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <p className="text-[10px] font-semibold text-[#1d7a3a]">
          Ready for Sale · App Store
        </p>
      </motion.div>
    </div>
  );
}

const BODIES = [ScreenTalk, ScreenAgree, ScreenBuild, ScreenLaunch];

const TAB_ICONS = [
  <path
    key="t"
    d="M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v7A2.5 2.5 0 0117.5 16H9l-4 3v-3.5A2.5 2.5 0 014 13.5v-7z"
    fill="currentColor"
  />,
  <path
    key="a"
    d="M9.2 16.4L5.5 12.7l1.4-1.4 2.3 2.3 6-6 1.4 1.4-7.4 7.4z"
    fill="currentColor"
  />,
  <path
    key="b"
    d="M7 18h10v-2H7v2zm0-4h10v-2H7v2zm0-4h10V8H7v2zm0-4h10V4H7v2z"
    fill="currentColor"
  />,
  <path
    key="l"
    d="M12 3l1.6 4.9H19l-4 2.9 1.5 4.7L12 12.8 7.5 15.5 9 10.8 5 7.9h5.4L12 3z"
    fill="currentColor"
  />,
];

/** Painted into iphone-device-sm — shifted down to cover camera bottoms. */
const ISLAND = {
  top: "3.44%",
  height: "4.06%",
  width: "28.8%",
  liveWidth: "36%",
} as const;

function DynamicIsland({ live }: { live: boolean }) {
  // Static frame already has a crisp island baked in — no CSS pill (avoids double edge).
  if (!live) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-50">
      <motion.div
        initial={false}
        animate={{ width: ISLAND.liveWidth }}
        transition={springUi}
        className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black"
        style={{
          top: ISLAND.top,
          height: ISLAND.height,
          width: ISLAND.width,
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18 }}
          className="flex h-full w-full items-center gap-1.5 px-2.5"
        >
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#34c759]"
          />
          <span className="text-[6px] font-semibold tracking-wide !text-white/90">
            Live
          </span>
          <span className="ml-auto h-[8px] w-[8px] shrink-0 rounded-full bg-[#0a0a0a] ring-1 ring-white/15" />
        </motion.div>
      </motion.div>
    </div>
  );
}

export function PremiumPhone({
  className = "",
  enterDelay = 0,
}: {
  className?: string;
  /** Wait for hero headline write before settling in */
  enterDelay?: number;
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const Body = BODIES[i];
  const step = FLOW[i];

  useEffect(() => {
    if (paused || reduce) return;
    // Don't advance screens until the entrance has landed
    const wait = (i === 0 ? enterDelay * 1000 : 0) + STEP_DURATION_MS[i];
    const id = window.setTimeout(
      () => setI((n) => (n + 1) % FLOW.length),
      wait,
    );
    return () => window.clearTimeout(id);
  }, [i, paused, reduce, enterDelay]);

  const go = (idx: number) => {
    setPaused(true);
    setI(idx);
  };

  return (
    <div className={`relative mx-auto ${className}`}>
      <motion.div
        className="relative mx-auto w-[min(300px,78vw)] md:w-[320px]"
        style={{ aspectRatio: "313 / 640" }}
        // Transform-only settle — parent stage handles hide-until-write
        initial={
          reduce ? false : { transform: "translateY(14px) scale(0.97)" }
        }
        animate={{ transform: "translateY(0px) scale(1)" }}
        transition={{ ...springUi, delay: reduce ? 0 : enterDelay }}
      >
        {/*
          Screen lives only in the display hole. Device PNG sits on top.
          Shadow follows the PNG alpha — no rectangular card behind the phone.
        */}
        <div
          className="absolute z-0 overflow-hidden bg-[#f5f5f7]"
          style={{
            left: "5.1%",
            right: "5.1%",
            top: "2.05%",
            bottom: "2.1%",
            borderRadius: "16.5% / 7.8%",
          }}
        >
          <div
            className="absolute inset-0 flex flex-col overflow-hidden"
            style={{ paddingTop: "8.8%" }}
          >
            <div className="flex min-h-0 flex-1 flex-col px-2.5 pb-[4.5rem] sm:px-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id}
                  initial={
                    reduce
                      ? false
                      : { opacity: 0, y: 10, filter: "blur(4px)" }
                  }
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={
                    reduce
                      ? { opacity: 0 }
                      : { opacity: 0, y: -6, filter: "blur(3px)" }
                  }
                  transition={{ duration: 0.28, ease }}
                  className="flex min-h-0 flex-1 flex-col"
                >
                  <p className="text-[20px] font-semibold tracking-[-0.045em] text-[#1d1d1f]">
                    {step.title}
                  </p>
                  <div className="mt-2.5 min-h-0 flex-1">
                    <Body />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-3 pb-1.5">
              <div className="liquid-glass pointer-events-auto relative flex max-w-full items-center justify-between overflow-hidden rounded-full px-0.5 py-1">
                {FLOW.map((f, idx) => {
                  const on = idx === i;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => go(idx)}
                      className="relative flex min-h-[40px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-0.5 py-1"
                    >
                      {on && (
                        <motion.span
                          layoutId="phone-tab-glow"
                          className="absolute inset-[2px] rounded-full bg-white/85 shadow-[0_3px_12px_rgba(0,0,0,0.06)]"
                          transition={spring}
                        />
                      )}
                      <motion.span
                        animate={{ scale: on ? 1.06 : 1 }}
                        transition={spring}
                        className={`relative z-10 ${
                          on ? "text-[#0071e3]" : "text-[#8e8e93]"
                        }`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24">
                          {TAB_ICONS[idx]}
                        </svg>
                      </motion.span>
                      <span
                        className={`relative z-10 text-[8px] font-semibold ${
                          on ? "text-[#0071e3]" : "text-[#8e8e93]"
                        }`}
                      >
                        {f.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-0.5 flex justify-center pb-0.5">
                <span className="h-[3px] w-[34%] rounded-full bg-[#1d1d1f]/9" />
              </div>
            </div>
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/devices/iphone-device-sm.webp?v=7"
          alt=""
          width={313}
          height={640}
          decoding="async"
          fetchPriority="high"
          className="pointer-events-none absolute inset-0 z-30 h-full w-full select-none object-contain"
          draggable={false}
          style={{
            filter:
              "drop-shadow(0 28px 50px rgba(0,0,0,0.18)) drop-shadow(0 8px 16px rgba(0,0,0,0.08))",
          }}
        />

        <DynamicIsland live={false} />
      </motion.div>
    </div>
  );
}
