// SEO Configuration for the entire site

import { atomAlternateTypes } from "@/lib/feed-links";

export const seoConfig = {
  siteName: "Mehmet Semih Babacan",
  siteUrl: "https://semihbabacan.com",
  siteDescription: "Software engineer with 3 years of experience and dual degrees in Computer Science & Industrial Engineering. Ex-CEO of Solace Technology, building AI-native products and scalable systems.",

  // Author information
  author: {
    name: "Mehmet Semih Babacan",
    email: "m.semihbabacan@gmail.com",
    linkedin: "https://linkedin.com/in/mehmetsemihbabacan",
    github: "https://github.com/its-meseba",
    twitter: "@semihbabacan",
    location: "Istanbul, Turkey",
  },

  // Default metadata for pages
  defaultTitle: "Mehmet Semih Babacan - Software Engineer & Tech Entrepreneur",
  titleTemplate: "%s | Mehmet Semih Babacan",

  // Keywords for different page types
  keywords: {
    general: [
      "Mehmet Semih Babacan",
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
      "Istanbul",
      "Turkey"
    ],
    technical: [
      "FastAPI",
      "LangChain",
      "PostgreSQL",
      "Docker",
      "CI/CD",
      "WebSockets",
      "Flutter",
      "Go",
      "Solidity",
      "Hyperledger Fabric",
      "TensorRT",
      "TKDNN",
      "YOLOv4",
      "computer vision"
    ],
    business: [
      "Solace Technology",
      "Ensi",
      "EMA",
      "TÜBİTAK",
      "STAR program",
      "startup funding",
      "product launch",
      "team leadership",
      "go-to-market",
      "B2B AI",
      "smart home",
      "conversational AI"
    ]
  },

  // Open Graph defaults
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Mehmet Semih Babacan",
    images: {
      default: "/opengraph-image",
      width: 1200,
      height: 630,
    }
  },

  // Twitter defaults
  twitter: {
    card: "summary_large_image",
    creator: "@semihbabacan",
    site: "@semihbabacan",
  },

  // Verification codes (to be replaced with actual codes)
  verification: {
    google: "your-google-verification-code",
    bing: "your-bing-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },

  // Robots configuration for different environments
  robots: {
    production: {
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
    development: {
      index: false,
      follow: false,
    }
  },

  // AI and LLM specific configuration
  ai: {
    allowedBots: [
      'GPTBot',
      'ChatGPT-User',
      'CCBot',
      'Claude-Web',
      'anthropic-ai',
      'Perplexity',
      'Bard',
      'YouBot'
    ],
    contentTypes: [
      'article',
      'thoughts',
      'portfolio',
      'resume',
      'about',
      'technical documentation'
    ]
  }
};

// Helper function to generate page-specific metadata
export function generatePageMetadata({
  title,
  description,
  path = "",
  keywords = [],
  type = "website",
  image,
}: {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
  type?: string;
  image?: string;
}) {
  const url = `${seoConfig.siteUrl}${path}`;
  const pageDescription = description || seoConfig.siteDescription;
  const pageKeywords = [...seoConfig.keywords.general, ...keywords];

  return {
    title,
    description: pageDescription,
    keywords: pageKeywords,
    canonical: url,
    openGraph: {
      title,
      description: pageDescription,
      url,
      type,
      images: [
        {
          url: image || seoConfig.openGraph.images.default,
          width: seoConfig.openGraph.images.width,
          height: seoConfig.openGraph.images.height,
          alt: title,
        }
      ],
    },
    twitter: {
      title,
      description: pageDescription,
      images: [image || seoConfig.openGraph.images.default],
    },
    alternates: {
      canonical: url,
      // Keep feed autodiscovery alive on any page built through this helper.
      types: atomAlternateTypes(),
    },
  };
}
