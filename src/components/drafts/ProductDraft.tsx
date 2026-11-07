"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { ProductDraft as Draft } from "@/data/drafts";
import { productDrafts } from "@/data/drafts";
import { easeOut, springSoft, springUi } from "@/lib/motion";

const cardShadow =
  "0 1px 1px rgba(0,0,0,0.02), 0 8px 24px rgba(0,0,0,0.04), 0 28px 56px rgba(0,0,0,0.05)";

function FadeIn({
  children,
  className = "",
  delay = 0,
  y = 18,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -48px 0px" }}
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

  return (
    <div
      className="min-h-screen"
      style={{
        background: draft.surface,
        color: draft.ink,
      }}
    >
      {/* Draft chrome */}
      <div
        className="sticky top-0 z-40 border-b backdrop-blur-xl"
        style={{
          borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
          background: dark
            ? "rgba(0,0,0,0.72)"
            : "rgba(245,245,247,0.78)",
        }}
      >
        <div className="shell flex h-12 items-center justify-between gap-4 text-[13px]">
          <div className="flex items-center gap-3">
            <Link
              href="/drafts"
              className="pressable font-medium opacity-70 transition hover:opacity-100"
            >
              ← Drafts
            </Link>
            <span
              className="hidden h-3 w-px sm:block"
              style={{ background: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)" }}
            />
            <p className="hidden font-semibold tracking-[-0.02em] sm:block">
              {draft.title}
            </p>
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
              style={{
                background: draft.accentSoft,
                color: dark ? "#fff" : draft.accent,
              }}
            >
              Draft
            </span>
          </div>
          <Link
            href="/contact"
            className="pressable rounded-full px-3.5 py-1.5 text-[12px] font-semibold"
            style={{
              background: dark ? "#fff" : "#1d1d1f",
              color: dark ? "#000" : "#fff",
            }}
          >
            Start a project
          </Link>
        </div>
      </div>

      {/* Hero, brand first, full-bleed media */}
      <section className="relative overflow-hidden">
        <div className="relative min-h-[78vh] md:min-h-[88vh]">
          <Image
            src={draft.heroImage}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background: dark
                ? "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.92) 100%)"
                : "linear-gradient(180deg, rgba(245,245,247,0.15) 0%, rgba(245,245,247,0.35) 40%, rgba(245,245,247,0.96) 100%)",
            }}
          />

          <div className="shell relative flex min-h-[78vh] flex-col justify-end pb-14 pt-28 md:min-h-[88vh] md:pb-20">
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: easeOut }}
              className="text-[13px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: dark ? "rgba(255,255,255,0.65)" : draft.muted }}
            >
              {draft.category} · {draft.year}
            </motion.p>
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.04, ease: easeOut }}
              className="mt-4 max-w-4xl text-[clamp(2.8rem,9vw,5.6rem)] font-semibold leading-[0.95] tracking-[-0.05em]"
            >
              {draft.title}
            </motion.h1>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}
              className="mt-5 max-w-xl text-[clamp(1.25rem,2.4vw,1.65rem)] font-medium leading-snug tracking-[-0.03em]"
              style={{ color: dark ? "rgba(255,255,255,0.88)" : draft.ink }}
            >
              {draft.headline}
            </motion.p>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16, ease: easeOut }}
              className="mt-4 max-w-lg text-[17px] leading-relaxed tracking-[-0.015em]"
              style={{ color: draft.muted }}
            >
              {draft.support}
            </motion.p>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.22, ease: easeOut }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a
                href="#features"
                className="pressable inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] font-semibold"
                style={{
                  background: dark ? "#fff" : "#1d1d1f",
                  color: dark ? "#000" : "#fff",
                }}
              >
                {draft.cta}
              </a>
              <p
                className="text-[13px] font-medium"
                style={{ color: draft.muted }}
              >
                {draft.tagline}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="shell py-10 md:py-14">
        <div
          className="grid grid-cols-3 gap-3 rounded-[28px] p-2 md:gap-4 md:rounded-[32px] md:p-3"
          style={{
            background: dark ? "rgba(255,255,255,0.04)" : "#fff",
            boxShadow: dark ? "none" : cardShadow,
            border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.04)",
          }}
        >
          {draft.stats.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.05} className="rounded-[22px] px-4 py-5 text-center md:px-6 md:py-7">
              <p
                className="text-[28px] font-semibold tracking-[-0.04em] md:text-[34px]"
                style={{ color: dark ? "#fff" : draft.ink }}
              >
                {s.value}
              </p>
              <p
                className="mt-1.5 text-[12px] font-medium md:text-[13px]"
                style={{ color: draft.muted }}
              >
                {s.label}
              </p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="shell scroll-mt-24 py-8 md:py-16">
        <FadeIn>
          <p
            className="text-[13px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: draft.muted }}
          >
            Designed in
          </p>
          <h2 className="mt-3 max-w-2xl text-[clamp(1.9rem,4vw,2.8rem)] font-semibold tracking-[-0.045em]">
            Clear pieces. One product feel.
          </h2>
        </FadeIn>
        <div className="mt-10 grid gap-4 md:grid-cols-2 md:gap-5">
          {draft.features.map((f, i) => (
            <FadeIn key={f.title} delay={0.04 + i * 0.05}>
              <motion.div
                whileHover={reduce ? undefined : { y: -3, transition: springUi }}
                className="h-full rounded-[28px] p-6 md:rounded-[32px] md:p-8"
                style={{
                  background: dark ? "rgba(255,255,255,0.04)" : "#fff",
                  boxShadow: dark ? "none" : cardShadow,
                  border: dark
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid rgba(0,0,0,0.04)",
                }}
              >
                <span
                  className="inline-block h-1.5 w-8 rounded-full"
                  style={{ background: draft.accent }}
                />
                <h3 className="mt-5 text-[22px] font-semibold tracking-[-0.03em]">
                  {f.title}
                </h3>
                <p
                  className="mt-2 text-[15px] leading-relaxed tracking-[-0.01em]"
                  style={{ color: draft.muted }}
                >
                  {f.copy}
                </p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Chapters */}
      <section className="py-10 md:py-20">
        <div className="shell space-y-16 md:space-y-28">
          {draft.chapters.map((ch, i) => {
            const flip = i % 2 === 1;
            return (
              <div
                key={ch.title}
                className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${
                  flip ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <FadeIn>
                  <p
                    className="text-[13px] font-semibold uppercase tracking-[0.12em]"
                    style={{ color: draft.muted }}
                  >
                    {ch.kicker}
                  </p>
                  <h3 className="mt-3 text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold tracking-[-0.04em]">
                    {ch.title}
                  </h3>
                  <p
                    className="mt-4 max-w-md text-[17px] leading-relaxed tracking-[-0.015em]"
                    style={{ color: draft.muted }}
                  >
                    {ch.copy}
                  </p>
                </FadeIn>
                <FadeIn delay={0.08}>
                  {ch.image ? (
                    <div
                      className="relative aspect-[4/5] overflow-hidden rounded-[28px] md:rounded-[36px]"
                      style={{
                        boxShadow: dark
                          ? "0 24px 64px rgba(0,0,0,0.45)"
                          : cardShadow,
                        background: dark ? "#111" : "#e8e8ed",
                      }}
                    >
                      <Image
                        src={ch.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width:768px) 100vw, 50vw"
                      />
                    </div>
                  ) : (
                    <div
                      className="flex aspect-[4/5] items-end rounded-[28px] p-8 md:rounded-[36px]"
                      style={{
                        background: `linear-gradient(160deg, ${draft.accentSoft}, ${
                          dark ? "#111" : "#fff"
                        })`,
                        border: dark
                          ? "1px solid rgba(255,255,255,0.08)"
                          : "1px solid rgba(0,0,0,0.04)",
                      }}
                    >
                      <p className="text-[28px] font-semibold tracking-[-0.04em]">
                        {draft.title}
                      </p>
                    </div>
                  )}
                </FadeIn>
              </div>
            );
          })}
        </div>
      </section>

      {/* Gallery strip */}
      {draft.gallery.length > 1 ? (
        <section className="overflow-x-auto pb-6 pt-4 md:pb-10">
          <div className="flex w-max gap-4 px-[max(1rem,calc((100vw-1120px)/2+1rem))]">
            {draft.gallery.map((src, i) => (
              <FadeIn key={src} delay={i * 0.04}>
                <div
                  className="relative h-[280px] w-[220px] overflow-hidden rounded-[24px] md:h-[360px] md:w-[280px] md:rounded-[28px]"
                  style={{
                    boxShadow: dark ? "0 16px 40px rgba(0,0,0,0.4)" : cardShadow,
                    background: dark ? "#111" : "#e8e8ed",
                  }}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="280px"
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="shell py-16 md:py-24">
        <FadeIn>
          <div
            className="relative overflow-hidden rounded-[32px] px-7 py-12 text-center md:rounded-[40px] md:px-12 md:py-16"
            style={{
              background: dark ? "rgba(255,255,255,0.05)" : "#1d1d1f",
              color: "#fff",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full blur-3xl"
              style={{ background: draft.accent, opacity: 0.28 }}
            />
            <p className="relative text-[13px] font-semibold uppercase tracking-[0.12em] text-white/55">
              Next
            </p>
            <h2 className="relative mx-auto mt-3 max-w-xl text-[clamp(1.8rem,4vw,2.6rem)] font-semibold tracking-[-0.04em] !text-white">
              Want a product page that feels this clear?
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-white/65">
              I design and build the whole loop, from first frame to a calm launch.
            </p>
            <Link
              href="/contact"
              className="pressable relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[14px] font-semibold text-[#1d1d1f]"
            >
              Start a conversation
              <span aria-hidden>→</span>
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* Other drafts */}
      <section className="shell pb-24 md:pb-32">
        <p
          className="text-[13px] font-semibold uppercase tracking-[0.12em]"
          style={{ color: draft.muted }}
        >
          More drafts
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {others.map((d) => (
            <Link
              key={d.slug}
              href={`/drafts/${d.slug}`}
              className="pressable group overflow-hidden rounded-[24px]"
              style={{
                background: dark ? "rgba(255,255,255,0.04)" : "#fff",
                border: dark
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(0,0,0,0.04)",
                boxShadow: dark ? "none" : cardShadow,
              }}
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={d.heroImage}
                  alt=""
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="320px"
                />
              </div>
              <div className="px-4 py-3.5">
                <p className="text-[15px] font-semibold tracking-[-0.02em]">
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
