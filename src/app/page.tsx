import { Hero } from "@/components/home/Hero";
import { HomeBelowFold } from "@/components/home/HomeBelowFold";
import { TrustSection } from "@/components/home/TrustSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustSection />
      <HomeBelowFold />
    </>
  );
}
