import { cases } from "@/data/site";

export type ProductDraft = {
  slug: string;
  title: string;
  year: string;
  category: string;
  tagline: string;
  headline: string;
  support: string;
  accent: string;
  accentSoft: string;
  ink: string;
  muted: string;
  surface: string;
  theme: "light" | "dark";
  cta: string;
  heroImage: string;
  gallery: string[];
  features: { title: string; copy: string }[];
  stats: { value: string; label: string }[];
  chapters: { kicker: string; title: string; copy: string; image?: string }[];
};

const bySlug = Object.fromEntries(cases.map((c) => [c.slug, c]));

export const productDrafts: ProductDraft[] = [
  {
    slug: "lifemaxxing",
    title: "Lifemaxxing",
    year: bySlug.lifemaxxing.year,
    category: bySlug.lifemaxxing.category,
    tagline: bySlug.lifemaxxing.tagline,
    headline: "Find what's worth doing.",
    support:
      "Lists and logs from people you trust — feed, map, explore, and a profile that keeps score.",
    accent: "#c9a227",
    accentSoft: "rgba(201,162,39,0.16)",
    ink: "#f5f5f7",
    muted: "#a1a1a6",
    surface: "#0a0a0a",
    theme: "dark",
    cta: "See screens",
    heroImage: "/work/lifemaxxing/01-feed.jpg",
    gallery: [
      "/work/lifemaxxing/01-feed.jpg",
      "/work/lifemaxxing/02-map.jpg",
      "/work/lifemaxxing/03-profile.jpg",
      "/work/lifemaxxing/04-explore.jpg",
      "/work/lifemaxxing/05-places.jpg",
    ],
    features: [
      {
        title: "Feed",
        copy: "Find what's worth doing — lists and logs from people you trust.",
      },
      {
        title: "Map",
        copy: "Your city, through friends. Switch between people you follow and everyone.",
      },
      {
        title: "Explore",
        copy: "Hiking, dining, diving — browse lists and places by what you're into.",
      },
      {
        title: "Places",
        copy: "Tips from people who've been — directions, reservations, local know-how.",
      },
    ],
    stats: [
      { value: "Live", label: "iOS & Android" },
      { value: "Map", label: "Native memory layer" },
      { value: "Social", label: "Experience graph" },
    ],
    chapters: [
      {
        kicker: "Feed",
        title: "Find what's worth doing.",
        copy: "Lists and logs from people you trust.",
        image: "/work/lifemaxxing/01-feed.jpg",
      },
      {
        kicker: "Map",
        title: "Your city, through friends.",
        copy: "Switch between people you follow and everyone.",
        image: "/work/lifemaxxing/02-map.jpg",
      },
      {
        kicker: "Profile",
        title: "A profile that keeps score.",
        copy: "Countries, hikes, restaurants. Counted for you.",
        image: "/work/lifemaxxing/03-profile.jpg",
      },
      {
        kicker: "Explore",
        title: "Hiking, dining, diving.",
        copy: "Browse lists and places by what you're into.",
        image: "/work/lifemaxxing/04-explore.jpg",
      },
      {
        kicker: "Places",
        title: "Tips from people who've been.",
        copy: "Directions, reservations and local know-how.",
        image: "/work/lifemaxxing/05-places.jpg",
      },
    ],
  },
  {
    slug: "big-red-map",
    title: "Big Red Map",
    year: bySlug["big-red-map"].year,
    category: bySlug["big-red-map"].category,
    tagline: bySlug["big-red-map"].tagline,
    headline: "Paint the world you’ve lived.",
    support:
      "A cinematic map-as-profile, countries go red, memories go gold, and your public page tells the story in one glance.",
    accent: "#ef1a12",
    accentSoft: "rgba(239,26,18,0.12)",
    ink: "#1d1d1f",
    muted: "#6e6e73",
    surface: "#f5f5f7",
    theme: "light",
    cta: "See the map",
    heroImage: "/work/bigred-cover.jpg",
    gallery: [
      "/work/bigred-phone.png",
      "/work/bigred-desk.png",
      "/work/bigred-tokyo.jpg",
      "/work/bigred-login.png",
    ],
    features: [
      {
        title: "Country paint",
        copy: "Tap a country and it turns red, travel progress you can feel.",
      },
      {
        title: "Gold memory pins",
        copy: "Drop the moments that mattered on a living globe.",
      },
      {
        title: "Public life page",
        copy: "A shareable profile that reads like a film poster for your travels.",
      },
      {
        title: "Phone-first brand",
        copy: "Bold red system designed to land hard on a small screen.",
      },
    ],
    stats: [
      { value: "Web", label: "Next.js launch" },
      { value: "Map", label: "MapLibre globe" },
      { value: "Brand", label: "Full visual system" },
    ],
    chapters: [
      {
        kicker: "Product",
        title: "One color. Instant meaning.",
        copy: "Red means been there. Gold means remember this. Nothing else competes.",
        image: "/work/bigred-phone.png",
      },
      {
        kicker: "Story",
        title: "Tokyo nights, mapped.",
        copy: "Atmosphere and product in the same frame, the site sells the feeling.",
        image: "/work/bigred-tokyo.jpg",
      },
      {
        kicker: "Desk",
        title: "Built for launch day.",
        copy: "Landing, identity, and interactive map wired for a real release.",
        image: "/work/bigred-desk.png",
      },
    ],
  },
  {
    slug: "anita",
    title: "Anita",
    year: bySlug.anita.year,
    category: bySlug.anita.category,
    tagline: bySlug.anita.tagline,
    headline: "Clarity for your money.",
    support:
      "Your finances, finally in one place — chat, overview, limits, and net worth in a calm dark interface.",
    accent: "#af52de",
    accentSoft: "rgba(175,82,222,0.14)",
    ink: "#f5f5f7",
    muted: "#a1a1a6",
    surface: "#0a0a0a",
    theme: "dark",
    cta: "See screens",
    heroImage: "/work/anita/01-hero.png",
    gallery: [
      "/work/anita/02-ai-assistant.png",
      "/work/anita/03-overview.png",
      "/work/anita/04-categories.jpg",
      "/work/anita/05-limits-goals.png",
      "/work/anita/06-assets.png",
      "/work/anita/01-hero.png",
    ],
    features: [
      {
        title: "AI assistant",
        copy: "Ask anything. Set limits and goals just by chatting.",
      },
      {
        title: "Overview",
        copy: "Income, expenses, and balance by month — the full picture.",
      },
      {
        title: "Categories",
        copy: "Smart spending breakdown in real time.",
      },
      {
        title: "Limits & goals",
        copy: "Spending limits and saving goals that actually stick.",
      },
    ],
    stats: [
      { value: "Chat", label: "AI money companion" },
      { value: "iOS", label: "SwiftUI native" },
      { value: "Live", label: "Bank-ready stack" },
    ],
    chapters: [
      {
        kicker: "AI Assistant",
        title: "Ask anything. Get answers.",
        copy: "Set limits and goals just by chatting — no spreadsheet anxiety.",
        image: "/work/anita/02-ai-assistant.png",
      },
      {
        kicker: "Overview",
        title: "See the full picture.",
        copy: "Income, expenses and balance by month in one calm view.",
        image: "/work/anita/03-overview.png",
      },
      {
        kicker: "Categories",
        title: "Know where it all goes.",
        copy: "Smart spending breakdown in real time.",
        image: "/work/anita/04-categories.jpg",
      },
      {
        kicker: "Limits & goals",
        title: "Stay on track.",
        copy: "Spending limits and saving goals that work together.",
        image: "/work/anita/05-limits-goals.png",
      },
      {
        kicker: "Net worth",
        title: "Grow your wealth.",
        copy: "Track assets and level up as you save.",
        image: "/work/anita/06-assets.png",
      },
    ],
  },
  {
    slug: "mitkovt",
    title: "Mitkovt Coaching",
    year: bySlug.mitkovt.year,
    category: bySlug.mitkovt.category,
    tagline: bySlug.mitkovt.tagline,
    headline: "Discipline, made visible.",
    support:
      "A high-contrast coaching brand and conversion landing for Slobodan Mitkov, athletic presence, bilingual flow, real checkout paths.",
    accent: "#ffffff",
    accentSoft: "rgba(255,255,255,0.08)",
    ink: "#f5f5f7",
    muted: "#a1a1a6",
    surface: "#000000",
    theme: "dark",
    cta: "View the site draft",
    heroImage: "/work/mitkovt-hero.jpg",
    gallery: ["/work/mitkovt-hero.jpg", "/work/mitkovt-stage.jpg"],
    features: [
      {
        title: "Athletic brand",
        copy: "Hard contrast and strong type, no soft template look.",
      },
      {
        title: "DE / EN",
        copy: "Bilingual conversion without losing the punch.",
      },
      {
        title: "Checkout ready",
        copy: "PayPal and SEPA paths wired for real clients.",
      },
      {
        title: "WhatsApp close",
        copy: "A direct path from landing to conversation.",
      },
    ],
    stats: [
      { value: "Brand", label: "Visual identity" },
      { value: "DE/EN", label: "Bilingual site" },
      { value: "Pay", label: "Checkout live" },
    ],
    chapters: [
      {
        kicker: "Presence",
        title: "Built through experience.",
        copy: "The hero carries the coach’s physicality, dark, sharp, impossible to ignore.",
        image: "/work/mitkovt-hero.jpg",
      },
      {
        kicker: "Stage",
        title: "Driven by discipline.",
        copy: "Every frame reinforces performance, from photography to legal pages.",
        image: "/work/mitkovt-stage.jpg",
      },
      {
        kicker: "Conversion",
        title: "Ready for clients.",
        copy: "Payment and messaging paths that work in Germany, not just look good.",
      },
    ],
  },
];

export function getDraft(slug: string) {
  return productDrafts.find((d) => d.slug === slug);
}

export function getDraftSlugs() {
  return productDrafts.map((d) => d.slug);
}
