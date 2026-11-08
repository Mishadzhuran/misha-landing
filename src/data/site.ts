export const site = {
  name: "Misha Dzhuran",
  shortName: "Misha",
  legalName: "Misha Dzhuran",
  url: "https://mishadzhuran.com",
  tagline: "I help people ship products that feel great.",
  description:
    "Misha Dzhuran, product designer & developer. I help people turn ideas into polished apps and websites, from first sketch to App Store.",
  email: "hello@mishadzhuran.com",
  phone: "",
  locations: [] as string[],
  socials: [] as { label: string; href: string }[],
  governingLaw: "Poland",
  headOffice: "",
  responseTime: "1 business day",
  role: "Product design & development",
  quote:
    "Your product should feel calm, clear, and ready, so people open it, trust it, and come back.",
  pitch:
    "I help people build apps and websites that make life easier: design, development, and a clean launch.",
};

export const navLinks = [
  { href: "/#work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const footerNav = {
  studio: [
    { href: "/#work", label: "Selected work" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Get in touch" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookies", label: "Cookie Policy" },
  ],
};

export const footerLinks = footerNav.legal;

export const sellingPoints = [
  {
    title: "End-to-end ownership",
    copy: "One person who can take the product from brief to App Store: design, build, release, and post-launch care.",
  },
  {
    title: "Ships that don’t panic",
    copy: "Store compliance, TestFlight, soft launch, and rollout plans so launch day is boring in the best way.",
  },
  {
    title: "Interfaces people return to",
    copy: "Soft, clear product UI: fewer screens, sharper decisions, the kind of polish that feels expensive without shouting.",
  },
  {
    title: "Still there after go-live",
    copy: "Updates, fixes, store optimization, and growth work after the launch party ends.",
  },
];

export const techStack = [
  { name: "Figma", tone: "#a259ff" },
  { name: "Swift", tone: "#f05138" },
  { name: "Kotlin", tone: "#7f52ff" },
  { name: "Flutter", tone: "#54c5f8" },
  { name: "TypeScript", tone: "#3178c6" },
  { name: "React", tone: "#61dafb" },
  { name: "Next.js", tone: "#111111" },
  { name: "Node", tone: "#5fa04e" },
  { name: "Supabase", tone: "#3ecf8e" },
  { name: "Stripe", tone: "#635bff" },
  { name: "Mapbox", tone: "#4264fb" },
  { name: "TestFlight", tone: "#0a84ff" },
  { name: "App Store", tone: "#30d158" },
  { name: "Sentry", tone: "#362d59" },
  { name: "OpenAI", tone: "#10a37f" },
];

/**
 * Production systems & APIs across shipped work (Lifemaxxing, Big Red Map,
 * Anita, landings, admin). Professional naming, keep in sync with real stacks.
 * No vendor parentheses in display names.
 */
export const capabilities = [
  { name: "Geospatial Resolution & Geocoding" },
  { name: "Location Intelligence Systems" },
  { name: "PostGIS Spatial Analytics" },
  { name: "Interactive Mapping Systems" },
  { name: "Mobile Cartography" },
  { name: "Device Geolocation Services" },
  { name: "Image Optimization Pipelines" },
  { name: "EXIF Metadata Processing" },
  { name: "Cloud Object Storage" },
  { name: "Presigned Media Upload Flows" },
  { name: "Video Playback Infrastructure" },
  { name: "Banking System Integration" },
  { name: "Stripe Financial Connections" },
  { name: "Subscription Billing Systems" },
  { name: "Payment Webhook Architecture" },
  { name: "Conversational AI Integration" },
  { name: "Real-Time WebSocket Systems" },
  { name: "NestJS API Architecture" },
  { name: "Express Service Development" },
  { name: "Supabase Data Infrastructure" },
  { name: "Row-Level Security Design" },
  { name: "JWT Authentication Systems" },
  { name: "Sign in with Apple" },
  { name: "Google OAuth Integration" },
  { name: "Secure Credential Storage" },
  { name: "Push Notification Systems" },
  { name: "Universal & App Deep Linking" },
  { name: "Cross-Platform Mobile Development" },
  { name: "Native iOS Development" },
  { name: "TestFlight & App Store Release" },
  { name: "App Store Compliance & Privacy" },
  { name: "Application Error Monitoring" },
  { name: "Product Analytics" },
  { name: "Transactional Email Delivery" },
  { name: "Internationalization" },
  { name: "Admin Dashboard Engineering" },
  { name: "Conversion Landing Pages" },
  { name: "3D Web Visualization" },
  { name: "Schema Validation" },
  { name: "Full-Stack Web Applications" },
];

export const focusAreas = [
  {
    id: "01",
    title: "Product systems",
    copy: "End-to-end product thinking, from sharp problem framing to interfaces people actually return to.",
  },
  {
    id: "02",
    title: "App experiences",
    copy: "iOS and Android products engineered for polish, speed, and a native feel from the first tap.",
  },
  {
    id: "03",
    title: "Launch surfaces",
    copy: "Landing pages and store presence that explain value fast and convert before the install.",
  },
  {
    id: "04",
    title: "Market release",
    copy: "App Store & Play readiness, rollout control, and the quiet work that makes launch day boring.",
  },
];

export const services = focusAreas.map((f) => ({
  id: f.id,
  title: f.title,
  copy: f.copy,
}));

export const processSteps = [
  {
    step: "01",
    title: "Frame",
    copy: "Clarify the product bet, audience, and the smallest shippable win.",
  },
  {
    step: "02",
    title: "Shape",
    copy: "Design the experience and architecture so the build stays lean and intentional.",
  },
  {
    step: "03",
    title: "Ship",
    copy: "Release to market with store readiness, analytics, and a controlled rollout.",
  },
  {
    step: "04",
    title: "Compound",
    copy: "Iterate on retention, conversion, and polish after the launch dust settles.",
  },
];

export const engagementModels = [
  {
    id: "01",
    title: "Discovery sprint",
    timeline: "5 to 10 days",
    priceHint: "Fixed fee",
    copy: "Scope, architecture, store risk review, and a written build plan with timeline + budget.",
    outcome: "Signed SOW-ready brief",
  },
  {
    id: "02",
    title: "Build & launch",
    timeline: "Milestone SOW",
    priceHint: "Deposit + stages",
    copy: "App, landings, and store submission under one agreement with milestone payments.",
    outcome: "Live product in market",
  },
  {
    id: "03",
    title: "Growth retainer",
    timeline: "Monthly",
    priceHint: "Retainer",
    copy: "Post-launch updates, store optimization, and conversion experiments after day one.",
    outcome: "Stable shipping cadence",
  },
];

export const conversionFaqs = [
  {
    q: "What kinds of projects do you take?",
    a: "Mobile products, launch landings, and store-ready releases, especially when clarity, craft, and market timing matter.",
  },
  {
    q: "How do engagements usually start?",
    a: "With a short discovery or scope call. You leave with a clear path, not a vague pitch deck.",
  },
  {
    q: "How fast do you reply?",
    a: "Typically within 1 business day. Time zones flex around the work.",
  },
];

export const scrollChapters = focusAreas.map((f) => ({
  id: f.title.toLowerCase().replace(/\s+/g, "-"),
  index: f.id,
  title: f.title,
  line: f.copy,
  body: f.copy,
  points: [] as string[],
}));

export const cases = [
  {
    slug: "lifemaxxing",
    title: "Lifemaxxing",
    category: "Social · Flutter · Maps",
    year: "2026",
    metric: "Live product",
    tagline: "The IMDb of your life",
    summary:
      "A location-anchored social network where every post is an Experience, activity, place, date, media. Builds a life map, feed, and place pages people actually return to.",
    result: "iOS / Android · NestJS · Supabase · Mapbox",
    highlights: [
      "Experience-first social graph (not another feed clone)",
      "Map-native memory layer with deep place pages",
      "Production stack: Flutter, NestJS BFF, PostGIS, R2",
    ],
    color: "#c9a227",
    image: "/work/lifemaxxing/01-feed.jpg",
    icon: "/work/icons/lifemaxxing.png",
    coverMode: "cover" as const,
    gallery: [
      "/work/lifemaxxing/01-feed.jpg",
      "/work/lifemaxxing/02-map.jpg",
      "/work/lifemaxxing/03-profile.jpg",
      "/work/lifemaxxing/04-explore.jpg",
      "/work/lifemaxxing/05-places.jpg",
    ],
  },
  {
    slug: "big-red-map",
    title: "Big Red Map",
    category: "Travel · Next.js · Web",
    year: "2026",
    metric: "Hero product",
    tagline: "Live wild. Collect moments. Leave a map.",
    summary:
      "A cinematic map-as-profile product: paint countries red, drop gold memory pins, and leave a public page for the life you’ve lived, phone-first storytelling from day one.",
    result: "Brand system · Launch site · MapLibre · Supabase",
    highlights: [
      "Bold red brand language that reads in one glance",
      "Interactive globe + country paint + gold pins",
      "Optional Lifemaxxing country import for real travel data",
    ],
    color: "#ef1a12",
    image: "/work/bigred-cover.jpg",
    icon: "/work/icons/big-red-map.png",
    coverMode: "cover" as const,
    gallery: [
      "/work/bigred-phone.png",
      "/work/bigred-desk.png",
      "/work/bigred-tokyo.jpg",
      "/work/bigred-login.png",
    ],
  },
  {
    slug: "anita",
    title: "Anita",
    category: "Fintech · AI · iOS / Web",
    year: "2025",
    metric: "In build",
    tagline: "Chat with your money",
    summary:
      "AI-native personal finance companion, conversational money clarity, goals, spending, and optional bank linking via Stripe, synced across SwiftUI iOS and React web.",
    result: "SwiftUI · Express · Supabase · Stripe · PostHog",
    highlights: [
      "Chat-first finance UX instead of spreadsheet dashboards",
      "Stripe Financial Connections for real bank data",
      "Native iOS + web parity on one backend",
    ],
    color: "#9fe870",
    image: "/work/anita/01-hero.png",
    icon: "/work/icons/anita.png",
    coverMode: "cover" as const,
    gallery: [
      "/work/anita/02-ai-assistant.png",
      "/work/anita/03-overview.png",
      "/work/anita/04-categories.jpg",
      "/work/anita/05-limits-goals.png",
      "/work/anita/06-assets.png",
      "/work/anita/01-hero.png",
    ],
  },
  {
    slug: "mitkovt",
    title: "Mitkovt Coaching",
    category: "Brand · Performance web",
    year: "2024",
    metric: "Brand site",
    tagline: "Built through experience. Driven by discipline.",
    summary:
      "High-contrast coaching brand and conversion landing for Slobodan Mitkov, athletic visual system, DE/EN, PayPal/SEPA checkout paths, and German legal pages.",
    result: "Landing · Visual identity · Checkout",
    highlights: [
      "Hard athletic brand presence without template fluff",
      "Bilingual DE/EN conversion flow",
      "Payment + WhatsApp paths wired for real clients",
    ],
    color: "#1d1d1f",
    image: "/work/mitkovt-hero.jpg",
    icon: "/work/mitkovt-hero.jpg",
    coverMode: "cover" as const,
    gallery: ["/work/mitkovt-hero.jpg", "/work/mitkovt-stage.jpg"],
  },
];

export const stats = [
  { value: "20+", label: "Projects delivered" },
  { value: "170+", label: "Markets" },
  { value: "40+", label: "Systems wired" },
  { value: "4.9", label: "Client rating" },
  { value: "1 day", label: "Typical reply" },
];

/** Aggregate people on live products (Lifemaxxing and related ships). */
export const liveUsersCount = 5000;

/** Production systems & APIs across shipped work (see capabilities). */
export const systemsWiredCount = 40;

/** Home showcases. Mitkovt off; BRM last in the Music queue. */
export const featuredCases = [
  cases.find((c) => c.slug === "lifemaxxing")!,
  cases.find((c) => c.slug === "anita")!,
  cases.find((c) => c.slug === "big-red-map")!,
];

export const team = [
  {
    name: "Misha Dzhuran",
    role: "Product design & development",
    focus: "Apps, websites, and calm market releases",
  },
];
