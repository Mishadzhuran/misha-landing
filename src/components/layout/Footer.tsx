"use client";

import Link from "next/link";
import { footerNav, navLinks, site } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative pb-[max(2.5rem,env(safe-area-inset-bottom)+1rem)] pt-6">
      <div className="shell-wide">
        <div className="apple-card px-5 py-10 sm:px-7 sm:py-12 md:px-12 md:py-14">
          <div className="grid gap-10 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-5">
              <Link
                href="/"
                className="font-display text-[22px] font-bold tracking-[-0.04em] sm:text-2xl"
              >
                {site.name}
              </Link>
              <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-muted">
                {site.tagline}
              </p>
              <a
                href={`mailto:${site.email}`}
                className="mt-6 inline-block text-[15px] font-medium text-accent"
              >
                {site.email}
              </a>
              <p className="mt-2 text-[14px] text-muted-soft">
                {site.role}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-10 md:col-span-7 md:grid-cols-3">
              <FooterCol title="Navigate" links={navLinks} />
              <FooterCol title="Explore" links={footerNav.studio} />
              <FooterCol title="Legal" links={footerNav.legal} />
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-[13px] text-muted-soft md:flex-row md:items-center md:justify-between">
            <span>
              © {year} {site.name}
            </span>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link href="/privacy" className="hover:text-text">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-text">
                Terms
              </Link>
              <Link href="/cookies" className="hover:text-text">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.12em] text-muted-soft">
        {title}
      </p>
      <ul className="space-y-2.5 text-[15px]">
        {links.map((l) => (
          <li key={`${title}-${l.href}-${l.label}`}>
            <Link href={l.href} className="text-text/80 transition hover:text-text">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
