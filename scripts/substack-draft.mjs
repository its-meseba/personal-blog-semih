#!/usr/bin/env node
// Paste-ready Substack draft for one post.
//
//   node scripts/substack-draft.mjs <slug> [--sections=N] [--words=N]
//
// The site is the source of truth; Substack is a one-way mirror. Substack does
// not let a publisher set a canonical tag, so a full-text copy there competes
// with our own page for the same words on a higher-authority domain. This
// script therefore prints a LEAD-IN (the first N sections) and a link back to
// the canonical URL — never the whole article.
//
// Standalone on purpose: no imports from `lib/` (TypeScript + `@/` path
// aliases need the Next build) and no dependencies. It reads the same
// `export const post` object that `lib/content.ts` reads, so the two agree on
// what a post declares; if that contract changes, change both.

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SITE_URL = "https://semihbabacan.com";
const POSTS_ROOT = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "app",
  "(post)",
  "2026",
);
const POST_FILE = "page.mdx";
const POST_EXPORT = "export const post";

/** How much of the piece the mirror gets before the "read the rest" link. */
const DEFAULT_SECTIONS = 2;
const DEFAULT_MAX_WORDS = 450;

const SECTION_HEADING_RE = /^##\s+/;
const IMAGE_RE = /!\[([^\]]*)\]\(([^)\s]+)\)/g;
const INLINE_JSX_RE = /<\/?[A-Z][A-Za-z0-9]*\b[^>]*>/g;
const RULE = "─".repeat(60);

const EXIT_USAGE = 1;

function fail(message) {
  console.error(`substack-draft: ${message}`);
  process.exit(EXIT_USAGE);
}

function parseArgs(argv) {
  const options = { sections: DEFAULT_SECTIONS, words: DEFAULT_MAX_WORDS };
  let slug = null;

  for (const arg of argv) {
    if (arg.startsWith("--sections=")) {
      options.sections = Number(arg.slice("--sections=".length));
    } else if (arg.startsWith("--words=")) {
      options.words = Number(arg.slice("--words=".length));
    } else if (arg.startsWith("-")) {
      fail(`unknown flag ${arg}`);
    } else if (slug === null) {
      slug = arg;
    } else {
      fail("pass exactly one slug");
    }
  }

  if (!slug) {
    const available = existsSync(POSTS_ROOT) ? readdirSync(POSTS_ROOT).sort() : [];
    fail(
      `usage: node scripts/substack-draft.mjs <slug> [--sections=N] [--words=N]\n` +
        `known slugs:\n  ${available.join("\n  ")}`,
    );
  }
  if (!Number.isInteger(options.sections) || options.sections < 1) {
    fail("--sections must be a positive integer");
  }
  if (!Number.isInteger(options.words) || options.words < 1) {
    fail("--words must be a positive integer");
  }

  return { slug, ...options };
}

/** Same brace-matching read of `export const post` that `lib/content.ts` does. */
function readFrontmatter(source, file) {
  const declarationAt = source.indexOf(POST_EXPORT);
  if (declarationAt === -1) fail(`${file} has no \`${POST_EXPORT}\` export`);

  const openAt = source.indexOf("{", declarationAt);
  let depth = 0;
  let quote = null;
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
    else if (char === "}" && --depth === 0) {
      return new Function(`return (${source.slice(openAt, i + 1)});`)();
    }
  }
  return fail(`${file} has an unterminated \`post\` object literal`);
}

/** Drops ESM statements so what is left is prose. Mirrors `extractBody`. */
function extractBody(source) {
  const out = [];
  let depth = 0;
  let inModuleBlock = false;
  let inFence = false;

  for (const line of source.split("\n")) {
    const trimmed = line.trim();
    if (!inModuleBlock && trimmed.startsWith("```")) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (inFence) {
      out.push(line);
      continue;
    }
    if (!inModuleBlock && (trimmed.startsWith("import ") || trimmed.startsWith("export "))) {
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
    out.push(line);
  }
  return out.join("\n").trim();
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`${name}="([^"]*)"`));
  return match ? match[1] : "";
}

/**
 * Every visual that cannot survive a paste: a rendered `<Diagram>` (inline SVG)
 * and every markdown image (Substack will not hotlink our files reliably).
 * `cut` marks where it sits relative to the lead-in.
 */
function collectVisuals(body, leadInLength) {
  const visuals = [];
  const lines = body.split("\n");
  let offset = 0;

  for (const line of lines) {
    const position = offset;
    offset += line.length + 1;

    const trimmed = line.trim();
    if (trimmed.startsWith("<Diagram")) {
      // The title lives on the following lines for multi-line tags.
      const block = body.slice(position, position + 600);
      visuals.push({
        kind: "diagram",
        label: attribute(block, "title") || "(untitled diagram)",
        source: "screenshot it from the live post",
        inLeadIn: position < leadInLength,
      });
      continue;
    }

    for (const match of line.matchAll(IMAGE_RE)) {
      visuals.push({
        kind: "image",
        label: match[1] || "(no alt text)",
        source: match[2].startsWith("/") ? `${SITE_URL}${match[2]}` : match[2],
        inLeadIn: position < leadInLength,
      });
    }
  }
  return visuals;
}

/** Prose only: JSX components become a one-line note, code fences survive. */
function toPasteableMarkdown(markdown) {
  const out = [];
  const lines = markdown.split("\n");
  let inFence = false;
  let skipUntil = null;
  let skipped = [];

  /** A dropped component leaves a note behind only when it was a visual. */
  const noteFor = (name, block) => {
    if (name !== "Diagram") return null;
    return `[Diagram — re-upload as an image: ${attribute(block, "title") || "untitled"}]`;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (inFence) {
      out.push(line);
      continue;
    }

    if (skipUntil) {
      skipped.push(line);
      if (trimmed === `</${skipUntil}>` || trimmed.endsWith(`</${skipUntil}>`)) {
        const note = noteFor(skipUntil, skipped.join("\n"));
        if (note) out.push(note);
        skipUntil = null;
        skipped = [];
      }
      continue;
    }

    const opening = trimmed.match(/^<([A-Z][A-Za-z0-9]*)\b/);
    if (opening) {
      const name = opening[1];
      const selfClosed = trimmed.endsWith("/>") || trimmed.endsWith(`</${name}>`);
      if (selfClosed) {
        const note = noteFor(name, line);
        if (note) out.push(note);
      } else {
        skipUntil = name;
        skipped = [line];
      }
      continue;
    }

    out.push(line.replace(INLINE_JSX_RE, ""));
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

/** First `sections` H2 sections, then trimmed to a paragraph under the cap. */
function leadIn(body, sections, maxWords) {
  const lines = body.split("\n");
  let seen = 0;
  let endLine = lines.length;
  let inFence = false;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith("```")) inFence = !inFence;
    if (inFence) continue;
    if (SECTION_HEADING_RE.test(trimmed) && ++seen > sections) {
      endLine = i;
      break;
    }
  }

  const raw = lines.slice(0, endLine).join("\n");
  const paragraphs = toPasteableMarkdown(raw).split(/\n{2,}/);
  const kept = [];
  let words = 0;

  for (const paragraph of paragraphs) {
    const next = words + countWords(paragraph);
    if (kept.length > 0 && next > maxWords) break;
    kept.push(paragraph);
    words = next;
  }

  return { text: kept.join("\n\n"), words, charLength: raw.length };
}

function main() {
  const { slug, sections, words: maxWords } = parseArgs(process.argv.slice(2));
  const file = join(POSTS_ROOT, slug, POST_FILE);
  if (!existsSync(file)) fail(`no post at ${file}`);

  const source = readFileSync(file, "utf8");
  const post = readFrontmatter(source, file);
  const body = extractBody(source);
  const year = post.date.slice(0, 4);
  const canonical = post.canonical ?? `${SITE_URL}/${year}/${post.slug}`;
  const lead = leadIn(body, sections, maxWords);
  const visuals = collectVisuals(body, lead.charLength);

  const lines = [];
  if (post.status !== "published") {
    lines.push(`⚠ status is "${post.status}" — publish on the site first, then mirror.`, "");
  }
  if (post.canonical) {
    lines.push(`⚠ this post declares an external canonical: ${post.canonical}`, "");
  }

  lines.push(
    `TITLE`,
    post.title,
    "",
    `SUBTITLE`,
    post.description,
    "",
    RULE,
    `BODY — paste this into Substack (${lead.words} words, first ${sections} section(s))`,
    RULE,
    "",
    lead.text,
    "",
    "---",
    "",
    `**Read the full piece:** [${post.title}](${canonical})`,
    "",
    RULE,
    `IMAGES TO RE-UPLOAD (${visuals.length})`,
    RULE,
  );

  if (visuals.length === 0) {
    lines.push("none — this post has no diagrams or images.");
  } else {
    visuals.forEach((visual, index) => {
      const where = visual.inLeadIn ? "in lead-in" : "after the cut — skip unless you want a teaser";
      lines.push(
        `${index + 1}. [${visual.kind}] ${visual.label}`,
        `   ${visual.source}`,
        `   ${where}`,
      );
    });
    lines.push("", `Live post (screenshot diagrams here): ${canonical}`);
  }

  console.log(lines.join("\n"));
}

main();
