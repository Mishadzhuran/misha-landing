"use client";

import {
  FinalCTA,
  WorkSection,
} from "@/components/home/PortfolioSections";
import { TechMarquee } from "@/components/home/TechMarquee";

/** Below-fold dark band. No content-visibility: height estimate was clipping scroll. */
export function HomeBelowFold() {
  return (
    <div className="bg-[#0a0a0a] text-white">
      <TechMarquee />
      <WorkSection />
      <FinalCTA />
    </div>
  );
}
