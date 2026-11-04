"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { cases, site } from "@/data/site";
import { Shell } from "@/components/ui/Primitives";
import { easeOut, springSoft, springSnap, springUi } from "@/lib/motion";

const cardShadow =
  "0 1px 1px rgba(0,0,0,0.02), 0 8px 24px rgba(0,0,0,0.04), 0 24px 48px rgba(0,0,0,0.04)";
const cardShadowHover =
  "0 1px 1px rgba(0,0,0,0.03), 0 12px 32px rgba(0,0,0,0.06), 0 32px 64px rgba(0,0,0,0.06)";

function CardShell({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -40px 0px" }}
      transition={{ ...springSoft, delay }}
      whileHover={
        reduce
          ? undefined
          : {
              y: -3,
              boxShadow: cardShadowHover,
              transition: springUi,
            }
      }
      className={`flex h-full flex-col rounded-[28px] bg-white p-6 ring-1 ring-black/[0.04] md:rounded-[32px] md:p-7 ${className}`}
      style={{ boxShadow: cardShadow }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[13px] font-medium tracking-[-0.01em] text-[#86868b]">
      {children}
    </p>
  );
}

function CardTitle({ children }: { children: ReactNode }) {
  return (
    <p className="text-[22px] font-semibold leading-tight tracking-[-0.035em] text-[#1d1d1f] md:text-[24px]">
      {children}
    </p>
  );
}

function PulseCard() {
  const rows = [
    {
      label: "Discovery call",
      meta: "Booked",
      tone: "text-[#0071e3] bg-[#0071e3]/[0.08]",
    },
    {
      label: "Written scope",
      meta: "Signed",
      tone: "text-[#1f8a3b] bg-[#34c759]/[0.12]",
    },
    {
      label: "First TestFlight",
      meta: "Week 2–3",
      tone: "text-[#1d1d1f] bg-black/[0.04]",
    },
  ];

  return (
    <CardShell delay={0.04} className="md:min-h-[292px]">
      <SectionLabel>First seven days</SectionLabel>
      <CardTitle>Week one</CardTitle>
      <ul className="mt-auto pt-5">
        {rows.map((r, i) => (
          <motion.li
            key={r.label}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 + i * 0.07, duration: 0.4, ease: easeOut }}
            className={`relative flex items-center justify-between gap-3 py-3.5 ${
              i < rows.length - 1 ? "border-b border-black/[0.05]" : ""
            }`}
          >
            {i < rows.length - 1 ? (
              <span
                aria-hidden
                className="absolute left-[7px] top-[calc(50%+12px)] h-[calc(100%-10px)] w-px bg-[#1d1d1f]/15"
              />
            ) : null}
            <div className="flex min-w-0 items-center gap-3">
              <span className="relative z-[1] flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-white ring-[2.5px] ring-[#1d1d1f]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1d1d1f]" />
              </span>
              <p className="truncate text-[15px] font-medium tracking-[-0.015em] text-[#1d1d1f]">
                {r.label}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[-0.01em] ${r.tone}`}
            >
              {r.meta}
            </span>
          </motion.li>
        ))}
      </ul>
    </CardShell>
  );
}

function UsersCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const count = useMotionValue(0);
  const spring = useSpring(count, { stiffness: 60, damping: 20, mass: 0.8 });
  const display = useTransform(spring, (v) =>
    `${Math.round(v).toLocaleString("en-US")}+`,
  );

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      count.set(5000);
      return;
    }
    const controls = animate(count, 5000, {
      duration: 1.55,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.12,
    });
    return controls.stop;
  }, [inView, count, reduce]);

  const bars = [28, 36, 32, 48, 44, 58, 52, 70, 64, 82, 76, 94];

  return (
    <CardShell delay={0.08} className="relative overflow-hidden md:min-h-[292px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#34c759]/[0.14] blur-3xl"
      />
      <div ref={ref} className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <SectionLabel>Live users</SectionLabel>
            <motion.p className="mt-1 text-[40px] font-semibold leading-none tracking-[-0.045em] text-[#1d1d1f] md:text-[44px]">
              {display}
            </motion.p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#34c759]/[0.12]">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M3 11.5L6.2 8.1l2.3 2.2L13 5"
                stroke="#1f8a3b"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 5h3v3"
                stroke="#1f8a3b"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="relative mt-auto flex h-[72px] items-end gap-[5px] pt-8">
          {bars.map((h, i) => (
            <motion.span
              key={i}
              className="origin-bottom flex-1 rounded-[5px] bg-gradient-to-t from-[#34c759]/35 to-[#30d158]"
              initial={reduce ? false : { height: 0, opacity: 0.4 }}
              whileInView={{ height: `${h}%`, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.18 + i * 0.035,
                duration: 0.55,
                ease: easeOut,
              }}
            />
          ))}
        </div>
        <p className="relative mt-4 text-[13px] font-medium tracking-[-0.01em] text-[#1f8a3b]">
          Growing every launch
        </p>
      </div>
    </CardShell>
  );
}

function ReleaseCard() {
  const items = ["Privacy labels", "Screenshots", "Review notes"];

  return (
    <CardShell delay={0.12} className="relative overflow-hidden md:min-h-[292px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-14 -top-16 h-48 w-48 rounded-full bg-[#0071e3]/[0.1] blur-3xl"
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <SectionLabel>Submission</SectionLabel>
          <CardTitle>App Store</CardTitle>
        </div>
        <span className="rounded-full bg-[#0071e3] px-3 py-1.5 text-[12px] font-semibold tracking-[-0.01em] !text-white shadow-[0_6px_16px_rgba(0,113,227,0.28)]">
          Ready
        </span>
      </div>

      <div className="relative mt-5 space-y-1">
        {items.map((t, i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.14 + i * 0.06, duration: 0.35, ease: easeOut }}
            className="flex items-center justify-between gap-3 rounded-[14px] px-1 py-2.5"
          >
            <p className="text-[15px] font-medium tracking-[-0.015em] text-[#1d1d1f]">
              {t}
            </p>
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                ...springSnap,
                delay: 0.28 + i * 0.08,
              }}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-[#34c759]"
              aria-hidden
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M2 5.2L4.1 7.2L8 2.8"
                  stroke="white"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.span>
          </motion.div>
        ))}
      </div>

      <div className="relative mt-auto flex items-center gap-3 rounded-[18px] bg-[#f5f5f7] p-3.5 pt-4">
        <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white shadow-sm">
          <Image
            src="/me/portrait.jpg"
            alt=""
            fill
            className="object-cover object-[center_18%]"
            sizes="40px"
          />
        </div>
        <div className="min-w-0">
          <p className="text-[14px] font-semibold tracking-[-0.015em] text-[#1d1d1f]">
            Reply in {site.responseTime}
          </p>
          <p className="text-[12px] text-[#86868b]">Launch without panic</p>
        </div>
      </div>
    </CardShell>
  );
}

function NumbersCard() {
  const items = [
    { value: "120+", label: "Shipped" },
    { value: "38", label: "Markets" },
    { value: "4.9", label: "Score" },
    { value: "1 day", label: "Reply" },
  ];

  return (
    <CardShell delay={0.06} className="md:min-h-[280px]">
      <SectionLabel>Proof</SectionLabel>
      <CardTitle>Track record</CardTitle>
      <div className="mt-auto grid grid-cols-2 gap-2.5 pt-6">
        {items.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.4, ease: easeOut }}
            className="rounded-[18px] bg-[#f5f5f7] px-3.5 py-4"
          >
            <p className="text-[28px] font-semibold leading-none tracking-[-0.045em] text-[#1d1d1f]">
              {s.value}
            </p>
            <p className="mt-2 text-[12px] font-medium text-[#6e6e73]">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </CardShell>
  );
}

function WorkCard() {
  return (
    <CardShell delay={0.1} className="md:min-h-[280px]">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <SectionLabel>Portfolio</SectionLabel>
          <CardTitle>Recent ships</CardTitle>
        </div>
        <Link
          href="/drafts"
          className="pressable text-[13px] font-semibold tracking-[-0.01em] text-[#0071e3]"
        >
          See all
        </Link>
      </div>
      <ul className="mt-auto space-y-1.5 pt-5">
        {cases.slice(0, 4).map((c, i) => (
          <motion.li
            key={c.slug}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.35, ease: easeOut }}
          >
            <Link
              href={`/drafts/${c.slug}`}
              className="group flex items-center gap-3 rounded-[16px] px-1.5 py-2 transition-colors duration-200 hover:bg-[#f5f5f7]"
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] text-[13px] font-semibold tracking-[-0.02em] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]"
                style={{
                  backgroundColor: c.color,
                  color: c.color === "#9fe870" ? "#1d1d1f" : "#fff",
                }}
              >
                {c.title.slice(0, 1)}
              </span>
              <p className="min-w-0 flex-1 truncate text-[14px] font-semibold tracking-[-0.015em] text-[#1d1d1f]">
                {c.title}
              </p>
              <span className="relative flex h-4 w-12 shrink-0 items-center justify-end">
                <span className="absolute text-[12px] tabular-nums text-[#86868b] transition-opacity duration-200 group-hover:opacity-0">
                  {c.year}
                </span>
                <span className="absolute text-[12px] font-semibold text-[#0071e3] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  View →
                </span>
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </CardShell>
  );
}

function ClientsCard() {
  const points = [
    { k: "You approve", v: "Every milestone" },
    { k: "Updates", v: "Always open" },
    { k: "Scope", v: "Written first" },
    { k: "After", v: "Still here" },
  ];

  return (
    <CardShell
      delay={0.14}
      className="relative overflow-hidden md:min-h-[280px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-[#0071e3]/[0.08] blur-3xl"
      />
      <SectionLabel>How we work</SectionLabel>
      <CardTitle>Working together</CardTitle>
      <div className="relative mt-auto space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-2">
          {points.map((s, i) => (
            <motion.div
              key={s.k}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.12 + i * 0.05,
                duration: 0.35,
                ease: easeOut,
              }}
              className="rounded-[16px] bg-[#f5f5f7] px-3.5 py-3"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#86868b]">
                {s.k}
              </p>
              <p className="mt-1 text-[14px] font-semibold tracking-[-0.015em] text-[#1d1d1f]">
                {s.v}
              </p>
            </motion.div>
          ))}
        </div>
        <Link
          href="/contact"
          className="pressable relative flex items-center justify-between rounded-full bg-[#1d1d1f] px-5 py-3.5 shadow-[0_10px_28px_rgba(0,0,0,0.18)] transition-[background-color,box-shadow] duration-200 hover:bg-black hover:shadow-[0_14px_32px_rgba(0,0,0,0.22)]"
        >
          <span className="text-[14px] font-semibold tracking-[-0.015em] !text-white">
            Start a conversation
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[14px] !text-white">
            →
          </span>
        </Link>
      </div>
    </CardShell>
  );
}

export function ProductPopups() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-x-clip py-14 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-16 mx-auto h-[320px] max-w-4xl rounded-full bg-[radial-gradient(ellipse_at_center,rgba(52,199,89,0.09),transparent_70%)]"
      />
      <Shell className="relative">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-[13px] font-semibold tracking-[0.08em] text-[#86868b] uppercase">
            Outcomes
          </p>
          <h2 className="mt-3 text-[clamp(2rem,4.2vw,2.85rem)] font-semibold tracking-[-0.045em] text-[#1d1d1f]">
            What you get
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[17px] leading-relaxed tracking-[-0.015em] text-[#6e6e73]">
            Clear process, shipped products, and a partner who stays after launch.
          </p>
        </motion.div>

        <div className="relative mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          <PulseCard />
          <UsersCard />
          <ReleaseCard />
          <NumbersCard />
          <WorkCard />
          <ClientsCard />
        </div>
      </Shell>
    </section>
  );
}
