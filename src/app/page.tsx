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
      <ScrollChapters />
      <WorkSection />
      <FinalCTA />
    </>
  );
}
