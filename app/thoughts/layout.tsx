import { atomAlternateTypes } from "@/lib/feed-links";
import { generateThoughtsSchema } from "../structured-data";

export const metadata = {
  title: "Thoughts",
  description: "Insights on software engineering, AI, entrepreneurship, and technology innovation by Mehmet Semih Babacan",
  openGraph: {
    title: "Thoughts | Mehmet Semih Babacan",
    description: "Insights on software engineering, AI, entrepreneurship, and technology innovation",
    url: "https://semihbabacan.com/thoughts",
    type: "website",
  },
  twitter: {
    title: "Thoughts | Mehmet Semih Babacan",
    description: "Insights on software engineering, AI, entrepreneurship, and technology innovation",
  },
  alternates: {
    canonical: "https://semihbabacan.com/thoughts",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateThoughtsSchema()),
        }}
      />
      {children}
    </>
  );
}
