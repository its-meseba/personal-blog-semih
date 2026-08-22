import { atomAlternateTypes } from "@/lib/feed-links";
import { blogSchema, breadcrumbSchema } from "../structured-data";
import { SITE_NAME, SITE_SUBJECT, SITE_URL } from "../author";
import { JsonLd } from "../components/JsonLd";

export const metadata = {
  title: "Thoughts",
  // One source: `app/author.ts`.
  description: `${SITE_SUBJECT}, by ${SITE_NAME}.`,
  openGraph: {
    title: `Thoughts | ${SITE_NAME}`,
    description: SITE_SUBJECT,
    url: `${SITE_URL}/thoughts`,
    type: "website",
  },
  twitter: {
    title: `Thoughts | ${SITE_NAME}`,
    description: SITE_SUBJECT,
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
