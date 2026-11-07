"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/data/site";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href;
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[max(1rem,env(safe-area-inset-top))] md:pt-5">
        <div className="liquid-glass-nav flex w-full max-w-[720px] items-center justify-between gap-2 rounded-full px-2 py-2 md:px-2.5">
          <Link
            href="/"
            className="pressable rounded-full px-4 py-2 font-display text-[15px] font-bold tracking-[-0.04em] text-black"
          >
            {site.shortName}
          </Link>

          <nav className="hidden items-center gap-0.5 sm:flex">
            {[{ href: "/", label: "Home" }, ...navLinks].map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3.5 py-2 text-[13px] font-medium tracking-[-0.01em] text-black transition-[font-weight] duration-[var(--duration-ui)] ease-[var(--ease-out)] ${
                    active ? "font-semibold" : "font-medium hover:font-semibold"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <Link
              href="/contact"
              className="pressable rounded-full bg-black px-3.5 py-2 text-[13px] font-semibold !text-white hover:bg-black/90 sm:px-4"
            >
              Let&apos;s talk
            </Link>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="pressable relative z-[60] flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full sm:hidden"
            >
              <span
                className={`h-px w-4 bg-black transition-[transform,opacity] duration-[var(--duration-ui)] ease-[var(--ease-out)] ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
              />
              <span
                className={`h-px w-4 bg-black transition-opacity duration-[var(--duration-ui)] ease-[var(--ease-out)] ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`h-px w-4 bg-black transition-[transform,opacity] duration-[var(--duration-ui)] ease-[var(--ease-out)] ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-40 animate-[fadeIn_0.28s_var(--ease-out)] bg-[#f5f5f7]/95 backdrop-blur-xl sm:hidden">
          <div className="flex h-full flex-col justify-between px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-28">
            <div className="space-y-1">
              {[{ href: "/", label: "Home" }, ...navLinks].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-3 font-display text-4xl font-bold tracking-[-0.04em] ${
                    isActive(link.href) ? "text-text" : "text-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="space-y-4">
              <Link
                href="/contact"
                className="pressable flex w-full items-center justify-center rounded-full bg-[#1d1d1f] px-6 py-3.5 text-[15px] font-semibold !text-white"
              >
                Let&apos;s talk
              </Link>
              <p className="text-center text-base text-muted">{site.email}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
