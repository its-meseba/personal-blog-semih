// Shared post metadata contract.
//
// Single source of truth: every post file exports one `post` object shaped like
// `PostFrontmatter`. `lib/content.ts` reads those objects off disk at build time
// and turns them into the site index. Nothing else may declare a post.

export const POST_STATUSES = ["published", "draft"] as const;

export type PostStatus = (typeof POST_STATUSES)[number];

/** What a post file declares about itself. */
export type PostFrontmatter = {
  /** URL slug; must match the folder name. */
  slug: string;
  title: string;
  description: string;
  /** ISO date, `YYYY-MM-DD`. Owns the canonical URL year. */
  date: string;
  /** Display name of a series declared in `app/series.ts`. */
  series?: string;
  tags?: string[];
  status: PostStatus;
  /** Optional cover image, site-absolute (`/images/blog/<slug>/cover.png`). */
  cover?: string;
};

/** A validated post plus everything derived from the file. */
export type IndexedPost = Required<Pick<PostFrontmatter, "slug" | "title" | "description" | "date" | "status">> &
  Pick<PostFrontmatter, "series" | "cover"> & {
    /** Alias of `slug`; the historical field name used across the app. */
    id: string;
    tags: string[];
    /** Canonical URL year, derived from `date` — never hardcoded. */
    year: string;
    /** Computed from the MDX body, not hand-maintained. */
    readTime: string;
    /** Card summary; falls back to `description`. */
    excerpt: string;
    /** Raw MDX body with exports/imports stripped — used by the feeds. */
    body: string;
  };

export const SITE_URL = "https://semihbabacan.com";

export const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Canonical year for a post, taken from its date. */
export function postYear(date: string): string {
  return date.slice(0, 4);
}

/** Canonical path for a post: `/<year>/<slug>`. Never changes shape. */
export function postPath(post: Pick<PostFrontmatter, "slug" | "date">): string {
  return `/${postYear(post.date)}/${post.slug}`;
}

export function postUrl(post: Pick<PostFrontmatter, "slug" | "date">): string {
  return `${SITE_URL}${postPath(post)}`;
}

/** Per-post OG card route. Every published post has one. */
export function postOgPath(slug: string): string {
  return `/og/${slug}`;
}
