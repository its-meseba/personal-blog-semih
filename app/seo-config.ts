// SEO Configuration for the entire site

import { atomAlternateTypes } from "@/lib/feed-links";
import {
  ROLE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  author,
} from "./author";

export const seoConfig = {
  siteName: SITE_NAME,
  siteUrl: SITE_URL,
  // One source: `app/author.ts`. Never retype the description here.
  siteDescription: SITE_DESCRIPTION,

  // Author information
  author: {
    name: author.name,
    email: "m.semihbabacan@gmail.com",
    linkedin: author.links.linkedin,
    github: author.links.github,
    twitter: "@semihbabacan",
    location: "Istanbul, Turkey",
  },

  // Default metadata for pages
  defaultTitle: SITE_TITLE,
  titleTemplate: `%s | ${SITE_NAME}`,
  role: ROLE,

  // Keywords for different page types
  keywords: {
    general: [
      "Mehmet Semih Babacan",
      "AI technical product manager",
      "AI product management",
      "AI agents",
      "agentic coding",
      "TypeScript",
      "Python",
      "React",
      "Next.js",
      "entrepreneur",
      "developer tooling",
      "LLM products",
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
    siteName: SITE_NAME,
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
