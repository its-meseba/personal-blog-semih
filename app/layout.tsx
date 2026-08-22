import "./globals.css";

import Script from "next/script";
import { fontVariables } from "./styles/fonts";
import { atomAlternateTypes } from "@/lib/feed-links";
import { THEME_COLOR } from "./styles/tokens";
import { themeEffect } from "./theme-effect";
import { Analytics } from "./analytics";
import { Header } from "./header";
import { Footer } from "./footer";
import { RouteMotion } from "./components/route-motion";
import { doge } from "./doge";
import {
  OG_DEFAULT_IMAGE,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
  author,
} from "./author";

// "Fire max" fonts (Archivo / Source Serif 4 / JetBrains Mono) are declared
// in `app/styles/fonts.ts` and mounted as CSS variables below.

export const metadata = {
  title: {
    default: SITE_TITLE,
    template: "%s | Mehmet Semih Babacan",
  },
  // Every description on this page comes from `app/author.ts`. It used to be
  // pasted here three times and drifted out of date in all three.
  description: SITE_DESCRIPTION,
  keywords: [
    "Mehmet Semih Babacan",
    "AI technical product manager",
    "AI product management",
    "AI agents",
    "agentic coding",
    "LLM products",
    "developer tooling",
    "TypeScript",
    "Next.js",
    "Solace Technology",
    "Istanbul",
  ],
  authors: [{ name: author.name, url: SITE_URL }],
  creator: author.name,
  publisher: author.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: author.name,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_DEFAULT_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_DEFAULT_IMAGE],
    creator: "@semihbabacan",
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-US": SITE_URL,
      "tr-TR": `${SITE_URL}/tr`,
    },
    // Feed autodiscovery. Posts override `canonical` with their own URL.
    types: atomAlternateTypes(),
  },
  category: "technology",
  metadataBase: new URL(SITE_URL),
};

export const viewport = {
  themeColor: [
    // sourced from `app/styles/tokens.ts`; the two literals in
    // `app/theme-effect.ts` must match (it is inlined and cannot import)
    { media: "(prefers-color-scheme: light)", color: THEME_COLOR.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLOR.dark },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontVariables} font-display antialiased`}
      suppressHydrationWarning={true}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(${themeEffect.toString()})();(${doge.toString()})();`,
          }}
        />
        <Script
          defer
          data-website-id="dfid_A9kPvyTeUdPL4ekdtY6iX"
          data-domain="mehmetsemihbabacan.com"
          src="https://datafa.st/js/script.js"
          strategy="afterInteractive"
        />
        <link rel="alternate" hrefLang="en" href={SITE_URL} />
        <link
          rel="alternate"
          hrefLang="tr"
          href={`${SITE_URL}/tr`}
        />
        {/* Sitemap autodiscovery, alongside the Atom feed declared above. */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </head>

      <body className="flex min-h-screen flex-col bg-background text-fg">
        <main className="mx-auto w-full max-w-shell grow px-6 pb-block pt-3 md:pt-6">
          {/* The masthead sits outside `RouteMotion` on purpose: it is the
              fixed point the page turns around, so it must not fade. */}
          <Header />
          <RouteMotion>{children}</RouteMotion>
        </main>

        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
