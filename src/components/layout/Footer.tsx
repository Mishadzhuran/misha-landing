"use client";

import Link from "next/link";
import { footerNav, navLinks, site } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0a0a0a] pb-[max(2rem,env(safe-area-inset-bottom)+0.75rem)] pt-16 text-white md:pt-20">
      <div className="shell-wide">
        <div className="border-t border-white/[0.08] pt-10 md:pt-12">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-16">
            <div className="max-w-sm">
              <Link
                href="/"
                className="font-display text-[18px] font-semibold tracking-[-0.03em] text-white"
              >
                {site.name}
              </Link>
              <p className="mt-3 text-[14px] leading-relaxed text-white/40">
                {site.tagline}
              </p>
            </div>

            <nav
              aria-label="Footer"
              className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3 sm:gap-x-14"
            >
              <FooterCol title="Navigate" links={navLinks} />
              <FooterCol title="Explore" links={footerNav.studio} />
              <FooterCol title="Legal" links={footerNav.legal} />
            </nav>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.06] pt-6 text-[13px] text-white/30 sm:mt-14 sm:flex-row sm:items-center sm:justify-between">
            <span>
              © {year} {site.name}
            </span>
            <a
              href={`mailto:${site.email}`}
              className="transition-colors duration-[var(--duration-ui)] ease-[var(--ease-out)] hover:text-white/60"
            >
              {site.email}
            </a>
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
      <p className="mb-3.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/30">
        {title}
      </p>
      <ul className="space-y-2.5 text-[14px]">
        {links.map((l) => (
          <li key={`${title}-${l.href}-${l.label}`}>
            <Link
              href={l.href}
              className="text-white/55 transition-colors duration-[var(--duration-ui)] ease-[var(--ease-out)] hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
