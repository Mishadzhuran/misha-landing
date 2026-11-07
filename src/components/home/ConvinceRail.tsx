"use client";

import { motion, useReducedMotion } from "framer-motion";
import { easeOut } from "@/lib/motion";

const reasons = [
  {
    title: "One person. Full loop.",
    line: "Design, build, and launch, without handing your product between five freelancers.",
  },
  {
    title: "Written plan first.",
    line: "Scope, timeline, and price before any work starts. You always know the deal.",
  },
  {
    title: "You see progress.",
    line: "Regular updates you can open and check, no black boxes.",
  },
  {
    title: "Launch without panic.",
    line: "TestFlight, store release, and the quiet work that makes go-live calm.",
  },
  {
    title: "Still here after.",
    line: "Fixes, polish, and care after day one, so users keep coming back.",
  },
  {
    title: "Built for people.",
    line: "Interfaces that feel clear and soft, so your product is easy to trust.",
  },
];

function Rail({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex gap-4 overflow-x-auto overscroll-x-contain px-5 pb-4 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-5 md:px-8 [&::-webkit-scrollbar]:hidden"
      style={{
        scrollSnapType: "x mandatory",
        WebkitOverflowScrolling: "touch",
        touchAction: "pan-x",
      }}
    >
      {children}
    </div>
  );
}

export function ConvinceRail() {
  const reduce = useReducedMotion();

  return (
    <section className="py-14 md:py-16">
      <div className="mx-auto max-w-xl px-5 text-center md:px-8">
        <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-[-0.04em] text-[#1d1d1f]">
          Why people work with me
        </h2>
        <p className="mt-2.5 text-[15px] leading-relaxed text-[#6e6e73]">
          Swipe the cards, everything that keeps the project safe and clear.
        </p>
      </div>

      <div className="mt-9 md:mt-11">
        <Rail>
          {reasons.map((r, i) => (
            <motion.article
              key={r.title}
              initial={
                reduce
                  ? false
                  : { opacity: 0, transform: "translateX(18px) scale(0.98)" }
              }
              whileInView={{
                opacity: 1,
                transform: "translateX(0px) scale(1)",
              }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: 0.4,
                delay: Math.min(i, 3) * 0.045,
                ease: easeOut,
              }}
              whileHover={
                reduce
                  ? undefined
                  : { y: -3, transition: { duration: 0.2, ease: easeOut } }
              }
              className="w-[min(78vw,300px)] shrink-0 rounded-[28px] bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.055)] ring-1 ring-black/[0.045] md:w-[320px] md:rounded-[32px] md:p-7"
              style={{ scrollSnapAlign: "start" }}
            >
              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[#0071e3]/10 px-2 text-[12px] font-semibold text-[#0071e3]">
                0{i + 1}
              </span>
              <h3 className="mt-4 text-[19px] font-semibold tracking-[-0.03em] text-[#1d1d1f]">
                {r.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#6e6e73]">
                {r.line}
              </p>
            </motion.article>
          ))}
        </Rail>
      </div>
    </section>
  );
}
