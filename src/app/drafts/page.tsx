"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { productDrafts } from "@/data/drafts";
import { Shell } from "@/components/ui/Shell";
import { easeOut, springSoft, springUi } from "@/lib/motion";

export default function DraftsIndexPage() {
  const reduce = useReducedMotion();

  return (
    <section className="relative pb-24 pt-32 md:pb-32 md:pt-40">
      <Shell>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#86868b]">
            Product drafts
          </p>
          <h1 className="mt-3 text-[clamp(2.2rem,5vw,3.4rem)] font-semibold tracking-[-0.045em] text-[#1d1d1f]">
            Apple-light drafts for each product
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[17px] leading-relaxed tracking-[-0.015em] text-[#6e6e73]">
            Design explorations — calm hero, clear hierarchy, soft motion. Pick a product.
          </p>
        </motion.div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2">
          {productDrafts.map((d, i) => (
            <motion.div
              key={d.slug}
              initial={reduce ? false : { opacity: 0, y: 20, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ ...springSoft, delay: 0.06 + i * 0.06 }}
            >
              <motion.div whileHover={reduce ? undefined : { y: -4, transition: springUi }}>
                <Link
                  href={`/drafts/${d.slug}`}
                  className="group block overflow-hidden rounded-[28px] bg-white shadow-[0_1px_1px_rgba(0,0,0,0.02),0_12px_32px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.04] md:rounded-[32px]"
                >
                  <div
                    className="relative aspect-[16/11] overflow-hidden"
                    style={{ background: d.theme === "dark" ? "#111" : "#e8e8ed" }}
                  >
                    <Image
                      src={d.heroImage}
                      alt=""
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width:768px) 100vw, 50vw"
                      priority={i < 2}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-5 pb-4 pt-16">
                      <span
                        className="rounded-full px-2.5 py-1 text-[11px] font-semibold !text-white"
                        style={{ background: "rgba(255,255,255,0.18)" }}
                      >
                        Draft
                      </span>
                    </div>
                  </div>
                  <div className="px-5 py-5 md:px-6 md:py-6">
                    <div className="flex items-baseline justify-between gap-3">
                      <h2 className="text-[22px] font-semibold tracking-[-0.035em] text-[#1d1d1f]">
                        {d.title}
                      </h2>
                      <span className="text-[12px] tabular-nums text-[#86868b]">
                        {d.year}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[14px] leading-snug tracking-[-0.015em] text-[#6e6e73]">
                      {d.headline}
                    </p>
                    <p className="mt-4 text-[13px] font-semibold tracking-[-0.01em] text-[#0071e3]">
                      Open draft →
                    </p>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </Shell>
    </section>
  );
}
