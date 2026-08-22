// Frontmatter-driven post index.
//
// Replaces the hand-maintained `app/posts.json`. The filesystem is walked once
// per process; each post file's `post` export is read, validated and enriched
// with a read time computed from the MDX body. A malformed or unknown-series
// post throws at build time instead of silently disappearing from the site.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

import { calculateReadTime } from "@/app/author";
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

/** Posts still live next to their route. Moving them is a later, riskier step. */
const POSTS_ROOT = join(process.cwd(), "app", "(post)", "2026");
const POST_FILE = "page.mdx";
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
      `missing \`${POST_EXPORT} = { ... }\` export`,
    );
  }

  const openAt = source.indexOf("{", declarationAt);
  if (openAt === -1) {
    throw new PostValidationError(
      file,
      "`post` export is not an object literal",
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
            `\`post\` export is not a valid object literal (${(error as Error).message})`,
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
  file: string,
): string {
  const value = raw[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new PostValidationError(
      file,
      `\`${key}\` must be a non-empty string`,
    );
  }
  return value;
}

function optionalString(
  raw: Record<string, unknown>,
  key: string,
  file: string,
): string | undefined {
  const value = raw[key];
  if (value === undefined) return undefined;
  if (typeof value !== "string" || value.trim() === "") {
    throw new PostValidationError(
      file,
      `\`${key}\`, when present, must be a non-empty string`,
    );
  }
  return value;
}

/** Hand-rolled validator — no new dependency, fails loudly and by file name. */
function validateFrontmatter(
  raw: unknown,
  file: string,
  expectedSlug: string,
): PostFrontmatter {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new PostValidationError(file, "`post` export must be an object");
  }

  const input = raw as Record<string, unknown>;
  const slug = requireString(input, "slug", file);
  if (slug !== expectedSlug) {
    throw new PostValidationError(
      file,
      `slug "${slug}" does not match folder "${expectedSlug}"`,
    );
  }

  const date = requireString(input, "date", file);
  if (!ISO_DATE_RE.test(date) || Number.isNaN(Date.parse(date))) {
    throw new PostValidationError(
      file,
      `\`date\` must be a real YYYY-MM-DD date (got "${date}")`,
    );
  }

  const status = requireString(input, "status", file) as PostStatus;
  if (!POST_STATUSES.includes(status)) {
    throw new PostValidationError(
      file,
      `\`status\` must be one of ${POST_STATUSES.join(" | ")} (got "${status}")`,
    );
  }

  const series = optionalString(input, "series", file);
  if (series && !getSeriesConfig(series)) {
    throw new PostValidationError(
      file,
      `unknown series "${series}" — add it to app/series.ts`,
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
        "`tags` must contain non-empty strings only",
      );
    }
    return tag;
  });

  const canonical = optionalString(input, "canonical", file);
  if (canonical && !ABSOLUTE_URL_RE.test(canonical)) {
    throw new PostValidationError(
      file,
      `\`canonical\` must be an absolute http(s) URL (got "${canonical}")`,
    );
  }

  return {
    slug,
    title: requireString(input, "title", file),
    description: requireString(input, "description", file),
    date,
    series,
    tags,
    status,
    cover: optionalString(input, "cover", file),
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

function readPostDirectories(): string[] {
  if (!existsSync(POSTS_ROOT)) return [];
  return readdirSync(POSTS_ROOT).filter(entry => {
    const file = join(POSTS_ROOT, entry, POST_FILE);
    return statSync(join(POSTS_ROOT, entry)).isDirectory() && existsSync(file);
  });
}

function buildIndex(): IndexedPost[] {
  const posts = readPostDirectories().map((slug): IndexedPost => {
    const file = join(POSTS_ROOT, slug, POST_FILE);
    const source = readFileSync(file, "utf8");
    const frontmatter = validateFrontmatter(
      extractPostExport(source, file),
      file,
      slug,
    );
    const body = extractBody(source);

    return {
      ...frontmatter,
      id: frontmatter.slug,
      tags: frontmatter.tags ?? [],
      year: postYear(frontmatter.date),
      readTime: calculateReadTime(body),
      excerpt: frontmatter.description,
      body,
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
    post => post.status === "published" || INCLUDE_DRAFTS,
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
