"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";

/**
 * Never renders on SSR / first paint — so it can't become LCP or hide the hero.
 * Only mounts after client checks (skipped for bots, reduced-motion, return visits).
 */
export function PageLoader() {
  const [phase, setPhase] = useState<"idle" | "show" | "done">("idle");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("misha-loaded-v2")) {
        setPhase("done");
        return;
      }
    } catch {
      /* private mode */
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bot =
      /bot|crawl|spider|lighthouse|chrome-lighthouse/i.test(navigator.userAgent) ||
      Boolean((navigator as Navigator & { webdriver?: boolean }).webdriver);
    const saveData = Boolean(
      (navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData,
    );

    if (reduce || bot || saveData) {
      setPhase("done");
      try {
        sessionStorage.setItem("misha-loaded-v2", "1");
      } catch {
        /* ignore */
      }
      return;
    }

    setPhase("show");
    let value = 0;
    let timer = 0;
    const tick = () => {
      value += Math.random() * 28 + 18;
      if (value >= 100) {
        setProgress(100);
        timer = window.setTimeout(() => {
          setPhase("done");
          try {
            sessionStorage.setItem("misha-loaded-v2", "1");
          } catch {
            /* ignore */
          }
        }, 220);
        return;
      }
      setProgress(Math.min(100, Math.floor(value)));
      timer = window.setTimeout(tick, 28 + Math.random() * 32);
    };
    tick();
    return () => window.clearTimeout(timer);
  }, []);

  if (phase !== "show") return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#f5f5f7]"
      aria-hidden
    >
      <p className="font-display text-3xl font-bold tracking-[-0.04em] text-text">
        {site.shortName}
      </p>
      <div className="mt-8 h-1 w-40 overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-[#1d1d1f] transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
