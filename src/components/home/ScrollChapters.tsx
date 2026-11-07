"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Shell } from "@/components/ui/Primitives";
import { easeOut, springSnap, springUi } from "@/lib/motion";

const steps = [
  {
    n: "01",
    title: "We talk",
    line: "You share the idea. I ask a few simple questions.",
    detail: "15 to 30 min",
  },
  {
    n: "02",
    title: "We agree",
    line: "Clear plan, timeline, and price, in writing.",
    detail: "Scope locked",
  },
  {
    n: "03",
    title: "We build",
    line: "I design and develop. You see progress along the way.",
    detail: "Weekly builds",
  },
  {
    n: "04",
    title: "We launch",
    line: "Your app or website goes live. I stay for support.",
    detail: "Store-ready",
  },
];

export function ScrollChapters() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (paused || reduce) return;
    const id = window.setInterval(
      () => setActive((n) => (n + 1) % steps.length),
      4200,
    );
    return () => window.clearInterval(id);
  }, [paused, reduce]);

  return (
    <section
      id="services"
      className="relative scroll-mt-28 overflow-x-clip py-16 md:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(0,113,227,0.1), transparent 68%)",
        }}
      />

      <Shell className="relative">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-[clamp(1.9rem,4vw,2.7rem)] font-semibold tracking-[-0.04em] text-[#1d1d1f]">
            How we work
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[16px] leading-relaxed text-[#6e6e73]">
            Four calm steps, the same flow you see on the phone.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-3 sm:gap-4 md:grid-cols-4 md:gap-5">
          {steps.map((step, i) => {
            const on = i === active;
            return (
              <motion.button
                key={step.n}
                type="button"
                onClick={() => {
                  setPaused(true);
                  setActive(i);
                }}
                initial={
                  reduce
                    ? false
                    : { opacity: 0, transform: "translateY(16px) scale(0.98)" }
                }
                whileInView={{
                  opacity: 1,
                  transform: "translateY(0px) scale(1)",
                }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: easeOut }}
                animate={
                  reduce
                    ? undefined
                    : {
                        y: on ? -6 : 0,
                      }
                }
                className={`pressable relative overflow-hidden rounded-[24px] p-5 text-left sm:rounded-[28px] sm:p-6 md:rounded-[32px] md:p-7 ${
                  on
                    ? "bg-white shadow-[0_20px_50px_rgba(0,113,227,0.14)] ring-1 ring-[#0071e3]/22"
                    : "bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.04]"
                }`}
              >
                <AnimatePresence>
                  {on && (
                    <motion.span
                      layoutId="chapter-glow"
                      className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-[#0071e3]/[0.07] to-transparent"
                      transition={springUi}
                    />
                  )}
                </AnimatePresence>
                <div className="relative flex items-center justify-between gap-3">
                  <motion.span
                    animate={{
                      backgroundColor: on ? "#0071e3" : "#f5f5f7",
                      color: on ? "#ffffff" : "#1d1d1f",
                    }}
                    transition={springSnap}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-semibold sm:h-10 sm:w-10 sm:text-[13px]"
                  >
                    {step.n}
                  </motion.span>
                  <span className="text-[12px] font-medium text-[#86868b] sm:text-[13px]">
                    {step.detail}
                  </span>
                </div>
                <h3 className="relative mt-4 text-[20px] font-semibold tracking-[-0.03em] text-[#1d1d1f] sm:mt-6 sm:text-[22px]">
                  {step.title}
                </h3>
                <p className="relative mt-1.5 text-[14px] leading-relaxed text-[#6e6e73] sm:mt-2 sm:text-[15px]">
                  {step.line}
                </p>
              </motion.button>
            );
          })}
        </div>
      </Shell>
    </section>
  );
}
