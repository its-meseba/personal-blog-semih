// Author + site identity configuration.
//
// SINGLE SOURCE OF TRUTH for who this site is by and what it is about.
// `SITE_DESCRIPTION` used to be copy-pasted into five files (seo-config,
// structured-data, layout metadata twice, manifest) and drifted: four of them
// still called him a software engineer. Everything now reads from here, so the
// positioning can only be changed in one place.

import { OG_DEFAULT_IMAGE, SITE_URL } from "@/lib/post-types";

export const SITE_NAME = "Mehmet Semih Babacan";
export { OG_DEFAULT_IMAGE, SITE_URL };

/** The one-line positioning. Rendered under the name on bylines. */
export const ROLE = "AI Technical Product Manager";

/**
 * The site description, in his voice. Used verbatim as the meta description,
 * the OpenGraph/Twitter description, the PWA manifest description and the
 * schema.org Person description. Keep it under ~160 characters so search
 * engines quote it whole instead of truncating it.
 */
export const SITE_DESCRIPTION =
  "AI Technical Product Manager. Ex-CEO of Solace Technology. I build AI-native products and write about how they actually get built — agents, harnesses, lean teams.";

/** Title of the site itself, and the fallback title of any untitled page. */
export const SITE_TITLE = `${SITE_NAME} — ${ROLE}`;

/** What the writing is about. One line, for feeds and answer engines. */
export const SITE_SUBJECT =
  "Essays on AI products, agents and building software";

export const author = {
  name: SITE_NAME,
  handle: "@its_meseba",
  avatar: "/avatar.jpg", // Add your avatar image to public folder
  /** Short role line — the positioning. Rendered under the name on bylines. */
  role: ROLE,
  bio: SITE_DESCRIPTION,
  links: {
    twitter: "https://x.com/its_meseba",
    linkedin: "https://www.linkedin.com/in/mehmetsemihbabacan",
    github: "https://github.com/its-meseba",
  },
};

/**
 * Profiles that prove this Person is the same person elsewhere. Google reads
 * `sameAs` to reconcile an author across the web, so every entry must be a
 * profile he actually controls — never an aspirational one.
 */
export const AUTHOR_SAME_AS = [
  author.links.linkedin,
  author.links.github,
  author.links.twitter,
];

// Calculate estimated reading time based on word count
export const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};
