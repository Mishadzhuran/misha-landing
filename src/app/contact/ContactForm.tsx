"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { site } from "@/data/site";
import { SectionLabel, Shell } from "@/components/ui/Primitives";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className="pb-24 pt-32 md:pb-32 md:pt-40">
      <Shell>
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <SectionLabel align="center">Contact</SectionLabel>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="soft-title text-[clamp(2.4rem,6vw,4rem)]"
          >
            Tell me what you’re
            <span className="font-serif italic font-normal text-muted"> building</span>
          </motion.h1>
          <p className="readable mx-auto mt-5 max-w-lg">
            Share the idea, timeline, and platforms. I reply within {site.responseTime}.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="apple-card space-y-7 p-8 md:p-10">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-muted-soft">
                Email
              </p>
              <a
                href={`mailto:${site.email}`}
                className="mt-2 block text-xl font-medium text-accent md:text-2xl"
              >
                {site.email}
              </a>
            </div>
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-muted-soft">
                Reply
              </p>
              <p className="mt-2 text-xl md:text-2xl">Within {site.responseTime}</p>
            </div>
          </div>

          <div className="apple-card p-8 md:p-10">
            {sent ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                <p className="soft-title text-4xl">Locked in.</p>
                <p className="readable mt-4 max-w-sm">
                  Message received. I’ll come back fast with next steps.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <Field label="Name" name="name" required placeholder="Alex Founder" />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  required
                  placeholder="alex@company.com"
                />
                <Field
                  label="Project type"
                  name="type"
                  required
                  placeholder="iOS app / web product / launch"
                />
                <label className="block">
                  <span className="mb-2 block text-[12px] font-medium uppercase tracking-[0.12em] text-muted-soft">
                    Brief
                  </span>
                  <textarea
                    name="brief"
                    required
                    rows={5}
                    placeholder="What are you building, for whom, and by when?"
                    className="w-full resize-none rounded-2xl border border-line bg-[#f5f5f7] px-4 py-3.5 text-[15px] outline-none transition focus:border-black/20 focus:bg-white"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#1d1d1f] px-6 py-3.5 text-[13px] font-medium text-white transition hover:bg-black"
                >
                  Send brief →
                </button>
              </form>
            )}
          </div>
        </div>
      </Shell>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-medium uppercase tracking-[0.12em] text-muted-soft">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-line bg-[#f5f5f7] px-4 py-3.5 text-[15px] outline-none transition focus:border-black/20 focus:bg-white"
      />
    </label>
  );
}
