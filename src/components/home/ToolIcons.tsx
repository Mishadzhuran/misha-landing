"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { easeOut } from "@/lib/motion";

/** Slow, soft fly-out from the phone — longer than springSoft. */
const flyOut = {
  type: "spring" as const,
  duration: 1.15,
  bounce: 0.12,
};

type Tool = {
  name: string;
  src: string;
  x: string;
  y: string;
  size: number;
  delay: number;
  layer: "front" | "back";
  peek?: boolean;
  mobile?: boolean;
  mx?: string;
  my?: string;
  msize?: number;
  tilt?: number;
  contain?: boolean;
};

/**
 * Desktop: asymmetric side scatter. Mobile: tighter mx/my layout.
 * Entrance: every chip bursts out of the phone center to its seat.
 */
/**
 * Desktop: wide asymmetric scatter (can go past 0/100).
 * Mobile: stay inside 0–86% so nothing widens the page or needs sideways scroll.
 * Phone sits in the center ~18–82%; icons live in the side gutters only.
 */
const tools: Tool[] = [
  {
    name: "GitHub",
    src: "/icons/github-mark.png",
    x: "-22%",
    y: "2%",
    size: 72,
    mx: "1%",
    my: "5%",
    msize: 40,
    tilt: -9,
    delay: 0,
    layer: "front",
    peek: true,
    contain: true,
  },
  {
    name: "VS Code",
    src: "/icons/vscode.svg",
    x: "72%",
    y: "6%",
    size: 64,
    mx: "82%",
    my: "4%",
    msize: 38,
    tilt: 8,
    delay: 0.12,
    layer: "front",
    peek: true,
    contain: true,
  },
  {
    name: "Xcode",
    src: "/icons/xcode.png",
    x: "-6%",
    y: "30%",
    size: 56,
    tilt: 8,
    delay: 0.28,
    layer: "back",
    mobile: false,
  },
  {
    name: "App Store",
    src: "/icons/appstore.png",
    x: "108%",
    y: "10%",
    size: 54,
    tilt: -6,
    delay: 0.2,
    layer: "back",
    mobile: false,
  },
  {
    name: "TestFlight",
    src: "/icons/testflight.png",
    x: "14%",
    y: "44%",
    size: 76,
    mx: "0%",
    my: "28%",
    msize: 42,
    tilt: 6,
    delay: 0.36,
    layer: "front",
    peek: true,
  },
  {
    name: "Figma",
    src: "/icons/figma-app.svg",
    x: "104%",
    y: "40%",
    size: 68,
    mx: "84%",
    my: "26%",
    msize: 40,
    tilt: -7,
    delay: 0.44,
    layer: "front",
    peek: true,
  },
  {
    name: "React",
    src: "/icons/react.svg",
    x: "-18%",
    y: "56%",
    size: 58,
    tilt: -5,
    delay: 0.52,
    layer: "back",
    contain: true,
    mobile: false,
  },
  {
    name: "TypeScript",
    src: "/icons/typescript.svg",
    x: "70%",
    y: "56%",
    size: 54,
    tilt: 6,
    delay: 0.6,
    layer: "back",
    contain: true,
    mobile: false,
  },
  {
    name: "Kotlin",
    src: "/icons/kotlin.svg",
    x: "4%",
    y: "70%",
    size: 52,
    tilt: 12,
    delay: 0.68,
    layer: "back",
    contain: true,
    mobile: false,
  },
  {
    name: "Swift",
    src: "/icons/swift.png",
    x: "86%",
    y: "72%",
    size: 64,
    mx: "82%",
    my: "50%",
    msize: 40,
    tilt: 11,
    delay: 0.76,
    layer: "front",
    peek: true,
  },
  {
    name: "Flutter",
    src: "/icons/flutter.svg",
    x: "-16%",
    y: "78%",
    size: 58,
    mx: "1%",
    my: "52%",
    msize: 38,
    tilt: -8,
    delay: 0.84,
    layer: "front",
    peek: true,
    contain: true,
  },
  {
    name: "Next.js",
    src: "/icons/nextjs.svg",
    x: "76%",
    y: "24%",
    size: 52,
    tilt: -12,
    delay: 0.24,
    layer: "back",
    contain: true,
    mobile: false,
  },
  {
    name: "Supabase",
    src: "/icons/supabase.svg",
    x: "22%",
    y: "12%",
    size: 50,
    tilt: 4,
    delay: 0.16,
    layer: "back",
    contain: true,
    mobile: false,
  },
  {
    name: "Notion",
    src: "/icons/notion.png",
    x: "112%",
    y: "62%",
    size: 56,
    tilt: -9,
    delay: 0.92,
    layer: "back",
    mobile: false,
  },
  {
    name: "Framer",
    src: "/icons/framer-app.png",
    x: "96%",
    y: "86%",
    size: 54,
    mx: "84%",
    my: "72%",
    msize: 38,
    tilt: 7,
    delay: 1.0,
    layer: "front",
    peek: true,
    contain: true,
  },
  // Below / low — desktop bridge; mobile stays in side gutters
  {
    name: "Python",
    src: "/icons/python-app.svg",
    x: "8%",
    y: "92%",
    size: 56,
    mx: "2%",
    my: "76%",
    msize: 38,
    tilt: -6,
    delay: 1.08,
    layer: "front",
    peek: true,
  },
  {
    name: "Vercel",
    src: "/icons/vercel-app.svg",
    x: "78%",
    y: "94%",
    size: 58,
    mx: "82%",
    my: "86%",
    msize: 38,
    tilt: 9,
    delay: 1.16,
    layer: "front",
    peek: true,
  },
  {
    name: "JavaScript",
    src: "/icons/javascript-app.png",
    x: "42%",
    y: "98%",
    size: 52,
    tilt: -4,
    delay: 1.24,
    layer: "back",
    mobile: false,
  },
];

function IconChip({
  t,
  startDelay,
  reduce,
}: {
  t: Tool;
  startDelay: number;
  reduce: boolean | null;
}) {
  const behind = t.layer === "back";
  const enterAt = startDelay + t.delay;
  const floatAmp = behind ? 4 + (t.delay % 0.3) * 5 : 6 + (t.delay % 0.4) * 6;
  const floatDur = 5.8 + t.delay * 2.2;
  const float = !reduce;
  const tilt = t.tilt ?? 0;
  const spin = tilt === 0 ? 18 : tilt * 2.4;

  const mx = t.mx ?? t.x;
  const my = t.my ?? t.y;
  const msize = t.msize ?? t.size;

  const ref = useRef<HTMLDivElement>(null);
  const [burst, setBurst] = useState<{ x: number; y: number } | null>(null);

  useLayoutEffect(() => {
    if (reduce) {
      setBurst({ x: 0, y: 0 });
      return;
    }
    const el = ref.current;
    const parent = el?.offsetParent as HTMLElement | null;
    if (!el || !parent) return;

    const pr = parent.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    // Phone sits in the middle of this stage — burst origin
    const phoneCx = pr.width * 0.5;
    const phoneCy = pr.height * 0.48;
    const iconCx = er.left - pr.left + er.width / 2;
    const iconCy = er.top - pr.top + er.height / 2;
    setBurst({ x: phoneCx - iconCx, y: phoneCy - iconCy });
  }, [reduce]);

  const ready = burst !== null;
  const seatStyle = {
    "--chip-x": t.x,
    "--chip-y": t.y,
    "--chip-s": `${t.size}px`,
    "--chip-mx": mx,
    "--chip-my": my,
    "--chip-ms": `${msize}px`,
    "--chip-tilt": `${tilt}deg`,
    left: "var(--chip-x)",
    top: "var(--chip-y)",
    width: "var(--chip-s)",
    height: "var(--chip-s)",
    zIndex: behind ? 1 : 20,
  } as CSSProperties;

  // Invisible seat for one-frame measure before the burst plays
  if (!ready) {
    return (
      <div
        ref={ref}
        aria-hidden
        className={`tool-chip absolute opacity-0 ${
          t.mobile === false ? "max-md:hidden" : ""
        }`}
        style={seatStyle}
      />
    );
  }

  return (
    <motion.div
      className={`tool-chip absolute will-change-transform ${
        t.mobile === false ? "max-md:hidden" : ""
      }`}
      style={seatStyle}
      initial={
        reduce
          ? false
          : {
              opacity: 0,
              x: burst.x,
              y: burst.y,
              scale: 0.2,
              rotate: spin,
            }
      }
      animate={{
        opacity: behind ? 0.88 : 1,
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
      }}
      transition={
        reduce
          ? { duration: 0 }
          : {
              opacity: { duration: 0.55, delay: enterAt, ease: easeOut },
              x: { ...flyOut, delay: enterAt },
              y: { ...flyOut, delay: enterAt },
              scale: { ...flyOut, delay: enterAt },
              rotate: { duration: 1.05, delay: enterAt, ease: easeOut },
            }
      }
    >
      <motion.div
        className="h-full w-full"
        animate={
          float
            ? {
                y: [0, -floatAmp, 0],
                x: [0, tilt >= 0 ? 3 : -3, 0],
              }
            : undefined
        }
        transition={
          float
            ? {
                duration: floatDur,
                repeat: Infinity,
                ease: "easeInOut",
                delay: enterAt + 1.35,
              }
            : undefined
        }
      >
        <div className="tool-chip-tilt h-full w-full">
          <div
            className={`relative h-full w-full overflow-hidden rounded-[16px] bg-white ring-1 ring-black/[0.06] ${
              behind
                ? "shadow-[0_10px_26px_rgba(0,0,0,0.1)]"
                : "shadow-[0_16px_36px_rgba(0,0,0,0.14)]"
            }`}
          >
            <Image
              src={t.src}
              alt=""
              fill
              loading="lazy"
              decoding="async"
              className={t.contain ? "object-contain p-[16%]" : "object-cover"}
              sizes="80px"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ToolIcons({ startDelay = 0 }: { startDelay?: number }) {
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 overflow-visible"
    >
      {tools
        .filter((t) => t.layer === "back")
        .map((t) => (
          <IconChip
            key={`b-${t.name}`}
            t={t}
            startDelay={startDelay}
            reduce={reduce}
          />
        ))}
      {tools
        .filter((t) => t.layer === "front")
        .map((t) => (
          <IconChip
            key={`f-${t.name}`}
            t={t}
            startDelay={startDelay}
            reduce={reduce}
          />
        ))}
    </div>
  );
}
