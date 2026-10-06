// The home page IS the about page: one URL, no redirect hop. `/about` is a
// permanent redirect to `/` (next.config.js), so only `/` claims the canonical.
import Home from "./about/page.mdx";
import { OG_DEFAULT_IMAGE, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "./author";
import { atomAlternateTypes } from "@/lib/feed-links";

export const metadata = {
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
    types: atomAlternateTypes(),
  },
  openGraph: {
    type: "profile",
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: OG_DEFAULT_IMAGE, width: 1200, height: 630, alt: SITE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_DEFAULT_IMAGE],
  },
};

export default Home;
