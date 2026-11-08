"use client";

import { site } from "@/data/site";
import { Shell } from "@/components/ui/Primitives";

export { WorkSection } from "@/components/home/WorkRail";
export { ScrollChapters } from "@/components/home/ScrollChapters";
export { ConvinceRail } from "@/components/home/ConvinceRail";

export function FinalCTA() {
  return (
    <section className="pb-24 pt-6 md:pb-32">
      <Shell>
        <div className="rounded-[32px] bg-white px-5 py-12 text-center shadow-[0_12px_40px_rgba(0,0,0,0.25)] ring-1 ring-white/10 sm:px-8 sm:py-14 md:px-16 md:py-20">
          <p className="text-[12px] font-semibold tracking-[0.16em] text-muted uppercase">
            Contact
          </p>
          <h2 className="font-serif mx-auto mt-4 max-w-xl text-[clamp(2rem,6.5vw,3.4rem)] font-normal italic leading-[1.08] tracking-[-0.02em] text-[#1d1d1f]">
            Have a product in mind?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-[#6e6e73]">
            Tell me what you’re building. I’ll help make it clear, polished, and
            ready for people, reply within {site.responseTime}.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            <a
              href="/contact"
              className="pressable inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#0071e3] px-7 py-3.5 text-[15px] font-semibold !text-white shadow-[0_8px_24px_rgba(0,113,227,0.25)] hover:bg-[#0077ed]"
            >
              Start a conversation
            </a>
            <a
              href={`mailto:${site.email}`}
              className="px-4 py-3 text-center text-[14px] font-medium text-[#6e6e73] transition-colors duration-[var(--duration-ui)] ease-[var(--ease-out)] hover:text-[#1d1d1f]"
            >
              {site.email}
            </a>
          </div>
        </div>
      </Shell>
    </section>
  );
}
