import { cases } from "@/data/site";

export type ProductLink = {
  label: string;
  href: string;
  kind: "appstore" | "playstore" | "web" | "other";
};

export type ProductDraft = {
  slug: string;
  title: string;
  year: string;
  category: string;
  tagline: string;
  headline: string;
  support: string;
  overview: string;
  problem: string;
  solution: string;
  challenges: { title: string; copy: string }[];
  links: ProductLink[];
  role: string;
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
    category: "Social, Flutter, Maps",
    tagline: bySlug.lifemaxxing.tagline,
    headline: "Find what's worth doing.",
    support:
      "Lists and logs from people you trust. Feed, map, explore, and a profile that keeps score.",
    overview:
      "A location anchored social network where every post is an Experience: activity, place, date, media. I designed and built it end to end, from product model to App Store release.",
    problem:
      "Travel and social apps either drown you in content or trap memories in albums. Friends’ real recommendations (the café, the trail, the dive) had no home that felt as good as being there.",
    solution:
      "I built an experience first graph: log what you did, where, and with whom; browse a trust weighted feed; explore a shared map; land on place pages with tips from people who’ve been. Flutter client, NestJS BFF, PostGIS, Mapbox, R2 media. Live on the App Store.",
    challenges: [
      {
        title: "Map performance at city scale",
        copy: "I made thousands of pins stay fluid on mid range phones with clustering, viewport queries, and PostGIS. No frozen maps, no fake demos.",
      },
      {
        title: "Experience model, not posts",
        copy: "I refused another feed clone. Activity + place + date as the atomic unit forced a different feed, privacy model, and place page architecture, and that is what makes the product feel real.",
      },
      {
        title: "Store ready privacy and location",
        copy: "Background location, photo EXIF, and visibility controls had to pass App Review and still feel invisible. I shipped that without trading polish for compliance.",
      },
      {
        title: "Cross platform polish",
        copy: "One Flutter codebase that still reads native. I owned haptics, maps, deep links, and media upload so iOS and Android feel intentional, not compromised.",
      },
    ],
    links: [
      {
        label: "App Store",
        href: "https://apps.apple.com/app/lifemaxxing-official/id6782136048",
        kind: "appstore",
      },
      {
        label: "Google Play",
        href: "https://lifemaxxing.io/download/",
        kind: "playstore",
      },
      {
        label: "Website",
        href: "https://lifemaxxing.io",
        kind: "web",
      },
    ],
    role: "Product design, Flutter, NestJS, Maps",
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
        copy: "Find what's worth doing. Lists and logs from people you trust.",
      },
      {
        title: "Map",
        copy: "Your city, through friends. Switch between people you follow and everyone.",
      },
      {
        title: "Explore",
        copy: "Hiking, dining, diving. Browse lists and places by what you're into.",
      },
      {
        title: "Places",
        copy: "Tips from people who've been. Directions, reservations, local know how.",
      },
    ],
    stats: [
      { value: "Live", label: "App Store" },
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
        copy: "Directions, reservations and local know how.",
        image: "/work/lifemaxxing/05-places.jpg",
      },
    ],
  },
  {
    slug: "big-red-map",
    title: "Big Red Map",
    year: bySlug["big-red-map"].year,
    category: "Travel, Next.js, Web",
    tagline: bySlug["big-red-map"].tagline,
    headline: "Paint the world you’ve lived.",
    support:
      "A cinematic map as profile. Countries go red, memories go gold, and your public page tells the story in one glance.",
    overview:
      "A phone first web product where your travel life becomes a bold public globe. I designed the brand, built the map product, and shipped the launch site as one system.",
    problem:
      "Travel profiles were either Instagram grids or spreadsheet looking trackers. Nothing made “where I’ve been” feel cinematic, shareable, and true in a single frame.",
    solution:
      "I built the brand system, interactive MapLibre globe, and Supabase backed desk. Optional Lifemaxxing country import so real travel data paints the map. Landing and product designed as one story, not two leftovers.",
    challenges: [
      {
        title: "Globe that feels premium on mobile",
        copy: "I pushed MapLibre performance, gesture feel, and visual hierarchy until a phone screen still reads as a hero, not a tiny widget.",
      },
      {
        title: "One color brand language",
        copy: "Red means been there. Gold means remember this. I held that rule across landing, desk, and share pages so the product never looks like a template.",
      },
      {
        title: "Cross product data bridge",
        copy: "I wired a read only Lifemaxxing country import without coupling accounts or leaking media. Same email, separate systems, no messy sync debt.",
      },
      {
        title: "Public scrapbook safety",
        copy: "I designed clear privacy boundaries for user generated places and media, with cookies and EU hosted data that hold up in production.",
      },
    ],
    links: [
      {
        label: "Open Big Red Map",
        href: "https://www.bigredmap.com",
        kind: "web",
      },
    ],
    role: "Brand, Next.js, MapLibre, Launch",
    accent: "#ef1a12",
    accentSoft: "rgba(239,26,18,0.16)",
    ink: "#f5f5f7",
    muted: "#a1a1a6",
    surface: "#0a0a0a",
    theme: "dark",
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
        copy: "Tap a country and it turns red. Travel progress you can feel.",
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
        title: "Phone first brand",
        copy: "Bold red system designed to land hard on a small screen.",
      },
    ],
    stats: [
      { value: "Live", label: "Web product" },
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
        copy: "Atmosphere and product in the same frame. The site sells the feeling.",
        image: "/work/bigred-tokyo.jpg",
      },
      {
        kicker: "Desk",
        title: "Built for launch day.",
        copy: "Landing, identity, and interactive map wired for a real release.",
        image: "/work/bigred-desk.png",
      },
      {
        kicker: "Access",
        title: "Sign in. Paint. Share.",
        copy: "Account flow that gets you onto the globe without killing the mood.",
        image: "/work/bigred-login.png",
      },
    ],
  },
  {
    slug: "anita",
    title: "Anita",
    year: bySlug.anita.year,
    category: "Fintech, AI, iOS / Web",
    tagline: bySlug.anita.tagline,
    headline: "Clarity for your money.",
    support:
      "Your finances, finally in one place. Chat, overview, limits, and net worth in a calm dark interface.",
    overview:
      "An AI native personal finance companion: conversational money clarity, goals, spending, and optional bank linking via Stripe. I am building it across SwiftUI iOS and React web on one backend.",
    problem:
      "Most finance apps still feel like spreadsheets with a skin. People wanted answers (“can I afford this?”, “am I on track?”) without wrestling dashboards or exporting CSVs.",
    solution:
      "I designed a chat first UX on a shared Express and Supabase backend, with Stripe Financial Connections for real bank data. Native iOS and web parity, PostHog for product signal, and a calm dark UI that reduces money anxiety instead of amplifying it.",
    challenges: [
      {
        title: "Trust in a chat about money",
        copy: "I built conversational UI that never feels reckless: clear confirmations, limits, and no fake certainty from the model.",
      },
      {
        title: "Bank data without the mess",
        copy: "I wired Stripe Financial Connections, webhooks, and reconciliation so balances stay honest across devices.",
      },
      {
        title: "iOS and web parity",
        copy: "I kept SwiftUI and React on one mental model and one API. Same flows, native feel on each surface, no second class client.",
      },
      {
        title: "Calm under complexity",
        copy: "I shaped categories, limits, goals, and net worth so the product stays clear instead of turning into a dashboard graveyard.",
      },
    ],
    links: [],
    role: "Product design, SwiftUI, Express, Stripe",
    accent: "#9fe870",
    accentSoft: "rgba(159,232,112,0.14)",
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
        copy: "Income, expenses, and balance by month. The full picture.",
      },
      {
        title: "Categories",
        copy: "Smart spending breakdown in real time.",
      },
      {
        title: "Limits and goals",
        copy: "Spending limits and saving goals that actually stick.",
      },
    ],
    stats: [
      { value: "Chat", label: "AI money companion" },
      { value: "iOS", label: "SwiftUI native" },
      { value: "Build", label: "Bank ready stack" },
    ],
    chapters: [
      {
        kicker: "AI Assistant",
        title: "Ask anything. Get answers.",
        copy: "Set limits and goals just by chatting. No spreadsheet anxiety.",
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
        kicker: "Limits and goals",
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
];

export function getDraft(slug: string) {
  return productDrafts.find((d) => d.slug === slug);
}

export function getDraftSlugs() {
  return productDrafts.map((d) => d.slug);
}
