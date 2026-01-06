import "./globals.css";

import { Inter } from "next/font/google";
import Script from "next/script";
import { themeEffect } from "./theme-effect";
import { Analytics } from "./analytics";
import { Header } from "./header";
import { Footer } from "./footer";
import { doge } from "./doge";
import { generatePersonSchema, generateWebsiteSchema } from "./structured-data";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "Mehmet Semih Babacan - Software Engineer & Tech Entrepreneur",
    template: "%s | Mehmet Semih Babacan"
  },
  description: "Software engineer with 3 years of experience and dual degrees in Computer Science & Industrial Engineering. Ex-CEO of Solace Technology, building AI-native products and scalable systems.",
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
    "Istanbul"
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
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://semihbabacan.com",
    siteName: "Mehmet Semih Babacan",
    title: "Mehmet Semih Babacan - Software Engineer & Tech Entrepreneur",
    description: "Software engineer with 3 years of experience and dual degrees in Computer Science & Industrial Engineering. Ex-CEO of Solace Technology, building AI-native products and scalable systems.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Mehmet Semih Babacan - Software Engineer & Tech Entrepreneur",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mehmet Semih Babacan - Software Engineer & Tech Entrepreneur",
    description: "Software engineer with 3 years of experience and dual degrees in Computer Science & Industrial Engineering. Ex-CEO of Solace Technology, building AI-native products and scalable systems.",
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
      'en-US': 'https://semihbabacan.com',
      'tr-TR': 'https://semihbabacan.com/tr',
    },
  },
  category: 'technology',
  metadataBase: new URL("https://semihbabacan.com"),
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fcfcfc' },
    { media: '(prefers-color-scheme: dark)', color: '#1C1C1C' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.className} antialiased`}
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
        <link rel="canonical" href="https://semihbabacan.com" />
        <link rel="alternate" hrefLang="en" href="https://semihbabacan.com" />
        <link rel="alternate" hrefLang="tr" href="https://semihbabacan.com/tr" />
        <meta name="google-site-verification" content="your-google-verification-code" />
        <meta name="msvalidate.01" content="your-bing-verification-code" />
      </head>

      <body className="dark:text-gray-100 max-w-3xl m-auto">
        <main className="p-6 pt-3 md:pt-6 min-h-screen">
          <Header />
          {children}
        </main>

        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
