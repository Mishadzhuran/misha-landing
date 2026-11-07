"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { easeOut, springUi } from "@/lib/motion";
import { PremiumPhone } from "./PremiumPhone";
import { ToolIcons } from "./ToolIcons";

export function Hero() {
  const reduce = useReducedMotion();

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
        <motion.div
          className="mx-auto max-w-xl text-center"
          initial={
            reduce
              ? false
              : { opacity: 0, transform: "translateY(14px) scale(0.985)" }
          }
          animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
          transition={{ duration: 0.5, ease: easeOut }}
        >
          <h1 className="font-display text-[clamp(2.05rem,7.2vw,3.75rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-[#1d1d1f]">
            Turn your idea
            <br />
            into a live product.
          </h1>
          <div className="mt-7 flex flex-col items-stretch justify-center gap-2.5 px-1 sm:mt-8 sm:flex-row sm:items-center sm:gap-3 sm:px-0">
            <Link
              href="/contact"
              className="pressable rounded-full bg-[#0071e3] px-8 py-3.5 text-center text-[15px] font-semibold !text-white shadow-[0_10px_28px_rgba(0,113,227,0.3)] hover:bg-[#0077ed]"
            >
              Let&apos;s build yours
            </Link>
            <Link
              href="/#work"
              className="pressable rounded-full bg-black/[0.05] px-8 py-3.5 text-center text-[15px] font-semibold text-[#1d1d1f] hover:bg-black/[0.08]"
            >
              See what I&apos;ve shipped
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="relative mt-12 overflow-x-clip md:mt-16 md:overflow-visible"
          initial={
            reduce
              ? false
              : { opacity: 0, transform: "translateY(22px) scale(0.97)" }
          }
          animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
          transition={{ ...springUi, delay: reduce ? 0 : 0.08 }}
        >
          <div className="relative mx-0 md:mx-6">
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-white/90 to-white/55 ring-1 ring-black/[0.04] md:overflow-visible md:rounded-[44px]">
              <ToolIcons />
              <div className="relative z-10 flex justify-center px-4 py-12 sm:px-8 sm:py-14 md:px-16 md:py-20">
                <div className="relative">
                  <PremiumPhone />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
