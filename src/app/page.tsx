import dynamic from "next/dynamic";
import { Hero } from "@/components/home/Hero";

/** Below-fold + Trust stay out of the hero LCP / TBT critical path. */
const TrustSection = dynamic(
  () =>
    import("@/components/home/TrustSection").then((m) => m.TrustSection),
  { ssr: true },
);
const HomeBelowFold = dynamic(
  () =>
    import("@/components/home/HomeBelowFold").then((m) => m.HomeBelowFold),
  { ssr: true },
);

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustSection />
      <HomeBelowFold />
    </>
  );
}
