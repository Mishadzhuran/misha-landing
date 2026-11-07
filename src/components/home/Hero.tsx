"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { site } from "@/data/site";
import { easeOut, springUi } from "@/lib/motion";
import { PremiumPhone } from "./PremiumPhone";
import { ToolIcons } from "./ToolIcons";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-x-clip pb-12 pt-[max(5.5rem,env(safe-area-inset-top)+4.5rem)] md:pb-24 md:pt-32">
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
          <motion.p
            className="text-[12px] font-semibold tracking-[0.16em] text-[#86868b] uppercase"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.05, ease: easeOut }}
          >
            Product partner
          </motion.p>
          <h1 className="mt-3 text-[clamp(1.95rem,7vw,3.6rem)] font-semibold leading-[1.06] tracking-[-0.048em] text-[#1d1d1f]">
            I help people build
            <br />
            products that feel easy.
          </h1>
          <p className="mx-auto mt-3.5 max-w-[22rem] text-[15px] leading-relaxed text-[#6e6e73] md:mt-4 md:max-w-md md:text-[17px]">
            Apps and websites, from idea to launch, with calm process and clear
            scope.
          </p>
          <div className="mt-7 flex flex-col items-stretch justify-center gap-2.5 px-1 sm:mt-8 sm:flex-row sm:items-center sm:gap-3 sm:px-0">
            <Link
              href="/contact"
              className="pressable rounded-full bg-[#0071e3] px-8 py-3.5 text-center text-[15px] font-semibold !text-white shadow-[0_10px_28px_rgba(0,113,227,0.3)] hover:bg-[#0077ed]"
            >
              Start a project
            </Link>
            <Link
              href="/#work"
              className="pressable rounded-full bg-black/[0.05] px-8 py-3.5 text-center text-[15px] font-semibold text-[#1d1d1f] hover:bg-black/[0.08]"
            >
              See work
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
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-white/90 to-white/55 shadow-[0_28px_80px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04] md:overflow-visible md:rounded-[44px]">
              <ToolIcons />
              <div className="relative z-10 flex justify-center px-4 py-12 sm:px-8 sm:py-14 md:px-16 md:py-20">
                <div className="relative">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-1 left-1/2 h-12 w-[72%] -translate-x-1/2 rounded-full bg-black/18 blur-2xl"
                  />
                  <PremiumPhone />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.p
          className="mt-8 text-center text-[13px] text-[#86868b] md:mt-10"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: easeOut }}
        >
          {site.name} · {site.role}
        </motion.p>
      </div>
    </section>
  );
}
