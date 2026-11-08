"use client";

import Link from "next/link";
import { PremiumPhone } from "./PremiumPhone";
import { ToolIcons } from "./ToolIcons";

const HEADLINE = ["Turn your idea", "into a live product."];

/** CSS letter settle — no Framer on the LCP path. */
function HandwrittenHeadline() {
  let charIndex = 0;

  return (
    <h1
      className="hand-write hero-headline relative mx-auto max-w-full -rotate-[0.8deg] text-[clamp(2.9rem,10.5vw,7rem)] leading-[1.06] tracking-[-0.01em] text-[#111]"
      aria-label="Turn your idea into a live product."
    >
      {HEADLINE.map((line) => (
        <span key={line} className="block">
          {line.split("").map((ch) => {
            const i = charIndex++;
            return (
              <span
                key={`${line}-${i}`}
                className="hero-letter inline-block [backface-visibility:hidden]"
                style={{ animationDelay: `${32 + i * 16}ms` }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-x-clip pt-[max(14vh,env(safe-area-inset-top)+5.5rem)] pb-[max(1.5rem,env(safe-area-inset-bottom))] md:pb-10 md:pt-32">
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
          <HandwrittenHeadline />

          <div className="hero-cta mt-6 flex flex-col items-center gap-3 md:mt-9">
            <Link
              href="/contact"
              className="pressable inline-flex min-h-[48px] items-center rounded-full bg-[#0071e3] px-8 py-3.5 text-center text-[15px] font-semibold !text-white shadow-[0_10px_28px_rgba(0,113,227,0.3)] hover:bg-[#0077ed]"
            >
              Let&apos;s build yours
            </Link>
            <p className="text-[14px] font-medium tracking-[-0.01em] text-[#6e6e73]">
              scroll to see more
            </p>
          </div>
        </div>

        {/* Headline → phone settle → icon burst */}
        <div className="relative mt-8 overflow-x-clip md:mt-16 md:overflow-visible">
          <div className="relative mx-auto max-w-[520px] overflow-x-clip md:max-w-[780px] md:overflow-visible">
            <div className="relative overflow-x-clip md:overflow-visible">
              <ToolIcons startDelay={0.55} />
                <div className="relative z-30 flex isolate justify-center px-[18%] pb-20 pt-6 sm:px-[16%] sm:pb-24 sm:pt-8 md:px-20 md:pb-40 md:pt-10">
                <div className="hero-phone relative z-30">
                  <PremiumPhone enterDelay={0.4} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
