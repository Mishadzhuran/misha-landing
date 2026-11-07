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
      className="mt-5 overflow-hidden rounded-[28px] md:mt-6 md:rounded-[32px]"
      style={{
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        background: "#ffffff",
        boxShadow:
          "0 0 0 0.5px rgba(255,255,255,0.12), 0 8px 28px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      <div className="flex items-baseline justify-between gap-4 px-6 pt-5 md:px-7 md:pt-5">
        <p className="text-[15px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
          Systems & integrations
        </p>
        <p className="shrink-0 text-[13px] font-medium tabular-nums text-[#8e8e93]">
          {index + 1} of {TOTAL}
        </p>
      </div>

      <div className="px-4 pb-5 pt-2 md:px-5 md:pb-6">
        <div
          className="relative overflow-hidden rounded-[14px] bg-[#f2f2f7]"
          style={{ height: VIEW_H }}
        >
          {/* Selection capsule only. no divider lines */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-2 top-1/2 z-[1] h-[42px] -translate-y-1/2 rounded-[10px] bg-white/70 md:inset-x-3"
            style={{
              boxShadow: "0 0.5px 0 rgba(0,0,0,0.04)",
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
                  className="absolute inset-x-0 flex items-center justify-center px-5 text-center md:px-8"
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
                        ? "text-[16px] font-semibold text-[#1d1d1f] md:text-[17px]"
                        : "text-[15px] font-medium text-[#6e6e73]"
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
                "linear-gradient(180deg, #f2f2f7 0%, rgba(242,242,247,0.75) 50%, transparent 100%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-11"
            style={{
              background:
                "linear-gradient(0deg, #f2f2f7 0%, rgba(242,242,247,0.75) 50%, transparent 100%)",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
