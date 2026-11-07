"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";

/** Lenis only. GSAP stays in the journey chunk, not the root layout */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        duration: 1.1,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.85,
        touchMultiplier: 1.1,
      }}
    >
      {children}
    </ReactLenis>
  );
}
