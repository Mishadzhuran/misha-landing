"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { easeOut, springSoft, springUi } from "@/lib/motion";
import { PremiumPhone } from "./PremiumPhone";
import { ToolIcons } from "./ToolIcons";

const HEADLINE = ["Turn your idea", "into a live product."];

function HandwrittenHeadline({ reduce }: { reduce: boolean | null }) {
  let charIndex = 0;

  return (
    <h1
      className="hand-write relative mx-auto max-w-full -rotate-[0.8deg] text-[clamp(2.9rem,10.5vw,7rem)] leading-[1.06] tracking-[-0.01em] text-[#111]"
      aria-label="Turn your idea into a live product."
    >
      {HEADLINE.map((line, lineIndex) => (
        <span key={line} className="block">
          {line.split("").map((ch) => {
            const i = charIndex++;
            if (reduce) {
              return (
                <span key={`${line}-${i}`} className="inline-block">
                  {ch === " " ? "\u00A0" : ch}
                </span>
              );
            }
            return (
              <motion.span
                key={`${line}-${i}`}
                className="inline-block origin-bottom"
                initial={{ opacity: 0, y: 14, scale: 0.86 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.34,
                  delay: 0.08 + i * 0.026 + lineIndex * 0.03,
                  ease: easeOut,
                }}
              >
                {ch === " " ? "\u00A0" : ch}
              </motion.span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  // Match HandwrittenHeadline: last char delay + duration + small breath
  const charCount = HEADLINE.join("").length;
  const lastLineIndex = HEADLINE.length - 1;
  const writeDone = reduce
    ? 0
    : 0.08 + (charCount - 1) * 0.026 + lastLineIndex * 0.03 + 0.34 + 0.08;

  return (
    <section className="relative overflow-x-clip pt-[max(14vh,env(safe-area-inset-top)+5.5rem)] pb-[max(1.5rem,env(safe-area-inset-bottom))] md:overflow-visible md:pb-10 md:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 42% at 50% -6%, rgba(0,113,227,0.13), transparent 55%), radial-gradient(ellipse 40% 30% at 80% 20%, rgba(52,199,89,0.06), transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-[1100px] px-5 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <HandwrittenHeadline reduce={reduce} />

          <motion.div
            className="mt-6 flex flex-col items-center gap-3 md:mt-9"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              ...springSoft,
              delay: writeDone,
            }}
          >
            <Link
              href="/contact"
              className="pressable inline-flex min-h-[48px] items-center rounded-full bg-[#0071e3] px-8 py-3.5 text-center text-[15px] font-semibold !text-white shadow-[0_10px_28px_rgba(0,113,227,0.3)] hover:bg-[#0077ed]"
            >
              Let&apos;s build yours
            </Link>
            <motion.p
              className="text-[14px] font-medium tracking-[-0.01em] text-[#6e6e73]"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                ease: easeOut,
                delay: writeDone + 0.12,
              }}
            >
              scroll to see more
            </motion.p>
          </motion.div>
        </div>

        {/* Phone + icons wait until the headline has finished writing */}
        <motion.div
          className="relative mt-8 overflow-visible md:mt-16"
          initial={reduce ? false : { opacity: 0, y: 28, scale: 0.975 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ...springSoft,
            delay: writeDone + 0.18,
          }}
        >
          <div className="relative mx-auto max-w-[520px] md:max-w-[780px]">
            <motion.div
              className="relative overflow-visible"
              initial={reduce ? false : { y: 12 }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.65,
                ease: easeOut,
                delay: writeDone + 0.22,
              }}
            >
              <ToolIcons startDelay={writeDone + 0.55} />
              <div className="relative z-30 flex justify-center px-12 pb-28 pt-6 sm:px-14 sm:pb-32 sm:pt-8 md:px-20 md:pb-40 md:pt-10">
                <motion.div
                  className="relative"
                  initial={reduce ? false : { y: 14, scale: 0.98 }}
                  animate={{ y: 0, scale: 1 }}
                  transition={{
                    ...springUi,
                    delay: writeDone + 0.28,
                  }}
                >
                  <PremiumPhone enterDelay={writeDone + 0.28} />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
