"use client";

import Image from "next/image";
import Link from "next/link";
import type { ProductDraft as Draft, ProductLink } from "@/data/drafts";
import { productDrafts } from "@/data/drafts";

function Pill({
  href,
  children,
  external,
  solid = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  solid?: boolean;
}) {
  const className = solid
    ? "pressable inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 font-body text-[14px] font-semibold !text-[#0a0a0a]"
    : "pressable inline-flex items-center justify-center rounded-full border border-white/25 bg-transparent px-5 py-2.5 font-body text-[14px] font-semibold !text-white";

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function linkText(link: ProductLink) {
  if (link.kind === "appstore") return "App Store";
  if (link.kind === "playstore") return "Google Play";
  return link.label;
}

export function ProductDraftView({ draft }: { draft: Draft }) {
  const others = productDrafts.filter((d) => d.slug !== draft.slug);
  const shots = draft.chapters.filter((c) => c.image);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-start px-4 pt-[max(0.85rem,env(safe-area-inset-top))] md:px-6 md:pt-5">
        <Link
          href="/#work"
          aria-label="Back to selected work"
          className="pressable pointer-events-auto flex size-11 items-center justify-center rounded-full border border-white/20 bg-[#0a0a0a] !text-white md:size-12"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
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

      <article className="shell pt-20 pb-20 md:pt-28 md:pb-28">
        <div className="max-w-2xl">
          <p className="font-body text-[13px] font-medium tracking-[-0.01em] text-white">
            {draft.category}, {draft.year}
          </p>

          <h1 className="mt-3 font-display text-[clamp(2.5rem,6.5vw,3.75rem)] font-semibold tracking-[-0.045em] text-white">
            {draft.title}
          </h1>

          <p className="mt-6 font-body text-[18px] leading-relaxed tracking-[-0.015em] text-white md:text-[19px]">
            {draft.support}
          </p>

          <p className="mt-4 font-body text-[16px] leading-relaxed text-white md:text-[17px]">
            {draft.overview}
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {draft.links.length > 0 ? (
              draft.links.map((link, i) => (
                <Pill
                  key={link.href + link.label}
                  href={link.href}
                  external
                  solid={i === 0}
                >
                  {linkText(link)}
                </Pill>
              ))
            ) : (
              <Pill href="/contact" solid>
                Talk about a build
              </Pill>
            )}
          </div>
        </div>

        {shots.length > 0 ? (
          <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 md:mt-16 md:gap-4 lg:grid-cols-5">
            {shots.map((ch, i) => (
              <figure
                key={ch.kicker + ch.title}
                className="overflow-hidden rounded-[22px] bg-[#111] ring-1 ring-white/10"
              >
                <Image
                  src={ch.image!}
                  alt={`${draft.title}: ${ch.kicker}`}
                  width={470}
                  height={1024}
                  className="h-auto w-full"
                  sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 200px"
                  priority={i < 3}
                />
              </figure>
            ))}
          </div>
        ) : null}

        <div className="mt-16 max-w-2xl space-y-12 md:mt-20 md:space-y-14">
          <section>
            <p className="font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white">
              The problem
            </p>
            <p className="mt-4 font-body text-[17px] leading-relaxed text-white md:text-[18px]">
              {draft.problem}
            </p>
          </section>

          <section>
            <p className="font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white">
              What I built
            </p>
            <p className="mt-4 font-body text-[17px] leading-relaxed text-white md:text-[18px]">
              {draft.solution}
            </p>
          </section>

          <section>
            <p className="font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white">
              Hard problems I solved
            </p>
            <ul className="mt-6 space-y-0 divide-y divide-white/15 border-y border-white/15">
              {draft.challenges.map((item) => (
                <li key={item.title} className="py-5">
                  <p className="font-display text-[17px] font-semibold tracking-[-0.02em] text-white">
                    {item.title}
                  </p>
                  <p className="mt-2 font-body text-[15px] leading-relaxed text-white md:text-[16px]">
                    {item.copy}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <p className="font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white">
              Scope
            </p>
            <p className="mt-4 font-body text-[17px] leading-relaxed text-white md:text-[18px]">
              {draft.role}. Design through ship, not handoff theatre.
            </p>
          </section>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-3 border-t border-white/15 pt-10 md:mt-20">
          <Pill href="/contact" solid>
            Start a conversation
          </Pill>
          {draft.links[0] ? (
            <Pill href={draft.links[0].href} external>
              {linkText(draft.links[0])}
            </Pill>
          ) : null}
        </div>

        {others.length > 0 ? (
          <div className="mt-14 md:mt-16">
            <p className="font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-white">
              More work
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {others.map((d) => (
                <Pill key={d.slug} href={`/drafts/${d.slug}`}>
                  {d.title}
                </Pill>
              ))}
            </div>
          </div>
        ) : null}
      </article>
    </div>
  );
}
