// schema.org JSON-LD, in one place.
//
// Rules this file follows, because a wrong node is worse than no node:
//   * Every string comes from `app/author.ts` or from the post index. Nothing
//     about the person is retyped here, so the positioning cannot drift again.
//   * Nothing is invented to satisfy a validator. A field we cannot fill
//     honestly is left out — Google downgrades fabricated markup, and a made-up
//     employer or rating is a lie in machine-readable form.
//   * URLs are absolute. Relative URLs in JSON-LD are undefined behaviour and
//     Google resolves them inconsistently.

import {
  AUTHOR_SAME_AS,
  ROLE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SUBJECT,
  SITE_URL,
} from "./author";
import {
  OG_DEFAULT_IMAGE,
  postOgPath,
  postUrl,
  type IndexedPost,
} from "@/lib/post-types";

/** Site-absolute path to absolute URL. JSON-LD may not carry relative URLs. */
function abs(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

const ABOUT_URL = `${SITE_URL}/about`;
const THOUGHTS_URL = `${SITE_URL}/thoughts`;

/**
 * The author node, reused by every page type so search and answer engines see
 * ONE person rather than a different one per template. `sameAs` is what lets
 * them reconcile the byline with his LinkedIn/GitHub/X profiles.
 */
function personNode() {
  return {
    "@type": "Person",
    name: SITE_NAME,
    url: ABOUT_URL,
    jobTitle: ROLE,
    sameAs: AUTHOR_SAME_AS,
  } as const;
}

/**
 * Publisher of the posts. This is a personal site, so the publisher is the
 * person — there is no organisation behind it and inventing one would be false.
 * `logo` is required by Google when the publisher is an Organization and
 * merely recommended for a Person; it is supplied either way.
 */
function publisherNode() {
  return {
    "@type": "Person",
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: abs("/icon.png"),
    },
  } as const;
}

/** Full Person entity. Home/about only — the identity page of the site. */
export function personSchema() {
  return {
    "@context": "https://schema.org",
    ...personNode(),
    alternateName: "Semih Babacan",
    description: SITE_DESCRIPTION,
    image: abs(OG_DEFAULT_IMAGE),
    alumniOf: [
      {
        "@type": "EducationalOrganization",
        name: "Yıldız Technical University",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Istanbul",
          addressCountry: "TR",
        },
      },
    ],
    knowsAbout: [
      "AI product management",
      "AI agents",
      "Agentic coding",
      "Large language models",
      "Developer tooling",
      "Product strategy",
      "TypeScript",
      "Python",
      "Next.js",
      "Entrepreneurship",
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "Bachelor of Science in Computer Science",
        credentialCategory: "degree",
        educationalLevel: "bachelor",
        recognizedBy: {
          "@type": "EducationalOrganization",
          name: "Yıldız Technical University",
        },
      },
      {
        "@type": "EducationalOccupationalCredential",
        name: "Bachelor of Science in Industrial Engineering",
        credentialCategory: "degree",
        educationalLevel: "bachelor",
        recognizedBy: {
          "@type": "EducationalOrganization",
          name: "Yıldız Technical University",
        },
      },
    ],
    award: [
      "TÜBİTAK 1507 Grant Recipient",
      "STAR Presidential Research Program Participant",
    ],
  };
}

/** The site entity. Home/about only; one WebSite per site, not per page. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: `${SITE_NAME} — ${ROLE}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    author: personNode(),
    publisher: publisherNode(),
    inLanguage: "en-US",
  };
}

/** The writing index at /thoughts. */
export function blogSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${SITE_NAME} — Thoughts`,
    description: SITE_SUBJECT,
    url: THOUGHTS_URL,
    author: personNode(),
    publisher: publisherNode(),
    inLanguage: "en-US",
  };
}

/** What a BlogPosting node needs from a post. A subset of `IndexedPost`. */
export type BlogPostingInput = Pick<
  IndexedPost,
  "slug" | "title" | "description" | "date" | "year" | "dateModified"
> &
  Partial<Pick<IndexedPost, "tags" | "readTime" | "canonical">>;

/**
 * BlogPosting for one post.
 *
 * `dateModified` is the post's author-declared `updated` (`lib/content.ts`),
 * and equals `datePublished` whenever the author has declared no revision —
 * which is the honest default. It is deliberately NOT derived from git or
 * from file mtimes: a repo-wide migration touches every post file at once and
 * would tell Google that ten unchanged articles were all freshly updated.
 *
 * `mainEntityOfPage` and `url` follow the post's canonical, so a piece that was
 * first published elsewhere credits that URL here too — the same rule the
 * `<link rel="canonical">` follows.
 */
export function blogPostingSchema(post: BlogPostingInput) {
  const canonical = post.canonical ?? postUrl(post);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.dateModified,
    author: personNode(),
    publisher: publisherNode(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    url: canonical,
    image: abs(postOgPath(post.slug)),
    isPartOf: {
      "@type": "Blog",
      name: `${SITE_NAME} — Thoughts`,
      url: THOUGHTS_URL,
    },
    inLanguage: "en-US",
    ...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}),
  };
}

/** One rung of a breadcrumb: a label and the page it points at. */
export type Crumb = { name: string; url: string };

/**
 * BreadcrumbList. Google renders it as the path under a result, and answer
 * engines use it to place a page in the site. The last crumb is the page
 * itself, so it carries no `item` — a self-link there is a validator warning.
 */
export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      ...(index < crumbs.length - 1 ? { item: crumb.url } : {}),
    })),
  };
}

/** Home → Thoughts → this post. */
export function postBreadcrumb(post: BlogPostingInput): Crumb[] {
  return [
    { name: SITE_NAME, url: SITE_URL },
    { name: "Thoughts", url: THOUGHTS_URL },
    { name: post.title, url: postUrl(post) },
  ];
}

const SERIES_INDEX_URL = `${SITE_URL}/series`;

/** Home → Series → this series. */
export function seriesBreadcrumb(name: string, url: string): Crumb[] {
  return [
    { name: SITE_NAME, url: SITE_URL },
    { name: "Series", url: SERIES_INDEX_URL },
    { name, url },
  ];
}

/** What the series-listing ItemList needs from a post. A subset of `IndexedPost`. */
export type SeriesListedPost = Pick<
  IndexedPost,
  "slug" | "title" | "year" | "date"
>;

/**
 * CollectionPage + ItemList for a series pillar page. `itemListElement`
 * lists the series' posts in the same order the page renders them (curated
 * "start here" order when the series has one, chronological otherwise —
 * see `getSeriesReadingPlan`), so the markup never claims a reading order
 * the visible page doesn't show.
 *
 * `numberOfItems: 0` with an empty `itemListElement` is the honest markup
 * for a registered series with nothing published yet — not omitted, since
 * zero is a real count here, not a missing one.
 */
export function seriesCollectionSchema(
  series: { name: string; description?: string },
  url: string,
  orderedPosts: SeriesListedPost[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: series.name,
    description: series.description ?? `Posts in the ${series.name} series.`,
    url,
    isPartOf: {
      "@type": "Blog",
      name: `${SITE_NAME} — Thoughts`,
      url: THOUGHTS_URL,
    },
    author: personNode(),
    publisher: publisherNode(),
    inLanguage: "en-US",
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: orderedPosts.length,
      itemListElement: orderedPosts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: postUrl(post),
        name: post.title,
      })),
    },
  };
}
