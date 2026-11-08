"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";

function signalLoaderDone() {
  try {
    window.dispatchEvent(new Event("misha:loader-done"));
  } catch {
    /* ignore */
  }
}

/**
 * Brief first-visit cover. Fires `misha:loader-done` when lifted so Hero
 * can start its enter choreography in the clear.
 */
export function PageLoader() {
  const [phase, setPhase] = useState<"idle" | "show" | "done">("idle");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const finishQuiet = () => {
      setPhase("done");
      signalLoaderDone();
      try {
        sessionStorage.setItem("misha-loaded-v2", "1");
      } catch {
        /* ignore */
      }
    };

    try {
      if (sessionStorage.getItem("misha-loaded-v2")) {
        finishQuiet();
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
      finishQuiet();
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
          signalLoaderDone();
        }, 160);
        return;
      }
      setProgress(Math.min(100, Math.floor(value)));
      timer = window.setTimeout(tick, 28 + Math.random() * 32);
    };
    tick();

    const safety = window.setTimeout(() => {
      setPhase("done");
      signalLoaderDone();
    }, 2200);

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
