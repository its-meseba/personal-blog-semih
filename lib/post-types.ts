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
  /**
   * Absolute URL of the ORIGINAL publication, for the rare post that appeared
   * somewhere else first. Set it and this site stops claiming authorship in
   * search: the page's `<link rel="canonical">` points at the other URL.
   *
   * Leave it out for everything written here — omitted means self-canonical,
   * which is what every post should be. Mirrors (Substack, LinkedIn, dev.to)
   * are NOT a reason to set this: the site is the source of truth, so the
   * mirror carries our canonical, never the other way round.
   */
  canonical?: string;
};

/** A validated post plus everything derived from the file. */
export type IndexedPost = Required<
  Pick<PostFrontmatter, "slug" | "title" | "description" | "date" | "status">
> &
  Pick<PostFrontmatter, "series" | "cover" | "canonical"> & {
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

/** Year read out of a post's date. Only a fallback — the folder is the truth. */
export function postYear(date: string): string {
  return date.slice(0, 4);
}

/** Enough of a post to build its URL: the folder year when we have it. */
export type PostLink = Pick<PostFrontmatter, "slug" | "date"> & {
  /** URL year, taken from the `app/(post)/<year>/` folder the post lives in. */
  year?: string;
};

/**
 * Canonical path for a post: `/<year>/<slug>`. Never changes shape.
 *
 * `year` comes from the post's folder, which is what Next.js actually routes.
 * The date-derived fallback is only for the rare caller holding raw
 * frontmatter; `lib/content.ts` fails the build if the two ever disagree.
 */
export function postPath(post: PostLink): string {
  return `/${post.year ?? postYear(post.date)}/${post.slug}`;
}

export function postUrl(post: PostLink): string {
  return `${SITE_URL}${postPath(post)}`;
}

/**
 * Where this post's search credit belongs: its own URL, unless the post
 * declares that it was first published elsewhere.
 */
export function postCanonicalUrl(
  post: PostLink & Pick<PostFrontmatter, "canonical">
): string {
  return post.canonical ?? postUrl(post);
}

/** A `canonical` override must be an absolute http(s) URL, or it is a typo. */
export const ABSOLUTE_URL_RE = /^https?:\/\/[^\s]+$/;

/** Per-post OG card route. Every published post has one. */
export function postOgPath(slug: string): string {
  return `/og/${slug}`;
}
