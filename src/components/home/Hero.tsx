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
      className="hand-write relative mx-auto max-w-full -rotate-[0.8deg] text-[clamp(3.5rem,12vw,7rem)] leading-[1.02] text-[#111]"
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
  const writeDone = reduce ? 0 : (HEADLINE.join("").length * 26 + 380) / 1000;

  return (
    <section className="relative overflow-x-clip pb-6 pt-[max(5.5rem,env(safe-area-inset-top)+4.5rem)] md:pb-10 md:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 42% at 50% -6%, rgba(0,113,227,0.13), transparent 55%), radial-gradient(ellipse 40% 30% at 80% 20%, rgba(52,199,89,0.06), transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-[1100px] px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <HandwrittenHeadline reduce={reduce} />

          <motion.div
            className="mt-8 flex flex-col items-center gap-3 sm:mt-9"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              ...springSoft,
              delay: writeDone,
            }}
          >
            <Link
              href="/contact"
              className="pressable inline-flex rounded-full bg-[#0071e3] px-8 py-3.5 text-center text-[15px] font-semibold !text-white shadow-[0_10px_28px_rgba(0,113,227,0.3)] hover:bg-[#0077ed]"
            >
              Let&apos;s build yours
            </Link>
            <motion.p
              className="text-[13px] font-medium tracking-[-0.01em] text-[#6e6e73]"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                ease: easeOut,
                delay: writeDone + 0.12,
              }}
            >
              <motion.span
                className="inline-flex items-center gap-1.5"
                animate={reduce ? undefined : { y: [0, 3, 0] }}
                transition={
                  reduce
                    ? undefined
                    : {
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: writeDone + 0.4,
                      }
                }
              >
                scroll to see more
                <span aria-hidden className="text-[11px]">
                  ↓
                </span>
              </motion.span>
            </motion.p>
          </motion.div>
        </div>

        <motion.div
          className="relative mt-12 overflow-x-clip md:mt-16 md:overflow-visible"
          initial={reduce ? false : { opacity: 0, y: 28, scale: 0.975 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ...springSoft,
            delay: writeDone + 0.18,
          }}
        >
          <div className="relative mx-0 md:mx-6">
            <motion.div
              className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-white/90 to-white/55 ring-1 ring-black/[0.04] md:overflow-visible md:rounded-[44px]"
              initial={reduce ? false : { opacity: 0, y: 18, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.7,
                ease: easeOut,
                delay: writeDone + 0.16,
              }}
            >
              <ToolIcons startDelay={writeDone + 0.42} />
              <div className="relative z-10 flex justify-center px-4 py-12 sm:px-8 sm:py-14 md:px-16 md:py-20">
                <motion.div
                  className="relative"
                  initial={reduce ? false : { opacity: 0, y: 22, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    ...springUi,
                    delay: writeDone + 0.28,
                  }}
                >
                  <PremiumPhone />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
