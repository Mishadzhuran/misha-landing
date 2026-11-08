"use client";

import {
  FinalCTA,
  WorkSection,
} from "@/components/home/PortfolioSections";
import { TechMarquee } from "@/components/home/TechMarquee";

/** Lazy below-fold chunk — keeps hero LCP lean */
export function HomeBelowFold() {
  return (
    <div className="cv-auto bg-[#0a0a0a] text-white">
      <TechMarquee />
      <WorkSection />
      <FinalCTA />
    </div>
  );
}
