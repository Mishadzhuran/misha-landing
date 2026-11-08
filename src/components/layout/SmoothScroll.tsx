"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";

/**
 * Lenis root everywhere — touch stays native (syncTouch: false)
 * so phones feel smooth without sticky hitch or remount flash.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.15,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.82,
        touchMultiplier: 1,
        autoRaf: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
