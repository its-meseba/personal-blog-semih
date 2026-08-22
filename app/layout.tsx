import "./globals.css";

import Script from "next/script";
import { fontVariables } from "./styles/fonts";
import { themeEffect } from "./theme-effect";
import { Analytics } from "./analytics";
import { Header } from "./header";
import { Footer } from "./footer";
import { doge } from "./doge";
import { generatePersonSchema, generateWebsiteSchema } from "./structured-data";

// Console design system fonts (Sora / Source Serif 4 / JetBrains Mono) are
// declared in `app/styles/fonts.ts` and mounted as CSS variables below.

export const metadata = {
  title: {
    default: "Mehmet Semih Babacan - Software Engineer & Tech Entrepreneur",
    template: "%s | Mehmet Semih Babacan",
  },
  description:
    "Software engineer with 3 years of experience and dual degrees in Computer Science & Industrial Engineering. Ex-CEO of Solace Technology, building AI-native products and scalable systems.",
  keywords: [
    "software engineer",
    "full stack developer",
    "AI engineer",
    "machine learning",
    "TypeScript",
    "Python",
    "React",
    "Next.js",
    "entrepreneur",
    "startup founder",
    "blockchain",
    "smart contracts",
    "Solace Technology",
    "TÜBİTAK",
    "YTU",
    "Istanbul",
  ],
  authors: [{ name: "Mehmet Semih Babacan", url: "https://semihbabacan.com" }],
  creator: "Mehmet Semih Babacan",
  publisher: "Mehmet Semih Babacan",
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
    url: "https://semihbabacan.com",
    siteName: "Mehmet Semih Babacan",
    title: "Mehmet Semih Babacan - Software Engineer & Tech Entrepreneur",
    description:
      "Software engineer with 3 years of experience and dual degrees in Computer Science & Industrial Engineering. Ex-CEO of Solace Technology, building AI-native products and scalable systems.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Mehmet Semih Babacan - Software Engineer & Tech Entrepreneur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mehmet Semih Babacan - Software Engineer & Tech Entrepreneur",
    description:
      "Software engineer with 3 years of experience and dual degrees in Computer Science & Industrial Engineering. Ex-CEO of Solace Technology, building AI-native products and scalable systems.",
    images: ["/opengraph-image"],
    creator: "@semihbabacan",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "https://semihbabacan.com",
    languages: {
      "en-US": "https://semihbabacan.com",
      "tr-TR": "https://semihbabacan.com/tr",
    },
    // Feed autodiscovery. Posts override `canonical` with their own URL.
    types: {
      "application/atom+xml": [
        { url: "/atom", title: "Mehmet Semih Babacan — Atom" },
      ],
    },
  },
  category: "technology",
  metadataBase: new URL("https://semihbabacan.com"),
};

export const viewport = {
  themeColor: [
    // keep in sync with THEME_COLOR in `app/styles/tokens.ts`
    // and the two literals in `app/theme-effect.ts`
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0C0D10" },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generatePersonSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateWebsiteSchema()),
          }}
        />
        <Script
          defer
          data-website-id="dfid_A9kPvyTeUdPL4ekdtY6iX"
          data-domain="mehmetsemihbabacan.com"
          src="https://datafa.st/js/script.js"
          strategy="afterInteractive"
        />
        <link rel="alternate" hrefLang="en" href="https://semihbabacan.com" />
        <link
          rel="alternate"
          hrefLang="tr"
          href="https://semihbabacan.com/tr"
        />
        <meta
          name="google-site-verification"
          content="your-google-verification-code"
        />
        <meta name="msvalidate.01" content="your-bing-verification-code" />
      </head>

      <body className="flex min-h-screen flex-col bg-background text-fg">
        <main className="mx-auto w-full max-w-shell grow px-6 pb-block pt-3 md:pt-6">
          <Header />
          {children}
        </main>

        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
