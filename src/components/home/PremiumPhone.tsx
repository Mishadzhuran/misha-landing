"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  animate,
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
          We want to ship a product this quarter.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.75, ...soft }}
      >
        <Glass className="max-w-[90%] rounded-bl-[5px] px-3.5 py-2.5">
          <p className="text-[12px] leading-snug text-[#1d1d1f]">
            What’s the one outcome that has to work?
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
          A usable MVP in six weeks.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.95, ...soft }}
        className="mt-auto"
      >
        <Glass className="flex items-center justify-between gap-2.5 px-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0071e3]/12 text-[13px] font-semibold text-[#0071e3] ring-2 ring-white">
            30
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-[#1d1d1f]">
              Discovery call
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

function ScreenAgree() {
  const rows = [
    { k: "Scope", v: "Product MVP" },
    { k: "Timeline", v: "6 weeks" },
    { k: "Investment", v: "Fixed fee" },
  ];
  return (
    <div className="flex flex-col gap-2.5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
      >
        <Glass className="overflow-hidden">
          <div className="border-b border-black/[0.05] px-3.5 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#86868b]">
              Proposal
            </p>
          </div>
          {rows.map((row, i) => (
            <motion.div
              key={row.k}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.14 + i * 0.08, duration: 0.38, ease }}
              className={`flex items-center justify-between px-3.5 py-2.5 ${
                i < rows.length - 1 ? "border-b border-black/[0.05]" : ""
              }`}
            >
              <span className="text-[12px] text-[#6e6e73]">{row.k}</span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.28 + i * 0.08, duration: 0.3 }}
                className="text-[13px] font-semibold text-[#1d1d1f]"
              >
                {row.v}
              </motion.span>
            </motion.div>
          ))}
        </Glass>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.48, ...spring }}
      >
        <Glass className="flex items-center gap-2.5 px-3.5 py-2.5">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, ...spring }}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-[#34c759] text-[10px] font-bold !text-white"
          >
            ✓
          </motion.span>
          <p className="text-[12px] font-semibold text-[#1d1d1f]">
            Proposal signed
          </p>
        </Glass>
      </motion.div>
    </div>
  );
}

function CountUp({ to, delay = 0 }: { to: number; delay?: number }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => `${Math.round(v)}%`);
  const [text, setText] = useState("0%");

  useEffect(() => {
    const unsub = rounded.on("change", (v) => setText(v));
    const controls = animate(mv, to, {
      duration: 1.05,
      delay,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => {
      unsub();
      controls.stop();
    };
  }, [to, delay, mv, rounded]);

  return <span>{text}</span>;
}

function ScreenBuild() {
  const items = [
    { t: "Design system", s: "Done", c: "text-[#34c759]", on: false },
    { t: "Core product", s: "Building", c: "text-[#0071e3]", on: true },
    { t: "TestFlight", s: "This week", c: "text-[#86868b]", on: false },
    { t: "Store release", s: "Queued", c: "text-[#86868b]", on: false },
  ];
  return (
    <div className="flex h-full flex-col gap-2.5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
      >
        <Glass className="px-3.5 py-3">
          <div className="flex items-end justify-between">
            <p className="text-[28px] font-semibold tracking-[-0.05em] text-[#1d1d1f]">
              <CountUp to={72} delay={0.12} />
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.3 }}
              className="pb-0.5 text-[11px] font-semibold text-[#0071e3]"
            >
              Week 4 of 6
            </motion.p>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
            <motion.div
              className="h-full rounded-full bg-[#0071e3]"
              initial={{ width: 0 }}
              animate={{ width: "72%" }}
              transition={{ delay: 0.18, duration: 1, ease }}
            />
          </div>
        </Glass>
      </motion.div>

      <Glass className="overflow-hidden">
        {items.map((item, i) => (
          <motion.div
            key={item.t}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.07, duration: 0.35, ease }}
            className={`flex items-center gap-2 px-3.5 py-2.5 ${
              i < items.length - 1 ? "border-b border-black/[0.05]" : ""
            }`}
          >
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                item.s === "Done"
                  ? "bg-[#34c759]"
                  : item.on
                    ? "bg-[#0071e3]"
                    : "bg-[#d2d2d7]"
              }`}
            />
            <span className="flex-1 text-[12px] text-[#1d1d1f]">{item.t}</span>
            <span className={`text-[11px] font-semibold ${item.c}`}>
              {item.s}
            </span>
          </motion.div>
        ))}
      </Glass>
    </div>
  );
}

function ScreenLaunch() {
  const checks = [
    "App Store listing",
    "Privacy labels",
    "Review notes",
    "Version 1.0 live",
  ];
  return (
    <div className="flex h-full flex-col gap-2.5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...soft }}
      >
        <Glass className="px-3.5 py-3">
          <div className="flex items-center gap-2.5">
            <motion.div
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={spring}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[13px] bg-[#0071e3] shadow-[0_10px_22px_rgba(0,113,227,0.28)]"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3l1.8 5.5H19l-4.4 3.2 1.7 5.3L12 13.8 7.7 17l1.7-5.3L5 8.5h5.2L12 3z"
                  fill="white"
                />
              </svg>
            </motion.div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-[#1d1d1f]">
                Client Product
              </p>
              <p className="text-[10px] text-[#6e6e73]">Productivity</p>
              <div className="mt-1 flex items-center gap-0.5">
                {[0, 1, 2, 3, 4].map((s) => (
                  <motion.svg
                    key={s}
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + s * 0.05, ...spring }}
                  >
                    <path
                      d="M12 3l1.8 5.5H19l-4.4 3.2 1.7 5.3L12 13.8 7.7 17l1.7-5.3L5 8.5h5.2L12 3z"
                      fill="#0071e3"
                    />
                  </motion.svg>
                ))}
              </div>
            </div>
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.28, ...spring }}
              className="shrink-0 rounded-full bg-[#0071e3] px-3 py-1.5 text-[10px] font-bold !text-white shadow-[0_6px_14px_rgba(0,113,227,0.25)]"
            >
              GET
            </motion.span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.35, ease }}
            className="mt-3 flex items-center gap-1.5 rounded-[12px] bg-black/[0.04] px-2.5 py-2"
          >
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="h-1.5 w-1.5 rounded-full bg-[#34c759]"
            />
            <span className="text-[10px] font-semibold text-[#1d1d1f]">
              Live on the App Store
            </span>
          </motion.div>
        </Glass>
      </motion.div>

      <div className="space-y-1.5">
        {checks.map((t, i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 + i * 0.08, ...soft }}
          >
            <Glass className="flex items-center justify-between px-3.5 py-2">
              <span className="text-[11px] text-[#1d1d1f]">{t}</span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.42 + i * 0.08, ...spring }}
                className="flex h-4 w-4 items-center justify-center rounded-full bg-[#34c759] text-[8px] font-bold !text-white"
              >
                ✓
              </motion.span>
            </Glass>
          </motion.div>
        ))}
      </div>
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

function DynamicIsland({ live }: { live: boolean }) {
  /**
   * Opaque black mask above the device PNG (z above frame).
   * Sized from the asset’s island: ~3.25 to 7.1% tall, ~28% wide.
   */
  return (
    <div className="pointer-events-none absolute inset-0 z-50">
        <motion.div
          animate={{ width: live ? "40%" : "30%" }}
          transition={springUi}
          className="absolute left-0 right-0 mx-auto overflow-hidden rounded-full"
          style={{ top: "3.2%", height: "4.05%" }}
        >
        {/* Dedicated paint layer. solid mask over PNG cameras */}
        <div
          className="absolute inset-[-2px] rounded-full"
          style={{ backgroundColor: "#000000" }}
        />
        <AnimatePresence initial={false} mode="wait">
          {live ? (
            <motion.div
              key="live"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="relative z-10 flex h-full w-full items-center gap-1.5 px-3"
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
              <span className="text-[7px] font-semibold tracking-wide !text-white/90">
                Live
              </span>
              <span className="ml-auto h-[9px] w-[9px] shrink-0 rounded-full bg-[#0a0a0a] ring-1 ring-white/15" />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export function PremiumPhone({ className = "" }: { className?: string }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const Body = BODIES[i];
  const step = FLOW[i];

  useEffect(() => {
    if (paused || reduce) return;
    const id = window.setInterval(
      () => setI((n) => (n + 1) % FLOW.length),
      5200,
    );
    return () => window.clearInterval(id);
  }, [paused, reduce]);

  const go = (idx: number) => {
    setPaused(true);
    setI(idx);
  };

  return (
    <div className={`relative mx-auto ${className}`}>
      <motion.div
        className="relative mx-auto w-[min(220px,68vw)] sm:w-[min(240px,72vw)] md:w-[270px]"
        style={{ aspectRatio: "391 / 800" }}
        initial={reduce ? false : { opacity: 0, transform: "translateY(16px) scale(0.97)" }}
        animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
        transition={springUi}
      >
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            borderRadius: "12.3%",
            filter:
              "drop-shadow(0 28px 50px rgba(0,0,0,0.18)) drop-shadow(0 8px 16px rgba(0,0,0,0.08))",
          }}
        >
          <div
            className="absolute z-0 overflow-hidden bg-[#f5f5f7]"
            style={{
              left: "5.2%",
              right: "5.2%",
              top: "1.55%",
              bottom: "1.9%",
              borderRadius: "10.2%",
            }}
          >
            <div className="absolute inset-0 flex flex-col">
              <div
                className="flex min-h-0 flex-1 flex-col px-2.5 pb-[4.5rem] sm:px-3"
                style={{ paddingTop: "9.6%" }}
              >
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
                    <h3 className="text-[20px] font-semibold tracking-[-0.045em] text-[#1d1d1f]">
                      {step.title}
                    </h3>
                    <div className="mt-2.5 min-h-0 flex-1">
                      <Body />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-2 pb-1">
                <div className="liquid-glass pointer-events-auto relative flex items-center justify-between overflow-hidden rounded-full px-0.5 py-1">
                  {FLOW.map((f, idx) => {
                    const on = idx === i;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => go(idx)}
                        className="relative flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-0.5 py-1"
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
                <div className="mt-1 flex justify-center">
                  <span className="h-[3px] w-[32%] rounded-full bg-[#1d1d1f]/9" />
                </div>
              </div>
            </div>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/devices/iphone-device.png?v=island3"
            alt=""
            className="pointer-events-none absolute inset-0 z-30 h-full w-full select-none"
            draggable={false}
          />

          {/* After the frame so the solid mask always paints on top of PNG cameras */}
          <DynamicIsland live={step.id === "launch"} />
        </div>
      </motion.div>
    </div>
  );
}
