"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";

/** Lenis only. GSAP stays in the journey chunk, not the root layout */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.075,
        duration: 1.2,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.78,
        touchMultiplier: 1,
        // Keeps sticky / pinned stages from hitching mid-gesture
        autoRaf: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
