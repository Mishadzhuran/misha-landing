"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";

/** Signal hero choreography — CSS + icon burst wait on this. */
function releaseEnter(mode: "1" | "skip" = "1") {
  try {
    document.documentElement.setAttribute("data-enter", mode);
    window.dispatchEvent(new Event("misha:enter"));
  } catch {
    /* ignore */
  }
}

/**
 * Never renders on SSR / first paint — so it can't become LCP or hide the hero.
 * Only mounts after client checks (skipped for bots, reduced-motion, return visits).
 * Releases enter so hero motion starts as the cover lifts — not underneath it.
 */
export function PageLoader() {
  const [phase, setPhase] = useState<"idle" | "show" | "done">("idle");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer = 0;

    const skip = () => {
      setPhase("done");
      releaseEnter("skip");
      try {
        sessionStorage.setItem("misha-loaded-v2", "1");
      } catch {
        /* ignore */
      }
    };

    try {
      if (sessionStorage.getItem("misha-loaded-v2")) {
        skip();
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
      skip();
      return;
    }

    setPhase("show");
    let value = 0;
    const tick = () => {
      value += Math.random() * 28 + 18;
      if (value >= 100) {
        setProgress(100);
        // Start enter under the cover, then lift so the choreography is visible
        releaseEnter("1");
        timer = window.setTimeout(() => {
          setPhase("done");
          try {
            sessionStorage.setItem("misha-loaded-v2", "1");
          } catch {
            /* ignore */
          }
        }, 120);
        return;
      }
      setProgress(Math.min(100, Math.floor(value)));
      timer = window.setTimeout(tick, 28 + Math.random() * 32);
    };
    tick();

    // Safety — never leave the page without an enter signal
    const safety = window.setTimeout(() => {
      if (document.documentElement.getAttribute("data-enter") == null) {
        releaseEnter("1");
        setPhase("done");
      }
    }, 2400);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(safety);
    };
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
