"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { capabilities } from "@/data/site";
import { easeOut } from "@/lib/motion";

const TOTAL = capabilities.length;
const TICK_MS = 2600;
const ROW = 46;
const VIEW_H = ROW * 3;
const WINDOW = 7;

const wheelSpring = {
  type: "spring" as const,
  bounce: 0,
  duration: 0.7,
};

function wrapIndex(n: number) {
  return ((n % TOTAL) + TOTAL) % TOTAL;
}

/** Clean iOS picker. soft selection band only, no hairlines. */
export function CapabilitiesBox() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.35 });
  const reduce = useReducedMotion();
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const id = window.setInterval(() => {
      setCursor((c) => c + 1);
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [inView, reduce]);

  const index = wrapIndex(cursor);
  const windowStart = cursor - Math.floor(WINDOW / 2);
  const rows = Array.from({ length: WINDOW }, (_, i) => {
    const abs = windowStart + i;
    return {
      abs,
      name: capabilities[wrapIndex(abs)]?.name ?? "",
      distance: Math.abs(abs - cursor),
    };
  });

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: easeOut }}
      className="mt-6 overflow-hidden rounded-[32px] backdrop-blur-xl"
      style={{
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        background:
          "linear-gradient(165deg, rgba(44,44,46,0.55) 0%, rgba(28,28,30,0.42) 100%)",
        boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
      }}
    >
      <div className="flex items-baseline justify-between gap-3 px-5 pt-5 sm:gap-4 sm:px-7">
        <p className="min-w-0 text-[15px] font-semibold leading-snug tracking-[-0.02em] text-white">
          Systems & integrations
        </p>
        <p className="shrink-0 text-[13px] font-medium tabular-nums text-white/45">
          {index + 1} of {TOTAL}
        </p>
      </div>

      <div className="px-4 pb-6 pt-2 sm:px-5">
        <div
          className="relative overflow-hidden rounded-[14px] bg-[#2c2c2e]"
          style={{ height: VIEW_H }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-2 top-1/2 z-[1] h-[42px] -translate-y-1/2 rounded-[10px] bg-white/[0.08] sm:inset-x-3"
            style={{
              boxShadow: "0 0 0 0.5px rgba(255,255,255,0.06)",
            }}
          />

          <motion.div
            className="absolute inset-x-0 top-0 z-[2]"
            animate={{ y: ROW - cursor * ROW }}
            transition={reduce ? { duration: 0 } : wheelSpring}
            style={{ transformStyle: "preserve-3d" }}
          >
            {rows.map((row) => {
              const active = row.distance === 0;
              const tilt = (row.abs - cursor) * -14;
              const scale = active ? 1 : row.distance === 1 ? 0.95 : 0.88;
              return (
                <div
                  key={row.abs}
                  className="absolute inset-x-0 flex items-center justify-center px-4 text-center sm:px-8"
                  style={{
                    top: row.abs * ROW,
                    height: ROW,
                    opacity:
                      row.distance === 0 ? 1 : row.distance === 1 ? 0.38 : 0.12,
                    transform: `rotateX(${tilt}deg) scale(${scale})`,
                    transformOrigin: "center center",
                  }}
                >
                  <span
                    className={`max-w-full truncate tracking-[-0.022em] ${
                      active
                        ? "text-[16px] font-semibold text-white sm:text-[17px]"
                        : "text-[14px] font-medium text-white/45 sm:text-[15px]"
                    }`}
                  >
                    {row.name}
                  </span>
                </div>
              );
            })}
          </motion.div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-11"
            style={{
              background:
                "linear-gradient(180deg, #2c2c2e 0%, rgba(44,44,46,0.75) 50%, transparent 100%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-11"
            style={{
              background:
                "linear-gradient(0deg, #2c2c2e 0%, rgba(44,44,46,0.75) 50%, transparent 100%)",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
