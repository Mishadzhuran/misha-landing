"use client";

import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { scrollChapters } from "@/data/site";
import { MagneticButton, Shell } from "@/components/ui/Shell";
import {
  CHAPTER_LAYOUTS,
  INTRO_END,
  OUTRO_START,
  JourneySnapshot,
  snapJourneyProgress,
  snapshotJourney,
} from "@/lib/journeyMotion";

gsap.registerPlugin(ScrollTrigger);

const PhoneJourneyCanvas = dynamic(
  () =>
    import("@/components/three/PhoneJourneyCanvas").then(
      (m) => m.PhoneJourneyCanvas
    ),
  { ssr: false }
);

function layoutClass(chapter: number) {
  const layout = CHAPTER_LAYOUTS[chapter] ?? CHAPTER_LAYOUTS[0];
  const side =
    layout.side === "left"
      ? "md:left-[4%] md:right-auto lg:left-[6%]"
      : "md:right-[4%] md:left-auto lg:right-[6%]";
  const vertical =
    layout.vertical === "top"
      ? "top-[11%] md:top-[13%]"
      : layout.vertical === "bottom"
        ? "top-auto bottom-[22%] md:bottom-[24%]"
        : "top-[20%] md:top-[24%]";
  const align =
    layout.align === "right"
      ? "md:text-right md:items-end"
      : layout.align === "center"
        ? "text-center items-center"
        : "md:text-left md:items-start";
  return { side, vertical, align, layout };
}

function ActiveChapter({ snapshot }: { snapshot: JourneySnapshot }) {
  const chapter = scrollChapters[snapshot.chapter] ?? scrollChapters[0];
  const visible =
    snapshot.progress > INTRO_END &&
    snapshot.progress < OUTRO_START &&
    snapshot.title > 0.08;
  const { side, vertical, align, layout } = layoutClass(snapshot.chapter);
  const listAlign = layout.align === "right" ? "md:ml-auto" : "";

  return (
    <article
      className={`pointer-events-none absolute inset-x-0 mx-auto flex w-[min(520px,90%)] flex-col text-center md:mx-0 md:w-[min(400px,36%)] ${side} ${vertical} ${align}`}
      style={{ opacity: visible ? 1 : 0 }}
    >
      <p
        className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-red"
        style={{
          opacity: snapshot.title,
          transform: `translateY(${(1 - snapshot.title) * 10}px)`,
        }}
      >
        {chapter.index} / 0{scrollChapters.length}
      </p>

      <h2
        className="soft-title text-[clamp(2.6rem,5vw,4rem)] text-white"
        style={{
          opacity: snapshot.title,
          transform: `translateY(${(1 - snapshot.title) * 14}px)`,
        }}
      >
        {chapter.title}
      </h2>

      <p
        className={`mt-4 max-w-md text-lg font-semibold leading-snug text-white md:text-xl ${
          layout.align === "right" ? "md:ml-auto" : ""
        }`}
        style={{
          opacity: snapshot.line,
          transform: `translateY(${(1 - snapshot.line) * 10}px)`,
        }}
      >
        {chapter.line}
      </p>

      <p
        className={`mt-3 max-w-md text-[1.05rem] leading-relaxed text-white/70 ${
          layout.align === "right" ? "md:ml-auto" : ""
        }`}
        style={{
          opacity: snapshot.body,
          transform: `translateY(${(1 - snapshot.body) * 8}px)`,
        }}
      >
        {chapter.body}
      </p>

      <ul
        className={`mt-6 w-full max-w-md space-y-2.5 ${listAlign} ${
          layout.align === "right" ? "md:text-right" : "text-left"
        }`}
      >
        {chapter.points.map((point, i) => {
          const amt = snapshot.bullets[i] ?? 0;
          return (
            <li
              key={`${chapter.id}-${point}`}
              className={`flex items-start gap-3 text-[15px] leading-snug text-white/85 md:text-[16px] ${
                layout.align === "right" ? "flex-row-reverse" : ""
              }`}
              style={{
                opacity: amt,
                transform: `translateY(${(1 - amt) * 10}px)`,
              }}
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
              <span>{point}</span>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

function ProgressHUD({ progress }: { progress: number }) {
  const label = `${String(Math.round(progress * 100)).padStart(2, "0")}%`;
  return (
    <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-soft">
      <span>Product scroll</span>
      <span className="tabular-nums text-red">{label}</span>
      <span
        className="relative ml-1 hidden h-[3px] w-28 overflow-hidden rounded-full bg-red/20 sm:block"
        aria-hidden
      >
        <span
          className="absolute inset-y-0 left-0 rounded-full bg-red"
          style={{ width: `${progress * 100}%` }}
        />
      </span>
    </div>
  );
}

function StageDots({ active }: { active: number }) {
  return (
    <div className="flex items-center justify-center gap-2 md:justify-end">
      {scrollChapters.map((c, i) => {
        const on = i === active;
        return (
          <span
            key={c.id}
            className="block h-1.5 rounded-full bg-red transition-[width,opacity] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            style={{ width: on ? 44 : 10, opacity: on ? 1 : 0.28 }}
            aria-hidden
          />
        );
      })}
    </div>
  );
}

export function PhoneJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const snapshotRef = useRef<JourneySnapshot>(snapshotJourney(0));
  const lastChapter = useRef(0);
  const [snapshot, setSnapshot] = useState<JourneySnapshot>(snapshotJourney(0));
  const [hudProgress, setHudProgress] = useState(0);
  const [canvasActive, setCanvasActive] = useState(true);
  const [mountCanvas, setMountCanvas] = useState(false);
  const rafGate = useRef(0);
  const hudGate = useRef(0);
  const stRef = useRef<ScrollTrigger | null>(null);
  const snapping = useRef(false);
  const lastDir = useRef(0);
  const lastScroll = useRef(0);
  const lenis = useLenis();

  useLenis(() => {
    ScrollTrigger.update();
  });

  // Pause WebGL when off-screen or tab is hidden
  useEffect(() => {
    const pin = pinRef.current;
    if (!pin || typeof IntersectionObserver === "undefined") return;

    let inView = true;
    const sync = () => {
      setCanvasActive(inView && document.visibilityState === "visible");
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { root: null, threshold: 0.02, rootMargin: "60px" }
    );
    io.observe(pin);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  // Defer Three.js until real interaction, avoids lab TBT from GLB/shaders
  useEffect(() => {
    let done = false;
    const enable = () => {
      if (done) return;
      done = true;
      setMountCanvas(true);
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener("pointerdown", enable);
      window.removeEventListener("keydown", enable);
      window.removeEventListener("touchstart", enable);
      window.removeEventListener("wheel", enable);
    };

    window.addEventListener("pointerdown", enable, { once: true, passive: true });
    window.addEventListener("keydown", enable, { once: true });
    window.addEventListener("touchstart", enable, { once: true, passive: true });
    window.addEventListener("wheel", enable, { once: true, passive: true });

    // Late fallback for passive visitors (after typical Lighthouse window)
    const timeoutId = window.setTimeout(enable, 12000);

    return () => {
      done = true;
      cleanup();
      window.clearTimeout(timeoutId);
    };
  }, []);

  // Reliable Lenis snap: wait until wheel inertia dies, then finish onto a hold
  useEffect(() => {
    if (!lenis) return;

    let settleTimer: ReturnType<typeof setTimeout>;

    const finishToHold = () => {
      const st = stRef.current;
      if (!st) return;
      const inRange =
        lenis.scroll >= st.start - 2 && lenis.scroll <= st.end + 2;
      if (!inRange || snapping.current) return;

      const progress = st.progress;
      const target = snapJourneyProgress(progress, lastDir.current);
      if (Math.abs(target - progress) < 0.006) return;

      const y = st.start + (st.end - st.start) * target;
      snapping.current = true;
      lenis.scrollTo(y, {
        duration: 0.85,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        force: true,
        lock: true,
        onComplete: () => {
          snapping.current = false;
          ScrollTrigger.update();
          const done = stRef.current;
          if (done) {
            const next = snapshotJourney(done.progress);
            snapshotRef.current = next;
            setHudProgress(done.progress);
            setSnapshot(next);
          }
        },
      });
    };

    const onScroll = (e: { velocity: number; scroll: number }) => {
      ScrollTrigger.update();
      const dy = e.scroll - lastScroll.current;
      if (Math.abs(dy) > 0.5) {
        lastDir.current = dy > 0 ? 1 : -1;
      }
      lastScroll.current = e.scroll;

      if (snapping.current) return;

      clearTimeout(settleTimer);
      if (Math.abs(e.velocity) > 0.15) return;

      settleTimer = setTimeout(() => {
        if (Math.abs(lenis.velocity) > 0.08) return;
        finishToHold();
      }, 90);
    };

    lenis.on("scroll", onScroll);
    return () => {
      clearTimeout(settleTimer);
      lenis.off("scroll", onScroll);
    };
  }, [lenis]);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const ctx = gsap.context(() => {
      stRef.current = ScrollTrigger.create({
        id: "phone-journey",
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin,
        scrub: 0.55,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const next = snapshotJourney(self.progress);
          snapshotRef.current = next;

          const now = performance.now();
          if (now - hudGate.current > 80) {
            hudGate.current = now;
            setHudProgress(self.progress);
          }

          const chapterChanged = next.chapter !== lastChapter.current;
          if (chapterChanged) lastChapter.current = next.chapter;

          // ~16fps React text updates. 3D reads snapshotRef every frame
          if (chapterChanged || now - rafGate.current > 60) {
            rafGate.current = now;
            setSnapshot(next);
          }
        },
      });
    }, section);

    const refresh = () => ScrollTrigger.refresh();
    refresh();
    const t = window.setTimeout(refresh, 120);
    window.addEventListener("resize", refresh);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", refresh);
      stRef.current = null;
      ctx.revert();
    };
  }, []);

  const introOpacity =
    snapshot.progress < INTRO_END
      ? 1 - snapshot.progress / (INTRO_END * 0.75)
      : 0;
  const introY = snapshot.progress * -40;
  const chapterOpacity = Math.min(
    1,
    Math.max(
      0,
      Math.min(
        (snapshot.progress - INTRO_END * 0.75) / 0.1,
        1 - snapshot.outro * 2.2
      )
    )
  );
  const hudOpacity = Math.min(
    1,
    Math.max(
      0,
      Math.min(
        (snapshot.progress - INTRO_END * 0.5) / 0.1,
        1 - snapshot.outro * 2.5
      )
    )
  );
  const hintOpacity =
    snapshot.progress < 0.035
      ? 1
      : snapshot.progress < 0.08
        ? 1 - (snapshot.progress - 0.035) / 0.045
        : 0;

  const layout = CHAPTER_LAYOUTS[snapshot.chapter] ?? CHAPTER_LAYOUTS[0];
  const veil =
    layout.side === "left"
      ? "bg-[linear-gradient(90deg,rgba(5,5,6,0.55)_0%,rgba(5,5,6,0.12)_40%,rgba(5,5,6,0)_65%)]"
      : "bg-[linear-gradient(270deg,rgba(5,5,6,0.55)_0%,rgba(5,5,6,0.12)_40%,rgba(5,5,6,0)_65%)]";

  return (
    <section ref={sectionRef} className="relative h-[820vh]">
      <div
        ref={pinRef}
        className="relative h-[100svh] overflow-hidden bg-[#050508]"
      >
        {/* CSS space field, depth without WebGL particle cost */}
        <div
          className="journey-space pointer-events-none absolute inset-0"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(239,26,18,0.08),transparent_55%)]" />

        <div className="absolute inset-0 z-[1]">
          {mountCanvas ? (
            <PhoneJourneyCanvas
              snapshotRef={snapshotRef}
              active={canvasActive}
            />
          ) : (
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              aria-hidden
            >
              <div className="absolute left-1/2 top-[42%] h-[min(58vh,520px)] w-[min(42vw,280px)] -translate-x-1/2 -translate-y-1/2 rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] shadow-[0_0_80px_rgba(239,26,18,0.12)]" />
            </div>
          )}
        </div>

        <div
          className={`pointer-events-none absolute inset-0 z-[2] transition-opacity duration-500 ${veil}`}
          style={{ opacity: chapterOpacity }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-52 bg-gradient-to-t from-[#050508] via-[#050508]/85 to-transparent md:h-64" />

        <Shell wide className="relative z-[3] h-full">
          <div className="relative h-full">
            <div
              className="absolute inset-x-0 top-[10%] z-10 mx-auto max-w-xl px-4 text-center md:left-[4%] md:right-auto md:mx-0 md:max-w-lg md:text-left lg:left-[6%]"
              style={{
                opacity: Math.max(0, introOpacity),
                transform: `translateY(${introY}px)`,
                pointerEvents: introOpacity < 0.15 ? "none" : "auto",
              }}
            >
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

            <div
              className="pointer-events-none absolute inset-0 z-20"
              style={{ opacity: chapterOpacity }}
            >
              <ActiveChapter snapshot={snapshot} />
            </div>

            <div
              className="absolute bottom-8 left-0 right-0 z-30 flex flex-col gap-4 md:bottom-10 md:flex-row md:items-center md:justify-between"
              style={{ opacity: hudOpacity }}
            >
              <ProgressHUD progress={hudProgress} />
              <StageDots active={snapshot.chapter} />
            </div>

            <p
              className="absolute bottom-24 left-1/2 z-30 -translate-x-1/2 text-[12px] font-medium uppercase tracking-[0.2em] text-muted-soft md:bottom-28"
              style={{ opacity: hintOpacity }}
            >
              Scroll to turn the product →
            </p>
          </div>
        </Shell>
      </div>
    </section>
  );
}
