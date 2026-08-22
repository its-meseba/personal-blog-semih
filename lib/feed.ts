// Atom 1.0 feed builder.
//
// Full content, not teasers: `<content type="html">` carries the whole article
// so importers (readers, newsletters, LLM pipelines) can reuse a post without
// scraping the site. Self and alternate links are both declared, which is what
// most validators and importers key off.

import { author } from "@/app/author";
import { markdownToHtml, escapeXml } from "./markdown-to-html";
import { SITE_URL, type IndexedPost, postUrl } from "./post-types";

export const ATOM_CONTENT_TYPE = "application/atom+xml; charset=utf-8";

/** Atom wants RFC 3339; post dates are day-precision. */
function toRfc3339(date: string): string {
  return `${date}T00:00:00Z`;
}

function cdata(html: string): string {
  // Guard against a literal `]]>` inside a code block closing the section early.
  return `<![CDATA[${html.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

function entry(post: IndexedPost): string {
  const url = postUrl(post);
  const html = markdownToHtml(post.body, SITE_URL);
  const categories = post.tags
    .map(tag => `      <category term="${escapeXml(tag)}"/>`)
    .join("\n");

  return `    <entry>
      <id>${escapeXml(url)}</id>
      <title type="text">${escapeXml(post.title)}</title>
      <link rel="alternate" type="text/html" href="${escapeXml(url)}"/>
      <published>${toRfc3339(post.date)}</published>
      <updated>${toRfc3339(post.date)}</updated>
      <author>
        <name>${escapeXml(author.name)}</name>
        <uri>${SITE_URL}</uri>
      </author>
      <summary type="text">${escapeXml(post.description)}</summary>
${categories ? `${categories}\n` : ""}      <content type="html">${cdata(html)}</content>
    </entry>`;
}

export type FeedOptions = {
  /** Absolute path of the feed itself, e.g. `/atom`. Becomes rel="self". */
  selfPath: string;
  /** Absolute path of the human page this feed mirrors. Becomes rel="alternate". */
  alternatePath: string;
  title: string;
  subtitle: string;
  /** Max entries served. */
  limit?: number;
};

const DEFAULT_LIMIT = 100;

export function buildAtomFeed(posts: IndexedPost[], options: FeedOptions): string {
  const entries = posts.slice(0, options.limit ?? DEFAULT_LIMIT);
  const updated = toRfc3339(entries[0]?.date ?? new Date().toISOString().slice(0, 10));
  const selfUrl = `${SITE_URL}${options.selfPath}`;
  const alternateUrl = `${SITE_URL}${options.alternatePath}`;

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title type="text">${escapeXml(options.title)}</title>
  <subtitle type="text">${escapeXml(options.subtitle)}</subtitle>
  <id>${escapeXml(selfUrl)}</id>
  <link rel="self" type="${ATOM_CONTENT_TYPE}" href="${escapeXml(selfUrl)}"/>
  <link rel="alternate" type="text/html" href="${escapeXml(alternateUrl)}"/>
  <updated>${updated}</updated>
  <author>
    <name>${escapeXml(author.name)}</name>
    <uri>${SITE_URL}</uri>
  </author>
${entries.map(entry).join("\n")}
</feed>
`;
}
