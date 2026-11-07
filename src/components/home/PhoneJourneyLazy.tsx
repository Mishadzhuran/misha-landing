"use client";

import dynamic from "next/dynamic";
import { MagneticButton, Shell } from "@/components/ui/Shell";

function JourneyFallback() {
  return (
    <section className="relative h-[100svh] overflow-hidden bg-[#050508]">
      <div className="journey-space pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(239,26,18,0.08),transparent_55%)]" />
      <Shell wide className="relative z-[3] h-full">
        <div className="absolute inset-x-0 top-[10%] z-10 mx-auto max-w-xl px-4 text-center md:left-[4%] md:right-auto md:mx-0 md:max-w-lg md:text-left lg:left-[6%]">
          <p className="eyebrow mb-4 justify-center before:hidden md:justify-start">
            From idea to live users
          </p>
          <h1 className="soft-title text-[clamp(2.8rem,7vw,5.4rem)]">
            <span className="text-red">We build the app</span>
            <span className="block text-text">that leads people in</span>
          </h1>
          <p className="readable mx-auto mt-5 max-w-md md:mx-0">
            Scroll to turn the product, every move is driven by you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <MagneticButton href="/contact">Start a project</MagneticButton>
            <MagneticButton href="/cases" variant="outline">
              Cases
            </MagneticButton>
          </div>
        </div>
      </Shell>
    </section>
  );
}

export const PhoneJourneyLazy = dynamic(
  () =>
    import("@/components/home/PhoneJourney").then((m) => m.PhoneJourney),
  {
    ssr: false,
    loading: () => <JourneyFallback />,
  }
);
