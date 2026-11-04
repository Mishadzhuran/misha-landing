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
    headline: "Your life, mapped as experiences.",
    support:
      "Post what you did, where it happened, and who was there — then watch a living map of your life take shape.",
    accent: "#c9a227",
    accentSoft: "rgba(201,162,39,0.14)",
    ink: "#1d1d1f",
    muted: "#6e6e73",
    surface: "#f5f5f7",
    theme: "light",
    cta: "Explore the product",
    heroImage: "/work/lifemaxxing-cover.jpg",
    gallery: [
      "/work/lifemaxxing-map.png",
      "/work/lifemaxxing-home.png",
      "/work/lifemaxxing-explore.png",
      "/work/lifemaxxing-feed.png",
      "/work/lifemaxxing-profile.png",
    ],
    features: [
      {
        title: "Experience-first posts",
        copy: "Activity, place, date, and media — not another empty feed.",
      },
      {
        title: "Life map",
        copy: "Every moment lands on a map you can actually return to.",
      },
      {
        title: "Place pages",
        copy: "Deep pages for the spots that shaped your year.",
      },
      {
        title: "Built to ship",
        copy: "Flutter apps, NestJS BFF, PostGIS, and Mapbox in production.",
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
        title: "Moments that feel real.",
        copy: "A calm social surface built around what you did — not what you performed.",
        image: "/work/lifemaxxing-feed.png",
      },
      {
        kicker: "Map",
        title: "Your year, in places.",
        copy: "Zoom from a single pin to a whole season of memories.",
        image: "/work/lifemaxxing-map.png",
      },
      {
        kicker: "Explore",
        title: "Find the next experience.",
        copy: "Browse places and activities people keep coming back to.",
        image: "/work/lifemaxxing-explore.png",
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
      "A cinematic map-as-profile — countries go red, memories go gold, and your public page tells the story in one glance.",
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
        copy: "Tap a country and it turns red — travel progress you can feel.",
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
        copy: "Atmosphere and product in the same frame — the site sells the feeling.",
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
    headline: "Money, in a conversation.",
    support:
      "An AI finance companion that answers in plain language — goals, spending, and optional bank data without spreadsheet anxiety.",
    accent: "#34c759",
    accentSoft: "rgba(52,199,89,0.12)",
    ink: "#1d1d1f",
    muted: "#6e6e73",
    surface: "#f5f5f7",
    theme: "light",
    cta: "Open the draft",
    heroImage: "/work/anita-mock.png",
    gallery: ["/work/anita-mock.png"],
    features: [
      {
        title: "Chat-first clarity",
        copy: "Ask about spending or goals the way you’d ask a friend.",
      },
      {
        title: "Real bank data",
        copy: "Optional Stripe Financial Connections when you’re ready.",
      },
      {
        title: "iOS + web parity",
        copy: "SwiftUI and React sharing one calm backend.",
      },
      {
        title: "Quiet confidence",
        copy: "Soft surfaces, soft answers — finance that doesn’t shout.",
      },
    ],
    stats: [
      { value: "AI", label: "Conversational money" },
      { value: "iOS", label: "SwiftUI native" },
      { value: "Web", label: "Same brain" },
    ],
    chapters: [
      {
        kicker: "Interface",
        title: "Talk instead of tabs.",
        copy: "Anita replaces dense dashboards with a single clear conversation.",
        image: "/work/anita-mock.png",
      },
      {
        kicker: "Tone",
        title: "Soft green, soft answers.",
        copy: "A visual system that feels safe — not like a bank ad.",
      },
      {
        kicker: "Build",
        title: "One product, two surfaces.",
        copy: "Native iOS and web stay in sync so money never feels fragmented.",
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
      "A high-contrast coaching brand and conversion landing for Slobodan Mitkov — athletic presence, bilingual flow, real checkout paths.",
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
        copy: "Hard contrast and strong type — no soft template look.",
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
        copy: "The hero carries the coach’s physicality — dark, sharp, impossible to ignore.",
        image: "/work/mitkovt-hero.jpg",
      },
      {
        kicker: "Stage",
        title: "Driven by discipline.",
        copy: "Every frame reinforces performance — from photography to legal pages.",
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
