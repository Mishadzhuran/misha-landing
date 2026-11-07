"use client";

import Link from "next/link";
import { cases, engagementModels, services, site, stats } from "@/data/site";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import {
  BigTitle,
  MagneticButton,
  Reveal,
  SectionLabel,
  Shell,
} from "@/components/ui/Primitives";

export function StatsStrip() {
  return (
    <section className="py-10 md:py-14">
      <Shell>
        <div className="grid grid-cols-2 gap-px overflow-hidden border border-line bg-line md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.05}
              className="bg-bg px-5 py-8 text-center md:px-6 md:py-10"
            >
              <p className="soft-title text-4xl text-red md:text-5xl">{s.value}</p>
              <p className="mt-3 text-[13px] font-medium leading-snug text-muted">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </Shell>
    </section>
  );
}

/** Conversion block: commercial path + objection FAQ (replaces generic how-it-works cards) */
export function ConversionSection() {
  return (
    <section className="py-20 md:py-28">
      <Shell>
        <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 xl:gap-20">
          <div>
            <Reveal>
              <SectionLabel>Before you book</SectionLabel>
              <BigTitle>
                Clear path.
                <br />
                Clear <span className="text-red">commercials.</span>
              </BigTitle>
              <p className="readable mt-6 max-w-md">
                Agency buyers stall on price, IP, and risk, not on pretty process diagrams.
                Pick a path, get answers, then book a scope call.
              </p>
            </Reveal>

            <div className="mt-10 space-y-0 border-t border-line">
              {engagementModels.map((model, i) => (
                <Reveal key={model.id} delay={i * 0.06}>
                  <article className="group border-b border-line py-7">
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="font-mono text-[11px] font-medium tracking-wider text-red">
                        {model.id}
                      </p>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-soft">
                        {model.timeline} · {model.priceHint}
                      </p>
                    </div>
                    <h3 className="soft-title mt-3 text-2xl transition-colors duration-300 group-hover:text-red md:text-[1.75rem]">
                      {model.title}
                    </h3>
                    <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
                      {model.copy}
                    </p>
                    <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-text/70">
                      Outcome → {model.outcome}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.15} className="mt-8">
              <MagneticButton href="/contact">Book a scope call</MagneticButton>
              <p className="mt-4 text-[13px] text-muted-soft">
                Reply in {site.responseTime}. No charge until a signed agreement.
              </p>
            </Reveal>
          </div>

          <div>
            <Reveal>
              <SectionLabel>Decision FAQ</SectionLabel>
              <h3 className="soft-title text-[clamp(1.8rem,4vw,2.8rem)]">
                What founders ask
                <br />
                before they <span className="text-red">pay</span>
              </h3>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
                Straight answers on cost, timeline, IP, store risk, and refunds, the
                questions that usually kill agency deals off-page.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="mt-8">
              <FaqAccordion />
            </Reveal>
          </div>
        </div>
      </Shell>
    </section>
  );
}

export function ServicesPreview() {
  return (
    <section className="py-20 md:py-28">
      <Shell>
        <div className="mb-12 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <SectionLabel>What we do</SectionLabel>
            <BigTitle>
              Apps, landings,
              <br />
              <span className="text-red">stores & support</span>
            </BigTitle>
          </div>
          <p className="readable max-w-sm md:pb-2">
            Clear offers. Clear outcomes. From first build to successful life in the market.
          </p>
        </div>

        <div className="border-t border-line">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={i * 0.04}>
              <Link
                href="/services"
                className="group flex flex-col gap-3 border-b border-line py-7 transition-colors md:flex-row md:items-baseline md:justify-between md:gap-10 md:py-8"
              >
                <div className="flex items-baseline gap-5 md:gap-8">
                  <span className="font-mono text-xs font-medium text-red">{service.id}</span>
                  <h3 className="soft-title text-[1.65rem] transition-colors duration-300 group-hover:text-red md:text-3xl">
                    {service.title}
                  </h3>
                </div>
                <p className="max-w-md pl-10 text-[15px] leading-relaxed text-muted md:pl-0 md:text-right">
                  {service.copy}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Shell>
    </section>
  );
}

export function CasesPreview() {
  return (
    <section className="py-20 md:py-28">
      <Shell>
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-14 md:flex-row md:items-end">
          <div>
            <SectionLabel>Selected work</SectionLabel>
            <BigTitle>
              Products we
              <br />
              <span className="text-red">took to market</span>
            </BigTitle>
          </div>
          <MagneticButton href="/cases" variant="outline">
            All cases
          </MagneticButton>
        </div>

        <div className="border-t border-line">
          {cases.slice(0, 4).map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.05}>
              <Link
                href={`/cases#${c.slug}`}
                className="group relative flex flex-col gap-5 border-b border-line py-8 transition-colors md:flex-row md:items-center md:justify-between md:gap-10 md:py-9"
              >
                <div className="max-w-2xl">
                  <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-muted-soft">
                    {c.category} · {c.year}
                  </p>
                  <h3 className="soft-title mt-3 text-3xl transition-colors duration-300 group-hover:text-red md:text-4xl">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted md:text-base">
                    {c.summary}
                  </p>
                </div>
                <div className="md:min-w-[200px] md:text-right">
                  <p className="soft-title text-3xl text-red md:text-4xl">{c.metric}</p>
                  <p className="mt-2 text-[13px] leading-snug text-muted">{c.result}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Shell>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="py-20 md:py-28">
      <Shell>
        <div className="border border-line px-8 py-16 text-center md:px-16 md:py-20">
          <SectionLabel align="center">Next move</SectionLabel>
          <h2 className="soft-title mx-auto max-w-3xl text-[clamp(2.4rem,6.5vw,4.8rem)]">
            Ready to ship
            <br />
            <span className="text-red">your app?</span>
          </h2>
          <p className="readable mx-auto mt-6 max-w-lg">
            Book a scope call. We map build, landings, store release, and support, with
            commercials you can sign.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <MagneticButton href="/contact">Book a scope call</MagneticButton>
            <MagneticButton href="/services" variant="outline">
              See services
            </MagneticButton>
          </div>
          <p className="mt-6 text-[13px] text-muted-soft">
            {site.email} · Response in {site.responseTime}
          </p>
        </div>
      </Shell>
    </section>
  );
}
