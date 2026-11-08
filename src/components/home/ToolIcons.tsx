"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { easeOut } from "@/lib/motion";

type Tool = {
  name: string;
  src: string;
  x: string;
  y: string;
  size: number;
  delay: number;
  layer: "front" | "back";
  peek?: boolean;
  /** Hide below md — desktop always keeps the full set. */
  mobile?: boolean;
  contain?: boolean;
  from?: "left" | "right" | "up" | "down";
};

/** Desktop composition — mobile only scales/hides via CSS, never remounts. */
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
    size: 52,
    delay: 0.22,
    layer: "back",
    from: "up",
    mobile: false,
  },
  {
    name: "App Store",
    src: "/icons/appstore.png",
    x: "78%",
    y: "10%",
    size: 48,
    delay: 0.33,
    layer: "back",
    from: "up",
    mobile: false,
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
    size: 50,
    delay: 0.66,
    layer: "back",
    contain: true,
    from: "left",
    mobile: false,
  },
  {
    name: "TypeScript",
    src: "/icons/typescript.svg",
    x: "76%",
    y: "38%",
    size: 46,
    delay: 0.77,
    layer: "back",
    contain: true,
    from: "right",
    mobile: false,
  },
  {
    name: "Kotlin",
    src: "/icons/kotlin.svg",
    x: "18%",
    y: "58%",
    size: 42,
    delay: 0.88,
    layer: "back",
    contain: true,
    from: "left",
    mobile: false,
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
    size: 48,
    delay: 1.1,
    layer: "back",
    contain: true,
    from: "down",
    mobile: false,
  },
  {
    name: "Next.js",
    src: "/icons/nextjs.svg",
    x: "72%",
    y: "68%",
    size: 46,
    delay: 1.21,
    layer: "back",
    contain: true,
    from: "down",
    mobile: false,
  },
  {
    name: "Supabase",
    src: "/icons/supabase.svg",
    x: "28%",
    y: "86%",
    size: 44,
    delay: 1.32,
    layer: "back",
    contain: true,
    from: "down",
    mobile: false,
  },
  {
    name: "Notion",
    src: "/icons/notion.png",
    x: "62%",
    y: "88%",
    size: 44,
    delay: 1.43,
    layer: "back",
    from: "down",
    mobile: false,
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
  const from = offsetFor(t.from);
  const enterAt = startDelay + t.delay;
  const spin =
    t.from === "left" ? -12 : t.from === "right" ? 12 : t.from === "up" ? -4 : 6;
  const floatAmp = behind ? 3 + (t.delay % 0.3) * 4 : 5 + (t.delay % 0.4) * 5;
  const floatDur = 6.8 + t.delay * 1.4;
  const float = !reduce;

  return (
    <motion.div
      className={`absolute will-change-transform ${
        t.mobile === false ? "max-md:hidden" : ""
      }`}
      style={{
        left: t.x,
        top: t.y,
        width: t.size,
        height: t.size,
        zIndex: behind ? 1 : 20,
      }}
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
        opacity: { duration: 0.45, delay: enterAt, ease: easeOut },
        x: { duration: 0.65, delay: enterAt, ease: easeOut },
        y: { duration: 0.65, delay: enterAt, ease: easeOut },
        scale: { type: "spring", stiffness: 380, damping: 22, delay: enterAt },
        rotate: { duration: 0.55, delay: enterAt, ease: easeOut },
      }}
    >
      <motion.div
        className="h-full w-full"
        animate={float ? { y: [0, -floatAmp, 0] } : undefined}
        transition={
          float
            ? {
                duration: floatDur,
                repeat: Infinity,
                ease: "easeInOut",
                delay: enterAt + 0.85,
              }
            : undefined
        }
      >
        <div
          className={`relative h-full w-full overflow-hidden rounded-[16px] bg-white ring-1 ring-black/[0.06] ${
            behind
              ? "shadow-[0_8px_22px_rgba(0,0,0,0.08)]"
              : "shadow-[0_14px_32px_rgba(0,0,0,0.12)]"
          }`}
        >
          <Image
            src={t.src}
            alt=""
            fill
            loading="lazy"
            decoding="async"
            className={t.contain ? "object-contain p-[16%]" : "object-cover"}
            sizes="72px"
          />
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
      className="pointer-events-none absolute inset-0 origin-center overflow-visible max-md:scale-[0.72]"
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
