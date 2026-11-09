"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { featuredCases } from "@/data/site";
import { Shell } from "@/components/ui/Primitives";
import { easeOut, springSoft } from "@/lib/motion";

type CaseItem = (typeof featuredCases)[number];

const soft = { duration: 0.36, ease: easeOut } as const;

/** iOS continuous-corner squircle (~22.37%) */
function AppIcon({ src, size = 64 }: { src: string; size?: number }) {
  const webp = src.replace(/\.png$/, ".webp");

  return (
    <span
      className="relative block shrink-0 overflow-hidden"
      style={{
        width: size,
        height: size,
        borderRadius: "22.37%",
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.35), inset 0 0 0 0.5px rgba(255,255,255,0.18)",
      }}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={webp}
        alt=""
        width={size}
        height={size}
        decoding="async"
        loading="lazy"
        draggable={false}
        className="pointer-events-none h-full w-full object-cover"
        onError={(e) => {
          const el = e.currentTarget;
          if (!el.src.endsWith(".png")) el.src = src;
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[42%] bg-gradient-to-b from-white/20 to-transparent"
      />
    </span>
  );
}

function Stars() {
  return (
    <span className="inline-flex items-center gap-[2px]" aria-label="4.9 out of 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="9"
          height="9"
          viewBox="0 0 12 12"
          fill={i < 5 ? "#0a84ff" : "rgba(255,255,255,0.15)"}
          aria-hidden
        >
          <path d="M6 0.8l1.5 3.2 3.5.4-2.6 2.4.7 3.4L6 8.6 2.9 10.2l.7-3.4L1 4.4l3.5-.4L6 .8z" />
        </svg>
      ))}
      <span className="ml-1 text-[11px] font-medium tabular-nums text-white/35">
        4.9
      </span>
    </span>
  );
}

function Shot({
  src,
  delay,
  reduce,
}: {
  src: string;
  delay: number;
  reduce: boolean | null;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ delay, ...soft }}
      className="relative aspect-[9/19.5] min-w-0 flex-1 overflow-hidden rounded-[16px] bg-[#000] shadow-[0_8px_24px_rgba(0,0,0,0.45)] ring-1 ring-white/[0.12]"
    >
      {/* Device status strip */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 z-10 flex h-4 items-center justify-between px-2"
      >
        <span className="text-[5px] font-semibold tabular-nums text-white/80">
          9:41
        </span>
        <span className="h-[3px] w-[9px] rounded-[1px] bg-white/80" />
      </div>
      <Image
        src={src}
        alt=""
        fill
        className="object-cover object-top"
        sizes="130px"
      />
    </motion.div>
  );
}

function AppStoreCard({
  item,
  index,
}: {
  item: CaseItem;
  index: number;
}) {
  const reduce = useReducedMotion();
  const href = `/drafts/${item.slug}`;
  const shots = (
    item.gallery.length
      ? [...item.gallery]
      : [item.image, item.image, item.image]
  ).slice(0, 3);
  while (shots.length < 3) shots.push(shots[shots.length - 1] ?? item.image);

  const category = item.category.split("·")[0]?.trim() ?? "App";

  return (
    <motion.article
      initial={
        reduce
          ? false
          : { opacity: 0, transform: "translateX(18px) scale(0.98)" }
      }
      whileInView={{
        opacity: 1,
        transform: "translateX(0px) scale(1)",
      }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ ...springSoft, delay: Math.min(index, 2) * 0.06 }}
      className="flex w-[min(80vw,310px)] shrink-0 flex-col rounded-[24px] bg-[#000000] p-4 ring-1 ring-white/[0.09] sm:w-[330px] sm:rounded-[28px] sm:p-5 lg:w-[min(350px,calc((100vw-5.5rem)/3))]"
      style={{ scrollSnapAlign: "start" }}
    >
      {/* Product header */}
      <div className="flex items-center gap-3">
        <AppIcon src={item.icon} size={64} />
        <div className="min-w-0 flex-1 py-0.5">
          <h3 className="truncate text-[17px] font-semibold leading-[1.15] tracking-[-0.022em] text-white">
            {item.title}
          </h3>
          <p className="mt-[3px] truncate text-[13px] font-normal leading-tight text-[#98989d]">
            {item.tagline}
          </p>
          <div className="mt-1.5">
            <Stars />
          </div>
        </div>
        <Link
          href={href}
          className="pressable shrink-0 rounded-full bg-[#0a84ff] px-[14px] py-[6px] text-[14px] font-semibold leading-none tracking-[-0.01em] !text-white"
        >
          Open
        </Link>
      </div>

      {/* Category chip row — App Store chrome */}
      <div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-[#98989d]">
        <span>{category}</span>
        <span className="text-white/20">·</span>
        <span>{item.year}</span>
        <span className="text-white/20">·</span>
        <span>17+</span>
      </div>

      {/* Screenshots */}
      <div className="mt-3.5 flex gap-[7px]">
        {shots.map((src, i) => (
          <Shot
            key={`${item.slug}-${i}`}
            src={src}
            delay={0.06 + i * 0.05}
            reduce={reduce}
          />
        ))}
      </div>

      {/* What’s New */}
      <div className="mt-4 border-t border-white/[0.08] pt-3.5">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[17px] font-semibold tracking-[-0.022em] text-white">
            What&apos;s New
          </p>
          <Link
            href={href}
            className="text-[13px] font-normal text-[#0a84ff]"
          >
            Version History
          </Link>
        </div>
        <p className="mt-1 text-[12px] font-normal text-[#98989d]">
          Version 1.0 · {item.year}
        </p>
        <p className="mt-2 line-clamp-2 text-[13px] leading-[1.35] text-white/80">
          {item.summary}
        </p>
      </div>
    </motion.article>
  );
}

export function WorkSection() {
  const reduce = useReducedMotion();

  return (
    <section id="work" className="scroll-mt-28 py-16 md:py-24">
      <Shell>
        <motion.div
          className="flex items-baseline justify-between gap-4"
          initial={
            reduce ? false : { opacity: 0, transform: "translateY(10px)" }
          }
          whileInView={{ opacity: 1, transform: "translateY(0px)" }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.35, ease: easeOut }}
        >
          <h2 className="deepdive-display text-[28px] text-white sm:text-[34px]">
            Selected work
          </h2>
          <Link
            href="/cases"
            className="text-[15px] font-normal text-[#0a84ff]"
          >
            See All
          </Link>
        </motion.div>
      </Shell>

      <div
        className="mt-6 flex gap-3 overflow-x-auto overscroll-x-contain pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-8 sm:gap-4 [&::-webkit-scrollbar]:hidden"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-x",
          paddingInline: "max(1.25rem, calc((100vw - 1120px) / 2))",
        }}
      >
        {featuredCases.map((item, i) => (
          <AppStoreCard key={item.slug} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
