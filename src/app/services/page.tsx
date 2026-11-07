import type { Metadata } from "next";
import { engagementModels, services } from "@/data/site";
import {
  BigTitle,
  MagneticButton,
  PageHero,
  Reveal,
  SectionLabel,
  Shell,
} from "@/components/ui/Primitives";

export const metadata: Metadata = {
  title: "Services",
  description:
    "App development, landing pages, App Store & Google Play support, market release, and ongoing product support.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="From build to live market"
        description="Appigon develops the product, crafts the landings, ships to App Store & Google Play, and stays on for successful post-launch work."
      />

      <section className="pb-16 md:pb-24">
        <Shell>
          <div className="border-t border-line">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.04}>
                <article className="grid gap-3 border-b border-line py-8 md:grid-cols-[80px_1fr_1.1fr] md:items-baseline md:gap-8 md:py-10">
                  <p className="font-mono text-xs font-medium text-red">{s.id}</p>
                  <h2 className="soft-title text-3xl md:text-4xl">{s.title}</h2>
                  <p className="text-[15px] leading-relaxed text-muted md:text-base">
                    {s.copy}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </Shell>
      </section>

      <section className="pb-24 md:pb-32">
        <Shell>
          <div className="border border-line px-7 py-12 md:px-12 md:py-16">
            <div className="mb-12 max-w-2xl">
              <SectionLabel>How we engage</SectionLabel>
              <BigTitle>
                Commercial paths
                <br />
                built to <span className="text-red">close</span>
              </BigTitle>
              <p className="readable mt-5 max-w-lg">
                Pick a path with clear commercials, not a vague &quot;let&apos;s figure it
                out.&quot; Every engagement ends in a written agreement before invoices land.
              </p>
            </div>
            <div className="space-y-0 border-t border-line">
              {engagementModels.map((model) => (
                <div
                  key={model.id}
                  className="grid gap-3 border-b border-line py-8 md:grid-cols-[80px_1fr_180px] md:items-start md:gap-8"
                >
                  <p className="font-mono text-xs font-medium text-red">{model.id}</p>
                  <div>
                    <h3 className="soft-title text-2xl md:text-3xl">{model.title}</h3>
                    <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
                      {model.copy}
                    </p>
                    <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-text/70">
                      Outcome → {model.outcome}
                    </p>
                  </div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted-soft md:text-right">
                    {model.timeline}
                    <br />
                    {model.priceHint}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-12">
              <MagneticButton href="/contact">Book a scope call</MagneticButton>
            </div>
          </div>
        </Shell>
      </section>
    </>
  );
}
