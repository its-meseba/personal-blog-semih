import { atomAlternateTypes } from "@/lib/feed-links";
import { blogSchema, breadcrumbSchema } from "../structured-data";
import {
  OG_DEFAULT_IMAGE,
  SITE_NAME,
  SITE_SUBJECT,
  SITE_URL,
} from "../author";
import { JsonLd } from "../components/JsonLd";

export const metadata = {
  title: "Thoughts",
  // One source: `app/author.ts`.
  description: `${SITE_SUBJECT}, by ${SITE_NAME}.`,
  // A page that declares its own `openGraph` replaces the root one wholesale,
  // images included — so the site-wide card has to be restated here.
  openGraph: {
    title: `Thoughts | ${SITE_NAME}`,
    description: SITE_SUBJECT,
    url: `${SITE_URL}/thoughts`,
    type: "website",
    images: [
      {
        url: OG_DEFAULT_IMAGE,
        width: 1200,
        height: 630,
        alt: `Thoughts | ${SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Thoughts | ${SITE_NAME}`,
    description: SITE_SUBJECT,
    images: [OG_DEFAULT_IMAGE],
  },
  alternates: {
    canonical: `${SITE_URL}/thoughts`,
    // The writing index is where a reader looks for the feed; declaring
    // `alternates` here would otherwise drop the root layout's autodiscovery.
    types: atomAlternateTypes(),
  },
};

export default function ThoughtsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={blogSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: SITE_NAME, url: SITE_URL },
          { name: "Thoughts", url: `${SITE_URL}/thoughts` },
        ])}
      />
      {children}
    </>
  );
}
