"use client";

import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useRef } from "react";
import { cases } from "@/data/site";
import {
  BigTitle,
  Reveal,
  SectionLabel,
  Shell,
} from "@/components/ui/Primitives";

const ease = [0.16, 1, 0.3, 1] as const;

function WorkCard({
  item,
  index,
}: {
  item: (typeof cases)[number];
  index: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const rx = useSpring(0, { stiffness: 180, damping: 20 });
  const ry = useSpring(0, { stiffness: 180, damping: 20 });
  const glowX = useSpring(mx, { stiffness: 120, damping: 22 });
  const glowY = useSpring(my, { stiffness: 120, damping: 22 });
  const glow = useMotionTemplate`radial-gradient(520px circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.55), transparent 42%)`;

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    mx.set(px * 100);
    my.set(py * 100);
    ry.set((px - 0.5) * 14);
    rx.set((0.5 - py) * 12);
  };

  const onLeave = () => {
    mx.set(50);
    my.set(50);
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 48, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-8%", amount: 0.25 }}
      transition={{ duration: 0.75, delay: index * 0.08, ease }}
      style={{ perspective: 1000 }}
    >
      <motion.a
        ref={ref}
        href={`/cases#${item.slug}`}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        whileHover={{ y: -10, scale: 1.015 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="group relative block h-full overflow-hidden rounded-[1.6rem] border border-white/40 bg-white text-[#0a0a0a] shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
      >
        {/* Moving light */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glow }}
        />

        {/* Soft noise wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative flex h-full flex-col p-6 md:p-7" style={{ transform: "translateZ(30px)" }}>
          <div className="flex items-start justify-between gap-3">
            <span className="text-[11px] font-medium tracking-[0.2em] text-black/35">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-black/50">
              {item.year}
            </span>
          </div>

          {/* Fake product preview surface */}
          <div className="relative mt-5 overflow-hidden rounded-2xl bg-gradient-to-br from-[#111] via-[#1a1a1a] to-[#0c0c0c] p-4 shadow-inner">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />
            <p className="text-[9px] uppercase tracking-[0.16em] text-white/35">
              {item.category.split("·")[0]?.trim()}
            </p>
            <p className="mt-2 font-display text-lg font-semibold tracking-[-0.03em] text-white md:text-xl">
              {item.metric}
            </p>
            <div className="mt-4 space-y-1.5">
              <div className="h-1.5 w-[78%] rounded-full bg-white/15 transition-all duration-500 group-hover:w-[92%] group-hover:bg-white/35" />
              <div className="h-1.5 w-[52%] rounded-full bg-white/10 transition-all duration-500 delay-75 group-hover:w-[70%] group-hover:bg-white/25" />
              <div className="h-1.5 w-[64%] rounded-full bg-white/8 transition-all duration-500 delay-100 group-hover:w-[80%] group-hover:bg-white/20" />
            </div>
          </div>

          <h3 className="mt-5 font-display text-[1.55rem] font-bold tracking-[-0.04em] md:text-[1.75rem]">
            {item.title}
          </h3>
          <p className="mt-2 text-[13px] font-light leading-relaxed text-black/50">
            {item.summary}
          </p>

          <div className="mt-auto flex items-center justify-between pt-6">
            <span className="text-[12px] text-black/40">{item.category}</span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110">
              →
            </span>
          </div>
        </div>
      </motion.a>
    </motion.div>
  );
}

export function WorkSection() {
  return (
    <section id="work" className="scroll-mt-28 py-24 md:py-32">
      <Shell>
        <Reveal>
          <div className="mb-14 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel>Selected work</SectionLabel>
              <BigTitle>
                Things I’ve
                <br />
                <span className="font-serif italic font-normal tracking-[-0.02em] text-white/70">
                  shipped
                </span>
              </BigTitle>
            </div>
            <p className="readable max-w-sm md:pb-2">
              A slim cut of products, launches, and systems, craft over clutter.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
          {cases.map((item, i) => (
            <WorkCard key={item.slug} item={item} index={i} />
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-10 flex justify-center md:mt-12">
            <Link
              href="/cases"
              className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-text backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white hover:text-bg"
            >
              View all work
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </Reveal>
      </Shell>
    </section>
  );
}
