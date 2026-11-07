import type { Metadata } from "next";
import Image from "next/image";
import { cases, site, techStack } from "@/data/site";
import {
  BigTitle,
  MagneticButton,
  PageHero,
  Reveal,
  SectionLabel,
  Shell,
} from "@/components/ui/Primitives";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name}: product designer & developer helping people ship apps and websites end to end.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Product, quietly obsessive"
        description={site.pitch}
      />

      <section className="pb-16 md:pb-24">
        <Shell>
          <div className="apple-card grid items-center gap-10 p-8 md:grid-cols-12 md:gap-14 md:p-12">
            <Reveal className="md:col-span-5">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-[320px] overflow-hidden rounded-[1.75rem]">
                <Image
                  src="/me/portrait.jpg"
                  alt={site.name}
                  fill
                  className="object-cover object-[center_12%]"
                  sizes="320px"
                />
              </div>
            </Reveal>
            <Reveal delay={0.08} className="md:col-span-7">
              <SectionLabel>Who I am</SectionLabel>
              <BigTitle>
                {site.shortName}
                <span className="block font-serif italic font-normal text-muted">
                  Dzhuran
                </span>
              </BigTitle>
              <div className="mt-6 space-y-5 text-[16px] leading-relaxed text-[#6e6e73]">
                <p>
                  Product designer & developer. I help people turn ideas into
                  polished apps and websites. Figma, engineering, TestFlight,
                  App Store, and the work after launch so users actually stay.
                </p>
                <p>
                  Right now that means Lifemaxxing (a location-anchored social
                  network: “the IMDb of your life”), Big Red Map (cinematic
                  travel map-as-profile), Anita (AI personal finance), and client
                  brands like Mitkovt Coaching.
                </p>
                <p>
                  The through-line is restraint: fewer elements, sharper
                  decisions, and interfaces that feel expensive without needing
                  to shout. If you need someone who will take care of your app or
                  website like it’s theirs, that’s the work.
                </p>
              </div>
              <div className="mt-8">
                <MagneticButton href="/contact">Work with me</MagneticButton>
              </div>
            </Reveal>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {cases.map((c) => (
              <Reveal key={c.slug}>
                <div className="apple-card h-full p-6 md:p-7">
                  <p className="text-[12px] font-semibold tracking-wide text-[#86868b] uppercase">
                    {c.category} · {c.year}
                  </p>
                  <h3 className="mt-2 text-[20px] font-semibold tracking-tight text-[#1d1d1f]">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-[14px] font-medium text-[#0071e3]">
                    {c.tagline}
                  </p>
                  <p className="mt-3 text-[14px] leading-relaxed text-[#6e6e73]">
                    {c.summary}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="apple-card mt-5 p-7 md:p-9">
            <SectionLabel>Stack</SectionLabel>
            <p className="mt-3 max-w-xl text-[15px] text-[#6e6e73]">
              Tools I use daily to go from idea to store without handing the
              baton mid-flight.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {techStack.map((t) => (
                <span
                  key={t.name}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#f5f5f7] px-3 py-2 text-[12px] font-semibold text-[#1d1d1f]"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: t.tone }}
                  />
                  {t.name}
                </span>
              ))}
            </div>
          </div>
        </Shell>
      </section>

      <section className="pb-28 md:pb-36">
        <Shell>
          <Reveal>
            <div className="apple-card px-8 py-14 text-center md:px-16 md:py-20">
              <SectionLabel align="center">Next</SectionLabel>
              <h2 className="soft-title mx-auto max-w-2xl text-[clamp(2rem,5vw,3.4rem)]">
                Building something worth
                <span className="font-serif italic font-normal text-muted">
                  {" "}
                  shipping?
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[15px] text-[#6e6e73]">
                Tell me about the product. I’ll tell you honestly whether I can
                make it land.
              </p>
              <div className="mt-8 flex justify-center">
                <MagneticButton href="/contact">Let’s talk</MagneticButton>
              </div>
            </div>
          </Reveal>
        </Shell>
      </section>
    </>
  );
}
