"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { ProductDraft as Draft } from "@/data/drafts";
import { productDrafts } from "@/data/drafts";
import { easeOut, springSoft } from "@/lib/motion";

function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ ...springSoft, delay }}
    >
      {children}
    </motion.div>
  );
}

export function ProductDraftView({ draft }: { draft: Draft }) {
  const reduce = useReducedMotion();
  const dark = draft.theme === "dark";
  const others = productDrafts.filter((d) => d.slug !== draft.slug);
  const line = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";

  return (
    <div
      className="min-h-screen"
      style={{ background: draft.surface, color: draft.ink }}
    >
      {/* Liquid glass back — functional chrome only */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-start px-4 pt-[max(0.85rem,env(safe-area-inset-top))] md:px-6 md:pt-5">
        <Link
          href="/#work"
          aria-label="Back to selected work"
          className="pressable liquid-glass pointer-events-auto flex size-11 items-center justify-center rounded-full text-[#1d1d1f] md:size-12"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden
          >
            <path
              d="M11.25 3.75 6 9l5.25 5.25"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      {/* Intro — compact */}
      <section className="shell pt-20 pb-8 md:pt-24 md:pb-10">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: easeOut }}
          className="text-[13px] font-medium"
          style={{ color: draft.muted }}
        >
          {draft.category} · {draft.year}
        </motion.p>
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.04, ease: easeOut }}
          className="mt-2 text-[clamp(2rem,4.5vw,2.75rem)] font-semibold tracking-[-0.04em]"
        >
          {draft.title}
        </motion.h1>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: easeOut }}
          className="mt-2 max-w-xl text-[18px] font-medium tracking-[-0.02em]"
        >
          {draft.headline}
        </motion.p>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12, ease: easeOut }}
          className="mt-3 max-w-lg text-[15px] leading-relaxed"
          style={{ color: draft.muted }}
        >
          {draft.support}
        </motion.p>
      </section>

      {/* Screenshots — primary content */}
      <section className="shell pb-10 md:pb-14">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {draft.gallery.map((src, i) => (
            <FadeIn key={src} delay={Math.min(i, 5) * 0.04}>
              <div
                className="relative aspect-[9/16] overflow-hidden rounded-[18px] sm:rounded-[22px]"
                style={{
                  background: dark ? "#111" : "#e8e8ed",
                  boxShadow: dark
                    ? "0 8px 28px rgba(0,0,0,0.4)"
                    : "0 8px 24px rgba(0,0,0,0.06)",
                }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover object-top"
                  sizes="(max-width:640px) 50vw, 33vw"
                  priority={i < 3}
                />
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Short feature lines */}
      {draft.features.length > 0 ? (
        <section className="shell border-t py-10 md:py-12" style={{ borderColor: line }}>
          <div className="grid gap-6 sm:grid-cols-2">
            {draft.features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.04}>
                <h3 className="text-[16px] font-semibold tracking-[-0.02em]">
                  {f.title}
                </h3>
                <p
                  className="mt-1.5 text-[14px] leading-relaxed"
                  style={{ color: draft.muted }}
                >
                  {f.copy}
                </p>
              </FadeIn>
            ))}
          </div>
        </section>
      ) : null}

      {/* Chapters — text + shot, compact */}
      {draft.chapters.some((c) => c.image) ? (
        <section className="shell space-y-10 border-t py-10 md:space-y-12 md:py-14" style={{ borderColor: line }}>
          {draft.chapters
            .filter((c) => c.image)
            .map((ch, i) => (
              <FadeIn key={ch.title} delay={0.02}>
                <div
                  className={`grid items-center gap-5 sm:grid-cols-[1fr_0.85fr] sm:gap-8 ${
                    i % 2 === 1 ? "sm:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div>
                    <p
                      className="text-[12px] font-semibold uppercase tracking-[0.12em]"
                      style={{ color: draft.muted }}
                    >
                      {ch.kicker}
                    </p>
                    <h3 className="mt-1.5 text-[clamp(1.35rem,2.5vw,1.75rem)] font-semibold tracking-[-0.03em]">
                      {ch.title}
                    </h3>
                    <p
                      className="mt-2 max-w-md text-[14px] leading-relaxed"
                      style={{ color: draft.muted }}
                    >
                      {ch.copy}
                    </p>
                  </div>
                  <div
                    className="relative mx-auto aspect-[9/16] w-full max-w-[220px] overflow-hidden rounded-[20px] sm:max-w-[240px]"
                    style={{
                      background: dark ? "#111" : "#e8e8ed",
                      boxShadow: dark
                        ? "0 12px 32px rgba(0,0,0,0.45)"
                        : "0 10px 28px rgba(0,0,0,0.08)",
                    }}
                  >
                    <Image
                      src={ch.image!}
                      alt=""
                      fill
                      className="object-cover object-top"
                      sizes="240px"
                    />
                  </div>
                </div>
              </FadeIn>
            ))}
        </section>
      ) : null}

      {/* CTA */}
      <section className="shell border-t py-12 md:py-16" style={{ borderColor: line }}>
        <FadeIn>
          <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-[-0.035em]">
            Want something this clear?
          </h2>
          <p className="mt-2 max-w-md text-[15px]" style={{ color: draft.muted }}>
            I design and build the loop — from first screen to a calm launch.
          </p>
          <Link
            href="/contact"
            className="pressable mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold !text-white"
            style={{ background: dark ? "#0a84ff" : "#1d1d1f" }}
          >
            Start a conversation
            <span aria-hidden>→</span>
          </Link>
        </FadeIn>
      </section>

      {/* More */}
      <section className="shell pb-20 md:pb-28">
        <p
          className="text-[12px] font-semibold uppercase tracking-[0.12em]"
          style={{ color: draft.muted }}
        >
          More work
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {others.map((d) => (
            <Link
              key={d.slug}
              href={`/drafts/${d.slug}`}
              className="pressable group overflow-hidden rounded-[20px]"
              style={{
                background: dark ? "rgba(255,255,255,0.04)" : "#fff",
                border: `1px solid ${line}`,
              }}
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={d.heroImage}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              </div>
              <div className="px-3.5 py-3">
                <p className="text-[14px] font-semibold tracking-[-0.02em]">
                  {d.title}
                </p>
                <p
                  className="mt-0.5 truncate text-[12px]"
                  style={{ color: draft.muted }}
                >
                  {d.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
