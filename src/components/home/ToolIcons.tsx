"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { easeOut } from "@/lib/motion";

type Tool = {
  name: string;
  src: string;
  x: string;
  y: string;
  /** Mobile-safe position (closer to phone). Falls back to x/y. */
  mx?: string;
  my?: string;
  size: number;
  delay: number;
  layer: "front" | "back";
  /** Only peek icons sit slightly outside the glass card. Max 5. */
  peek?: boolean;
  /** Hide on small screens to keep the stage clean. Default true. */
  mobile?: boolean;
  contain?: boolean;
  /** Entrance direction bias */
  from?: "left" | "right" | "up" | "down";
};

/**
 * Max 5 peek partly past the glass edge (md+).
 * On mobile peek icons are hidden; inner icons use tighter positions.
 */
/** Stagger so each icon reads as its own entrance (~100–120ms apart). */
const tools: Tool[] = [
  {
    name: "GitHub",
    src: "/icons/github-mark.png",
    x: "-3%",
    y: "22%",
    size: 64,
    delay: 0,
    layer: "front",
    peek: true,
    contain: true,
    from: "left",
  },
  {
    name: "VS Code",
    src: "/icons/vscode.svg",
    x: "91%",
    y: "18%",
    size: 64,
    delay: 0.11,
    layer: "front",
    peek: true,
    contain: true,
    from: "right",
  },
  {
    name: "Xcode",
    src: "/icons/xcode.png",
    x: "10%",
    y: "14%",
    mx: "12%",
    my: "12%",
    size: 52,
    delay: 0.22,
    layer: "back",
    from: "up",
  },
  {
    name: "App Store",
    src: "/icons/appstore.png",
    x: "78%",
    y: "10%",
    mx: "78%",
    my: "11%",
    size: 48,
    delay: 0.33,
    layer: "back",
    from: "up",
  },
  {
    name: "TestFlight",
    src: "/icons/testflight.png",
    x: "-4%",
    y: "58%",
    size: 68,
    delay: 0.44,
    layer: "front",
    peek: true,
    from: "left",
  },
  {
    name: "Figma",
    src: "/icons/figma-app.svg",
    x: "92%",
    y: "52%",
    size: 62,
    delay: 0.55,
    layer: "front",
    peek: true,
    from: "right",
  },
  {
    name: "React",
    src: "/icons/react.svg",
    x: "14%",
    y: "42%",
    mx: "11%",
    my: "40%",
    size: 50,
    delay: 0.66,
    layer: "back",
    contain: true,
    from: "left",
  },
  {
    name: "TypeScript",
    src: "/icons/typescript.svg",
    x: "76%",
    y: "38%",
    mx: "79%",
    my: "38%",
    size: 46,
    delay: 0.77,
    layer: "back",
    contain: true,
    from: "right",
  },
  {
    name: "Kotlin",
    src: "/icons/kotlin.svg",
    x: "18%",
    y: "58%",
    mx: "12%",
    my: "62%",
    size: 42,
    delay: 0.88,
    layer: "back",
    contain: true,
    from: "left",
  },
  {
    name: "Swift",
    src: "/icons/swift.png",
    x: "88%",
    y: "78%",
    size: 58,
    delay: 0.99,
    layer: "front",
    peek: true,
    from: "right",
  },
  {
    name: "Flutter",
    src: "/icons/flutter.svg",
    x: "18%",
    y: "72%",
    mx: "10%",
    my: "70%",
    size: 48,
    delay: 1.1,
    layer: "back",
    contain: true,
    mobile: false,
    from: "down",
  },
  {
    name: "Next.js",
    src: "/icons/nextjs.svg",
    x: "72%",
    y: "68%",
    mx: "72%",
    my: "66%",
    size: 46,
    delay: 1.21,
    layer: "back",
    contain: true,
    mobile: false,
    from: "down",
  },
  {
    name: "Supabase",
    src: "/icons/supabase.svg",
    x: "28%",
    y: "86%",
    mx: "20%",
    my: "82%",
    size: 44,
    delay: 1.32,
    layer: "back",
    contain: true,
    mobile: false,
    from: "down",
  },
  {
    name: "Notion",
    src: "/icons/notion.png",
    x: "62%",
    y: "88%",
    mx: "66%",
    my: "82%",
    size: 44,
    delay: 1.43,
    layer: "back",
    mobile: false,
    from: "down",
  },
];

function offsetFor(from: Tool["from"]) {
  switch (from) {
    case "left":
      return { x: -42, y: 14 };
    case "right":
      return { x: 42, y: 14 };
    case "up":
      return { x: 0, y: -36 };
    case "down":
      return { x: 0, y: 40 };
    default:
      return { x: 0, y: 20 };
  }
}

function useIsMd() {
  const [md, setMd] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(min-width: 768px)");
    const sync = () => setMd(m.matches);
    sync();
    m.addEventListener("change", sync);
    return () => m.removeEventListener("change", sync);
  }, []);
  return md;
}

function IconChip({
  t,
  md,
  startDelay,
  reduce,
}: {
  t: Tool;
  md: boolean;
  startDelay: number;
  reduce: boolean | null;
}) {
  const behind = t.layer === "back";
  if (t.peek && !md) return null;
  if (t.mobile === false && !md) return null;

  const size = md ? t.size : Math.round(t.size * 0.62);
  const left = md ? t.x : (t.mx ?? t.x);
  const top = md ? t.y : (t.my ?? t.y);
  const from = offsetFor(t.from);
  const enterAt = startDelay + t.delay;
  const spin =
    t.from === "left" ? -12 : t.from === "right" ? 12 : t.from === "up" ? -4 : 6;
  const floatAmp = behind ? 3 + (t.delay % 0.3) * 4 : 5 + (t.delay % 0.4) * 5;
  const floatDur = 6.8 + t.delay * 1.4;

  return (
    <motion.div
      className="absolute will-change-transform"
      style={{ left, top, width: size, height: size, zIndex: behind ? 1 : 20 }}
      initial={
        reduce
          ? false
          : {
              opacity: 0,
              x: from.x,
              y: from.y,
              scale: 0.62,
              rotate: spin,
            }
      }
      animate={{
        opacity: behind ? 0.85 : 1,
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
      }}
      transition={{
        opacity: { duration: 0.5, delay: enterAt, ease: easeOut },
        x: { duration: 0.72, delay: enterAt, ease: easeOut },
        y: { duration: 0.72, delay: enterAt, ease: easeOut },
        scale: { type: "spring", stiffness: 380, damping: 22, delay: enterAt },
        rotate: { duration: 0.7, delay: enterAt, ease: easeOut },
      }}
    >
      <motion.div
        className="h-full w-full"
        animate={reduce ? undefined : { y: [0, -floatAmp, 0] }}
        transition={
          reduce
            ? undefined
            : {
                duration: floatDur,
                repeat: Infinity,
                ease: "easeInOut",
                delay: enterAt + 0.85,
              }
        }
      >
        <div
          className={`relative h-full w-full overflow-hidden rounded-[14px] bg-white ring-1 ring-black/[0.06] md:rounded-[16px] ${
            behind
              ? "shadow-[0_8px_22px_rgba(0,0,0,0.08)]"
              : "shadow-[0_14px_32px_rgba(0,0,0,0.12)]"
          }`}
          style={{ filter: "saturate(1.15) contrast(1.05)" }}
        >
          <Image
            src={t.src}
            alt={t.name}
            fill
            className={t.contain ? "object-contain p-[16%]" : "object-cover"}
            sizes="72px"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ToolIcons({ startDelay = 0 }: { startDelay?: number }) {
  const md = useIsMd();
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden md:overflow-visible"
    >
      {tools
        .filter((t) => t.layer === "back")
        .map((t) => (
          <IconChip
            key={`b-${t.name}`}
            t={t}
            md={md}
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
            md={md}
            startDelay={startDelay}
            reduce={reduce}
          />
        ))}
    </div>
  );
}
