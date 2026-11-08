import type { Metadata, Viewport } from "next";
import {
  Caveat,
  Fraunces,
  Instrument_Serif,
  Italianno,
  Outfit,
  Syne,
} from "next/font/google";
import { CustomCursor } from "@/components/layout/ClientChrome";
import { PageLoader } from "@/components/layout/PageLoader";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { site } from "@/data/site";
import "./globals.css";

const display = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  preload: false,
});

const serif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

const editorial = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal"],
  display: "swap",
  preload: false,
});

const hand = Italianno({
  variable: "--font-italianno",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

/** Hero LCP — preload only this script face */
const write = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  preload: true,
});

const body = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.tagline}`,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: `${site.name} · ${site.tagline}`,
    description: site.description,
    type: "website",
    siteName: site.name,
    url: site.url,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · ${site.tagline}`,
    description: site.description,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: site.shortName,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${serif.variable} ${editorial.variable} ${hand.variable} ${write.variable} ${body.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="preload"
          as="image"
          href="/devices/iphone-device-sm.webp"
          type="image/webp"
          fetchPriority="high"
        />
      </head>
      <body className="min-h-full font-body text-text">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2.5 focus:text-[14px] focus:font-semibold focus:text-black focus:shadow-lg"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <PageLoader />
          <CustomCursor />
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
