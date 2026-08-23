// Frontmatter-driven post index.
//
// Replaces the hand-maintained `app/posts.json`. The filesystem is walked once
// per process; each post file's `post` export is read, validated and enriched
// with a read time computed from the MDX body. A malformed or unknown-series
// post throws at build time instead of silently disappearing from the site.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

import { calculateReadTime } from "@/app/author";
import { stripJsxBlocks } from "./markdown-to-html";
import { getSeriesConfig, type Series } from "@/app/series";
import {
  ABSOLUTE_URL_RE,
  ISO_DATE_RE,
  POST_STATUSES,
  type IndexedPost,
  type PostFrontmatter,
  type PostStatus,
  postYear,
} from "./post-types";

/**
 * Posts still live next to their route: `app/(post)/<year>/<slug>/page.mdx`.
 * The year FOLDER is the URL year, so every 4-digit folder is discovered.
 * Hardcoding one year silently hides next year's posts from the index while
 * Next.js still serves their route — a 404 nobody notices.
 */
const POSTS_ROOT = join(process.cwd(), "app", "(post)");
/** A post year folder. Everything else under `(post)` is route plumbing. */
const YEAR_DIR_RE = /^\d{4}$/;
const POST_FILE = "page.mdx";
/** `cover` paths are site-absolute; the file behind one lives here. */
const PUBLIC_ROOT = join(process.cwd(), "public");
const POST_EXPORT = "export const post";

/** Drafts are readable while writing, invisible to the public site. */
const INCLUDE_DRAFTS = process.env.NODE_ENV !== "production";

let cachedIndex: IndexedPost[] | null = null;

class PostValidationError extends Error {
  constructor(file: string, message: string) {
    super(`Invalid post metadata in ${file}: ${message}`);
    this.name = "PostValidationError";
  }
}

/**
 * Extracts the object literal assigned to `export const post` and evaluates it.
 * The literal is plain data written by us, so a Function eval is enough and
 * avoids pulling a parser dependency into the build.
 */
function extractPostExport(source: string, file: string): unknown {
  const declarationAt = source.indexOf(POST_EXPORT);
  if (declarationAt === -1) {
    throw new PostValidationError(
      file,
      `missing \`${POST_EXPORT} = { ... }\` export`
    );
  }

  const openAt = source.indexOf("{", declarationAt);
  if (openAt === -1) {
    throw new PostValidationError(
      file,
      "`post` export is not an object literal"
    );
  }

  let depth = 0;
  let quote: string | null = null;
  let escaped = false;

  for (let i = openAt; i < source.length; i++) {
    const char = source[i];

    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = null;
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === "{") depth++;
    else if (char === "}") {
      depth--;
      if (depth === 0) {
        const literal = source.slice(openAt, i + 1);
        try {
          // eslint-disable-next-line no-new-func
          return new Function(`return (${literal});`)();
        } catch (error) {
          throw new PostValidationError(
            file,
            `\`post\` export is not a valid object literal (${
              (error as Error).message
            })`
          );
        }
      }
    }
  }

  throw new PostValidationError(file, "unterminated `post` object literal");
}

function requireString(
  raw: Record<string, unknown>,
  key: string,
  file: string
): string {
  const value = raw[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new PostValidationError(
      file,
      `\`${key}\` must be a non-empty string`
    );
  }
  return value;
}

function optionalString(
  raw: Record<string, unknown>,
  key: string,
  file: string
): string | undefined {
  const value = raw[key];
  if (value === undefined) return undefined;
  if (typeof value !== "string" || value.trim() === "") {
    throw new PostValidationError(
      file,
      `\`${key}\`, when present, must be a non-empty string`
    );
  }
  return value;
}

/** Hand-rolled validator — no new dependency, fails loudly and by file name. */
function validateFrontmatter(
  raw: unknown,
  file: string,
  expectedSlug: string,
  expectedYear: string
): PostFrontmatter {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new PostValidationError(file, "`post` export must be an object");
  }

  const input = raw as Record<string, unknown>;
  const slug = requireString(input, "slug", file);
  if (slug !== expectedSlug) {
    throw new PostValidationError(
      file,
      `slug "${slug}" does not match folder "${expectedSlug}"`
    );
  }

  const date = requireString(input, "date", file);
  if (!ISO_DATE_RE.test(date) || Number.isNaN(Date.parse(date))) {
    throw new PostValidationError(
      file,
      `\`date\` must be a real YYYY-MM-DD date (got "${date}")`
    );
  }

  // The folder decides the URL (`/<year>/<slug>`), the date decides how the
  // post is displayed and sorted. If they disagree, the post is linked at a
  // year Next.js has no route for and 404s in silence. Fail the build instead.
  if (postYear(date) !== expectedYear) {
    throw new PostValidationError(
      file,
      `year mismatch: the post lives in folder "${expectedYear}" (so its URL is ` +
        `/${expectedYear}/${expectedSlug}) but \`date\` is "${date}" (year ` +
        `"${postYear(date)}"). Move the post to app/(post)/${postYear(
          date
        )}/${expectedSlug}/ ` +
        `or change \`date\` to a ${expectedYear} date — a URL year and a date ` +
        `year that disagree produce a link that 404s.`
    );
  }

  const status = requireString(input, "status", file) as PostStatus;
  if (!POST_STATUSES.includes(status)) {
    throw new PostValidationError(
      file,
      `\`status\` must be one of ${POST_STATUSES.join(" | ")} (got "${status}")`
    );
  }

  const series = optionalString(input, "series", file);
  if (series && !getSeriesConfig(series)) {
    throw new PostValidationError(
      file,
      `unknown series "${series}" — add it to app/series.ts`
    );
  }

  const tagsInput = input.tags;
  if (tagsInput !== undefined && !Array.isArray(tagsInput)) {
    throw new PostValidationError(file, "`tags` must be an array of strings");
  }
  const tags = ((tagsInput as unknown[]) ?? []).map(tag => {
    if (typeof tag !== "string" || tag.trim() === "") {
      throw new PostValidationError(
        file,
        "`tags` must contain non-empty strings only"
      );
    }
    return tag;
  });

  const canonical = optionalString(input, "canonical", file);
  if (canonical && !ABSOLUTE_URL_RE.test(canonical)) {
    throw new PostValidationError(
      file,
      `\`canonical\` must be an absolute http(s) URL (got "${canonical}")`
    );
  }

  // `updated` is a claim made to readers and to search engines, so it is held
  // to the same shape as `date` and may never predate publication.
  const updated = optionalString(input, "updated", file);
  if (updated !== undefined) {
    if (!ISO_DATE_RE.test(updated) || Number.isNaN(Date.parse(updated))) {
      throw new PostValidationError(
        file,
        `\`updated\` must be a real YYYY-MM-DD date (got "${updated}")`
      );
    }
    if (updated < date) {
      throw new PostValidationError(
        file,
        `\`updated\` ("${updated}") is earlier than \`date\` ("${date}") — a ` +
          `post cannot be revised before it was published. Fix whichever of ` +
          `the two is wrong, or drop \`updated\` if the post has never been ` +
          `substantively revised.`
      );
    }
  }

  const cover = optionalString(input, "cover", file);
  if (cover !== undefined) {
    if (!cover.startsWith("/")) {
      throw new PostValidationError(
        file,
        `\`cover\` must be a site-absolute path starting with "/" (got ` +
          `"${cover}")`
      );
    }
    // A typo here would ship a hero that 404s for every reader, so the build
    // proves the file exists instead of trusting the string.
    const coverFile = join(PUBLIC_ROOT, cover);
    if (!existsSync(coverFile)) {
      throw new PostValidationError(
        file,
        `\`cover\` points at "${cover}" but no file exists at ` +
          `public${cover}. Add the image or fix the path.`
      );
    }
  }

  return {
    slug,
    title: requireString(input, "title", file),
    description: requireString(input, "description", file),
    date,
    updated,
    series,
    tags,
    status,
    cover,
    canonical,
  };
}

/**
 * Strips ESM statements and JSX-only lines so the read time and the feed see
 * prose, not module plumbing.
 */
export function extractBody(source: string): string {
  const lines = source.split("\n");
  const body: string[] = [];

  let depth = 0;
  let inModuleBlock = false;
  let inFence = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Code fences hold `import`/`export` samples that are prose, not modules.
    if (!inModuleBlock && trimmed.startsWith("```")) {
      inFence = !inFence;
      body.push(line);
      continue;
    }

    if (inFence) {
      body.push(line);
      continue;
    }

    if (
      !inModuleBlock &&
      (trimmed.startsWith("import ") || trimmed.startsWith("export "))
    ) {
      inModuleBlock = true;
      depth = 0;
    }

    if (inModuleBlock) {
      for (const char of line) {
        if (char === "{") depth++;
        else if (char === "}") depth--;
      }
      if (depth <= 0) inModuleBlock = false;
      continue;
    }

    body.push(line);
  }

  return body.join("\n").trim();
}

/** One post on disk: the year folder that owns its URL, plus its slug folder. */
type PostLocation = { year: string; slug: string };

function isDirectory(path: string): boolean {
  return existsSync(path) && statSync(path).isDirectory();
}

/** Every `app/(post)/<year>/<slug>/page.mdx`, for ANY 4-digit year folder. */
function readPostDirectories(): PostLocation[] {
  if (!existsSync(POSTS_ROOT)) return [];

  const locations: PostLocation[] = [];

  for (const year of readdirSync(POSTS_ROOT)) {
    if (!YEAR_DIR_RE.test(year)) continue;
    const yearDir = join(POSTS_ROOT, year);
    if (!isDirectory(yearDir)) continue;

    for (const slug of readdirSync(yearDir)) {
      if (!isDirectory(join(yearDir, slug))) continue;
      if (!existsSync(join(yearDir, slug, POST_FILE))) continue;
      locations.push({ year, slug });
    }
  }

  return locations;
}

function buildIndex(): IndexedPost[] {
  const posts = readPostDirectories().map(({ year, slug }): IndexedPost => {
    const file = join(POSTS_ROOT, year, slug, POST_FILE);
    const source = readFileSync(file, "utf8");
    const frontmatter = validateFrontmatter(
      extractPostExport(source, file),
      file,
      slug,
      year
    );
    const body = extractBody(source);

    return {
      ...frontmatter,
      id: frontmatter.slug,
      tags: frontmatter.tags ?? [],
      // The folder is the URL year. `validateFrontmatter` has already proven
      // the date agrees with it, so the two can never drift apart.
      year,
      // Prose only: a <Diagram> body is inline SVG markup, not words to read.
      // Same stripper the feed uses, so the two never disagree.
      readTime: calculateReadTime(stripJsxBlocks(body)),
      excerpt: frontmatter.description,
      body,
      // Author-declared, never inferred. A file's mtime or last commit says
      // "someone touched this", which a metadata migration does to every post
      // at once; only the author knows whether the PROSE changed. Absent
      // `updated`, the honest answer is the publish date.
      dateModified: frontmatter.updated ?? frontmatter.date,
    };
  });

  return posts.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

/** Every post on disk, drafts included. Cached per process. */
export function getAllPosts(): IndexedPost[] {
  if (cachedIndex === null) cachedIndex = buildIndex();
  return cachedIndex;
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
