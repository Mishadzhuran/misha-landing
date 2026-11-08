"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";

/** Simple brand marks only — same box, same glyph size. Tools + languages. */
const items = [
  { name: "Figma", src: "/icons/figma.svg" },
  { name: "Swift", src: "/icons/swift.svg" },
  { name: "Kotlin", src: "/icons/kotlin.svg" },
  { name: "Flutter", src: "/icons/flutter.svg" },
  { name: "TypeScript", src: "/icons/typescript.svg" },
  { name: "React", src: "/icons/react.svg" },
  { name: "Next.js", src: "/icons/nextjs.svg", invert: true },
  { name: "VS Code", src: "/icons/vscode.svg" },
  { name: "Xcode", src: "/icons/xcode.svg" },
  { name: "Supabase", src: "/icons/supabase.svg" },
  { name: "Stripe", src: "/icons/stripe.svg" },
  { name: "Framer", src: "/icons/framer.svg" },
  { name: "Sentry", src: "/icons/sentry.svg", invert: true },
  { name: "GitHub", src: "/icons/github.svg", invert: true },
] as const;

function Track({ suffix }: { suffix: string }) {
  return (
    <ul
      className="flex shrink-0 items-end gap-8 sm:gap-10 md:gap-12"
      aria-hidden
    >
      {items.map((item) => (
        <li
          key={`${suffix}-${item.name}`}
          className="flex w-16 shrink-0 flex-col items-center gap-2.5 sm:w-[4.25rem]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-white/[0.08] sm:h-12 sm:w-12 sm:rounded-[13px]">
            <Image
              src={item.src}
              alt=""
              width={28}
              height={28}
              className={`h-7 w-7 object-contain sm:h-[30px] sm:w-[30px] ${
                "invert" in item && item.invert
                  ? "brightness-0 invert"
                  : ""
              }`}
            />
          </span>
          <span className="text-center text-[11px] font-medium tracking-[-0.01em] text-white/55 sm:text-[12px]">
            {item.name}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function TechMarquee() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-x-clip py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="text-center text-[12px] font-semibold uppercase tracking-[0.16em] text-white/35">
          Working with
        </p>
        <p className="sr-only">{items.map((i) => i.name).join(", ")}</p>
      </div>

      <div className="relative mt-7 md:mt-9">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#0a0a0a] to-transparent sm:w-12 md:w-16"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#0a0a0a] to-transparent sm:w-12 md:w-16"
        />

        {reduce ? (
          <div className="flex justify-center overflow-x-auto px-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Track suffix="static" />
          </div>
        ) : (
          <div className="tech-marquee flex w-max gap-8 sm:gap-10 md:gap-12">
            <Track suffix="a" />
            <Track suffix="b" />
          </div>
        )}
      </div>
    </section>
  );
}
