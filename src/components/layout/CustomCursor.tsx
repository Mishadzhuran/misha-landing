"use client";

import { useEffect, useRef } from "react";

/** Lightweight custom cursor. no Framer Motion springs */
export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const el = ref.current;
    if (!el) return;
    el.style.display = "block";

    let x = -100;
    let y = -100;
    let sx = -100;
    let sy = -100;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      x = e.clientX - 10;
      y = e.clientY - 10;
    };

    const tick = () => {
      sx += (x - sx) * 0.28;
      sy += (y - sy) * 0.28;
      el.style.transform = `translate3d(${sx}px, ${sy}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-5 w-5 mix-blend-difference md:block"
      style={{ display: "none", willChange: "transform" }}
    >
      <span className="block h-full w-full rounded-full bg-white" />
    </div>
  );
}
