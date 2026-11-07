import { Hero } from "@/components/home/Hero";
import { TrustSection } from "@/components/home/TrustSection";
import {
  FinalCTA,
  ScrollChapters,
  WorkSection,
} from "@/components/home/PortfolioSections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustSection />
      <div className="bg-[#0a0a0a] text-white">
        <ScrollChapters />
        <WorkSection />
        <FinalCTA />
      </div>
    </>
  );
}
