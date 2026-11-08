"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode, useEffect, useState } from "react";

/**
 * Lenis on fine pointers only — phones keep native scroll.
 * Skipped entirely when prefers-reduced-motion is on (a11y + TBT).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEnabled(!reduce.matches && fine.matches);
    sync();
    reduce.addEventListener("change", sync);
    fine.addEventListener("change", sync);
    return () => {
      reduce.removeEventListener("change", sync);
      fine.removeEventListener("change", sync);
    };
  }, []);

  if (!enabled) {
    return <>{children}</>;
  }

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
