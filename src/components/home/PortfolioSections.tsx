"use client";

import { site } from "@/data/site";
import { Shell } from "@/components/ui/Primitives";

export { WorkSection } from "@/components/home/WorkRail";
export { ConvinceRail } from "@/components/home/ConvinceRail";

export function FinalCTA() {
  return (
    <section className="pb-24 pt-4 md:pb-32">
      <Shell>
        <div
          className="relative overflow-hidden rounded-[32px] px-5 py-12 text-center ring-1 ring-white/[0.08] sm:px-8 sm:py-14 md:rounded-[40px] md:px-16 md:py-20"
          style={{
            background:
              "radial-gradient(ellipse 70% 80% at 50% 0%, rgba(0,113,227,0.18), transparent 55%), #121214",
          }}
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/40">
            Contact
          </p>
          <h2 className="mx-auto mt-4 max-w-xl font-display text-[clamp(2rem,5.5vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.045em] text-white">
            Have a product in mind?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-white/50">
            Tell me what you’re building. I’ll help make it clear, polished, and
            ready for people — reply within {site.responseTime}.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <a
              href="/contact"
              className="pressable inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-[#0a0a0a]"
            >
              Start a conversation
            </a>
            <a
              href={`mailto:${site.email}`}
              className="px-4 py-3 text-center text-[14px] font-medium text-white/45 transition-colors duration-[var(--duration-ui)] ease-[var(--ease-out)] hover:text-white/75"
            >
              {site.email}
            </a>
          </div>
        </div>
      </Shell>
    </section>
  );
}
