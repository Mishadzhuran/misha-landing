"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cases, featuredCases } from "@/data/site";
import { Shell } from "@/components/ui/Primitives";

import { easeOut, springUi } from "@/lib/motion";

const ease = easeOut;
type CaseItem = (typeof cases)[number];

function CaseRow({
  item,
  index,
  onOpen,
}: {
  item: CaseItem;
  index: number;
  onOpen: (c: CaseItem) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.4"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [56, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const flip = index % 2 === 1;

  return (
    <motion.article
      ref={ref}
      style={{ y, opacity }}
      className="overflow-hidden rounded-[32px] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]"
    >
      <div
        className={`grid lg:grid-cols-2 ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}
      >
        <button
          type="button"
          onClick={() => onOpen(item)}
          className="relative min-h-[260px] overflow-hidden bg-[#f5f5f7] text-left sm:min-h-[300px] lg:min-h-[380px]"
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition duration-700 hover:scale-[1.03]"
            sizes="(max-width:1024px) 100vw, 50vw"
          />
        </button>
        <div className="flex flex-col justify-center px-5 py-8 sm:px-8 sm:py-12 md:px-12">
          <p className="text-[12px] font-semibold tracking-[0.14em] text-[#86868b] uppercase">
            {item.category}
          </p>
          <h3 className="mt-3 text-[24px] font-semibold tracking-[-0.03em] text-[#1d1d1f] sm:text-[28px] md:text-[34px]">
            {item.title}
          </h3>
          <p className="mt-2 text-[15px] font-medium text-[#0071e3]">
            {item.tagline}
          </p>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[#6e6e73]">
            {item.summary}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            <Link
              href={`/drafts/${item.slug}`}
              className="pressable inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#1d1d1f] px-5 py-3 text-[14px] font-semibold !text-white shadow-[0_8px_24px_rgba(0,0,0,0.16)] transition-[background-color,box-shadow] duration-200 hover:bg-black hover:shadow-[0_12px_28px_rgba(0,0,0,0.2)]"
            >
              View details
              <span aria-hidden className="text-white/70">
                →
              </span>
            </Link>
            <button
              type="button"
              onClick={() => onOpen(item)}
              className="pressable inline-flex min-h-[44px] items-center rounded-full bg-[#f5f5f7] px-4 py-3 text-[14px] font-semibold text-[#1d1d1f] ring-1 ring-black/[0.04] transition-colors duration-200 hover:bg-[#ebebed]"
            >
              Preview
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function WorkSection() {
  const [active, setActive] = useState<CaseItem | null>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: headRef,
    offset: ["start 0.9", "start 0.5"],
  });
  const headY = useTransform(scrollYProgress, [0, 1], [32, 0]);
  const headOp = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <section id="work" className="scroll-mt-28 py-16 md:py-24">
      <Shell>
        <motion.div
          ref={headRef}
          style={{ y: headY, opacity: headOp }}
          className="mx-auto max-w-xl text-center"
        >
          <p className="text-[12px] font-semibold tracking-[0.16em] text-white/45 uppercase">
            Selected work
          </p>
          <h2 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.04em] text-white">
            Things I’ve shipped
          </h2>
        </motion.div>

        <div className="mt-12 space-y-8 md:mt-14 md:space-y-10">
          {featuredCases.map((item, i) => (
            <CaseRow
              key={item.slug}
              item={item}
              index={i}
              onOpen={setActive}
            />
          ))}
        </div>
      </Shell>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease }}
            onClick={() => setActive(null)}
          >
            <motion.div
              role="dialog"
              aria-modal
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={springUi}
              className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[28px] bg-white p-5 shadow-2xl sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] font-semibold tracking-wide text-[#86868b] uppercase">
                    {active.category}
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold tracking-tight text-[#1d1d1f]">
                    {active.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-[#6e6e73]">
                    {active.summary}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className="pressable min-h-[44px] shrink-0 rounded-full bg-black/5 px-4 py-2.5 text-[13px] font-semibold text-[#1d1d1f] hover:bg-black/10"
                >
                  Close
                </button>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {(active.gallery.length ? active.gallery : [active.image]).map(
                  (src) => (
                    <div
                      key={src}
                      className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#f5f5f7]"
                    >
                      <Image
                        src={src}
                        alt={`${active.title} screen`}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width:640px) 100vw, 50vw"
                      />
                    </div>
                  ),
                )}
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-black/[0.06] pt-6">
                <Link
                  href={`/drafts/${active.slug}`}
                  className="pressable inline-flex items-center gap-2 rounded-full bg-[#1d1d1f] px-5 py-3 text-[14px] font-semibold !text-white shadow-[0_10px_28px_rgba(0,0,0,0.18)] transition-[background-color] duration-200 hover:bg-black"
                >
                  View full details
                  <span aria-hidden className="text-white/70">
                    →
                  </span>
                </Link>
                <p className="text-[13px] text-[#86868b]">
                  Open the Apple-style product draft
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
