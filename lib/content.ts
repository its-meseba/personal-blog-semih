// Frontmatter-driven post index — the RUNTIME half.
//
// The site runs on Cloudflare Workers, which has no filesystem, so the index is
// built and validated in Node by `scripts/build-content.ts` (see
// `lib/content-index.ts`) and bundled here as JSON. Restart `pnpm dev` after
// changing a post's `post` export; the MDX body itself hot-reloads as usual.

import generatedPosts from "./generated/posts.json";
import { getSeriesConfig, type Series } from "@/app/series";
import type { IndexedPost } from "./post-types";

/** Drafts are readable while writing, invisible to the public site. */
const INCLUDE_DRAFTS = process.env.NODE_ENV !== "production";

const ALL_POSTS = generatedPosts as IndexedPost[];

/** Every post on disk, drafts included. */
export function getAllPosts(): IndexedPost[] {
  return ALL_POSTS;
}

/**
 * The public index: published posts always, drafts only outside production so
 * they are deliberately hidden rather than accidentally broken.
 */
export function getPosts(): IndexedPost[] {
  return getAllPosts().filter(
    post => post.status === "published" || INCLUDE_DRAFTS
  );
}

/** Published posts only — feeds, sitemap and OG cards use this. */
export function getPublishedPosts(): IndexedPost[] {
  return getAllPosts().filter(post => post.status === "published");
}

export function getPost(slug: string): IndexedPost | undefined {
  return getAllPosts().find(post => post.id === slug);
}

export type SeriesWithPosts = Series & {
  displayName: string;
  posts: IndexedPost[];
};

/** Series that actually have published posts, newest post first. */
export function getSeries(): SeriesWithPosts[] {
  const bySeries = new Map<string, IndexedPost[]>();

  for (const post of getPublishedPosts()) {
    if (!post.series) continue;
    const bucket = bySeries.get(post.series) ?? [];
    bucket.push(post);
    bySeries.set(post.series, bucket);
  }

  const result: SeriesWithPosts[] = [];
  for (const [displayName, posts] of bySeries) {
    const config = getSeriesConfig(displayName);
    if (!config) continue;
    result.push({ ...config, displayName, posts });
  }

  return result.sort((a, b) => a.name.localeCompare(b.name));
}

export function getSeriesBySlug(slug: string): SeriesWithPosts | undefined {
  return getSeries().find(series => series.id === slug);
}

/** One rung of a series' reading path: the post, and why it's here. */
export type ReadingOrderEntry = { post: IndexedPost; reason: string };

export type SeriesReadingPlan = {
  /**
   * The curated path, in the order declared by `app/series.ts`'s `order`.
   * Empty when the series has no curated order — see `isCurated`.
   */
  startHere: ReadingOrderEntry[];
  /**
   * Everything not in `startHere`, reverse-chronological (newest first) —
   * the site's usual list order, for a reader who has read the curated path
   * and wants the rest.
   */
  rest: IndexedPost[];
  /**
   * False when `app/series.ts` declares no `order` for this series. The
   * caller should not present `startHere` as a judged curriculum in that
   * case — see the series page, which relabels it "chronological" and
   * drops the per-entry reasons instead of inventing them.
   */
  isCurated: boolean;
};

/**
 * Turns a series' posts into a reading path. A declared `order` wins;
 * absent that, the whole series falls back to chronological-ascending
 * (oldest first, no `rest` bucket) rather than a guessed curriculum — see
 * the comment on `Series["order"]` in `app/series.ts`.
 */
export function getSeriesReadingPlan(
  series: SeriesWithPosts
): SeriesReadingPlan {
  if (series.order && series.order.length > 0) {
    const byId = new Map(series.posts.map(post => [post.id, post]));

    const startHere = series.order
      .map(slug => byId.get(slug))
      .filter((post): post is IndexedPost => post !== undefined)
      .map(post => ({
        post,
        reason: series.orderReasons?.[post.id] ?? "",
      }));

    const startHereIds = new Set(startHere.map(entry => entry.post.id));
    // `series.posts` is already reverse-chronological (see `getSeries`), so
    // filtering preserves that order for the leftovers.
    const rest = series.posts.filter(post => !startHereIds.has(post.id));

    return { startHere, rest, isCurated: true };
  }

  const chronological = [...series.posts].sort(
    (a, b) => Date.parse(a.date) - Date.parse(b.date)
  );

  return {
    startHere: chronological.map(post => ({ post, reason: "" })),
    rest: [],
    isCurated: false,
  };
}
