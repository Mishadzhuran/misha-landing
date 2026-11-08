"use client";

import {
  FinalCTA,
  ScrollChapters,
  WorkSection,
} from "@/components/home/PortfolioSections";

/** Lazy below-fold chunk — keeps hero LCP lean */
export function HomeBelowFold() {
  return (
    <div className="cv-auto bg-[#0a0a0a] text-white">
      <ScrollChapters />
      <WorkSection />
      <FinalCTA />
    </div>
  );
}
