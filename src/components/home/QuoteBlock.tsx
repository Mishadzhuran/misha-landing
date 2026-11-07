"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Shell } from "@/components/ui/Primitives";
import { site } from "@/data/site";

const ease = [0.16, 1, 0.3, 1] as const;

export function QuoteBlock() {
  return (
    <section className="py-10 md:py-16">
      <Shell>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease }}
          className="apple-card overflow-hidden"
        >
          <div className="grid lg:grid-cols-12">
            <div className="relative min-h-[280px] lg:col-span-4 lg:min-h-[380px]">
              <Image
                src="/me/portrait.jpg"
                alt={site.name}
                fill
                sizes="(max-width:1024px) 100vw, 33vw"
                className="object-cover object-[center_12%]"
              />
            </div>
            <div className="flex flex-col justify-center px-8 py-10 md:px-12 lg:col-span-8 lg:py-14">
              <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-muted-soft">
                How I work
              </p>
              <blockquote className="mt-5 font-serif text-[clamp(1.5rem,3vw,2.2rem)] italic leading-[1.3] tracking-[-0.02em] text-text">
                “{site.quote}”
              </blockquote>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#6e6e73]">
                That mindset shows up in Lifemaxxing, Big Red Map, Anita, and
                every client launch, polish without noise, and a release process
                that doesn’t leave you guessing on launch day.
              </p>
              <div className="mt-8">
                <p className="font-display text-base font-bold tracking-[-0.02em]">
                  {site.name}
                </p>
                <p className="text-[13px] text-muted">{site.role}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </Shell>
    </section>
  );
}
