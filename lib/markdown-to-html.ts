// Minimal Markdown -> HTML renderer for the feeds.
//
// Feed readers and importers want the whole article as HTML, not a teaser. The
// site renders MDX through Next; the feed cannot, so this covers the subset the
// posts actually use: headings, paragraphs, lists, fenced code, blockquotes,
// rules, tables, links, images, bold/italic/inline code.
// It is deliberately dependency-free — no parser is added to the bundle.

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => HTML_ESCAPES[char]);
}

/** XML text nodes need the same escaping minus the quote entities. */
export function escapeXml(value: string): string {
  return value.replace(/[&<>]/g, char => HTML_ESCAPES[char]);
}

const SITE_ABSOLUTE = /^\//;

function absolutise(url: string, siteUrl: string): string {
  return SITE_ABSOLUTE.test(url) ? `${siteUrl}${url}` : url;
}

/** Inline spans. Runs on already HTML-escaped text. */
function renderInline(text: string, siteUrl: string): string {
  return text
    .replace(/`([^`]+)`/g, (_m, code) => `<code>${code}</code>`)
    .replace(
      /!\[([^\]]*)\]\(([^)\s]+)\)/g,
      (_m, alt, src) => `<img src="${absolutise(src, siteUrl)}" alt="${alt}" />`
    )
    .replace(
      /\[([^\]]+)\]\(([^)\s]+)\)/g,
      (_m, label, href) => `<a href="${absolutise(href, siteUrl)}">${label}</a>`
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
}

const HEADING_RE = /^(#{1,6})\s+(.*)$/;
const UL_RE = /^[-*+]\s+(.*)$/;
const OL_RE = /^\d+\.\s+(.*)$/;
const QUOTE_RE = /^>\s?(.*)$/;
const RULE_RE = /^(-{3,}|\*{3,}|_{3,})$/;
const FENCE = "```";
const TABLE_ROW_RE = /^\|.*\|$/;
const TABLE_DIVIDER_RE = /^\|(?:\s*:?-+:?\s*\|)+$/;
// A component tag, or the one lowercase element that is always markup: `<svg>`.
const JSX_OPEN_RE = /^<([A-Z][\w.]*|svg)\b/;
const JSX_CLOSE_RE = /^<\/([A-Z][\w.]*|svg)\s*>/;

/**
 * Components whose children are PROSE the reader should get: the tags are
 * dropped and the sentences inside survive into the feed and the read time.
 *
 * The rule for deciding which list a component belongs in: does its body read
 * as writing, or as markup? A `<Callout>` holds a paragraph the author wrote —
 * losing it loses an argument. A `<Diagram>` holds `<rect>` and `<path>`, which
 * is not writing and would land in the feed as garbage paragraphs.
 *
 * Adding a component to neither list makes it markup-bearing (fail-closed: a
 * feed missing a sentence is better than a feed full of SVG). Add new
 * components here deliberately rather than relying on that default.
 */
export const PROSE_JSX_COMPONENTS: readonly string[] = [
  "Callout",
  "PullQuote",
  "Steps",
  "Step",
];

/**
 * Components whose children are MARKUP: the whole block goes, children
 * included. See PROSE_JSX_COMPONENTS above for the rule that splits the two.
 */
export const MARKUP_JSX_COMPONENTS: readonly string[] = [
  "Diagram",
  "CodeCompare",
  "Figure",
  "Embed",
  "Image",
  "Tweet",
  "YouTube",
  "svg",
];

const PROSE_SET = new Set(PROSE_JSX_COMPONENTS);

/** Unknown components are treated as markup — see PROSE_JSX_COMPONENTS. */
function isProseComponent(name: string): boolean {
  return PROSE_SET.has(name);
}

/** `| a | b |` -> `["a", "b"]`. The outer pipes are decoration. */
function splitTableRow(row: string): string[] {
  return row
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map(cell => cell.trim());
}

/**
 * Removes JSX from the markdown, selectively.
 *
 * The feed and the read time both want prose. A `<Diagram>` carries an inline
 * `<svg>` body that is markup, not writing, so the whole block goes. A
 * `<Callout>` or a `<PullQuote>` carries sentences the author wrote — often the
 * thesis of the post — so only its tags go and the children stay. Which is
 * which is declared in PROSE_JSX_COMPONENTS / MARKUP_JSX_COMPONENTS above.
 * A markup component nested inside a prose one is still dropped whole.
 *
 * The scan is line-based on purpose. Attribute values in these posts contain
 * `=>` and multi-line template literals, so a character-level tag parser loses
 * its place and swallows the rest of the article. Lines are stabler: an opening
 * tag ends on a line ending in `>`, a self-closing one on a line ending in
 * `/>`, children end at `</Name>`. Backtick parity is tracked so that a `>`
 * inside a multi-line template literal attribute does not end the tag early.
 */
export function stripJsxBlocks(markdown: string): string {
  const lines = markdown.split("\n");
  const kept: string[] = [];

  /** Open components, innermost last. */
  const stack: { name: string; markup: boolean }[] = [];
  /** How many frames on the stack are markup — non-zero means "drop lines". */
  let markupDepth = 0;
  let inFence = false;
  /** A tag whose attributes span several lines, not yet terminated. */
  let pending: { name: string; markup: boolean } | null = null;
  /** Inside a multi-line template-literal attribute value. */
  let inTemplate = false;

  const push = (frame: { name: string; markup: boolean }) => {
    stack.push(frame);
    if (frame.markup) markupDepth++;
  };

  const popTo = (name: string) => {
    const at = stack.map(frame => frame.name).lastIndexOf(name);
    if (at === -1) return; // stray closing tag: its opener was never seen
    for (const frame of stack.splice(at)) if (frame.markup) markupDepth--;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // 1. Attribute continuation lines. Never prose, always dropped.
    if (pending !== null) {
      const ticks = (trimmed.match(/`/g) ?? []).length;
      if (inTemplate) {
        if (ticks % 2 === 1) inTemplate = false;
        if (inTemplate) continue;
      } else if (ticks % 2 === 1) {
        inTemplate = true;
        continue;
      }
      if (trimmed.endsWith("/>")) pending = null; // self-closing
      else if (trimmed.endsWith(">")) {
        push(pending);
        pending = null;
      }
      continue;
    }

    // 2. Fenced code is writing; JSX inside it is a sample, not a component.
    if (inFence) {
      if (markupDepth === 0) kept.push(line);
      if (trimmed.startsWith(FENCE)) inFence = false;
      continue;
    }
    if (trimmed.startsWith(FENCE)) {
      inFence = true;
      if (markupDepth === 0) kept.push(line);
      continue;
    }

    // 3. Closing tag — of the block we are in, or a stray one.
    const close = trimmed.match(JSX_CLOSE_RE);
    if (close) {
      popTo(close[1]);
      continue;
    }

    // 4. Opening tag.
    const open = trimmed.match(JSX_OPEN_RE);
    if (open) {
      const frame = { name: open[1], markup: !isProseComponent(open[1]) };
      const tag = frame.name.replace(/\./g, "\\."); // `<Foo.Bar>` is a legal name
      const oneLiner = trimmed.match(
        new RegExp(`^<${tag}\\b[^>]*>(.*)</${tag}\\s*>$`)
      );

      if (oneLiner) {
        // `<PullQuote>a sentence</PullQuote>` — keep the sentence, drop the tags.
        const inner = oneLiner[1].trim();
        if (!frame.markup && markupDepth === 0 && inner !== "")
          kept.push(inner);
      } else if (trimmed.endsWith("/>")) {
        // Self-closing on its own line: nothing to keep, nothing to open.
      } else if (trimmed.endsWith(">")) {
        push(frame); // children follow on the next lines
      } else {
        pending = frame; // attributes continue on the next lines
        inTemplate = (trimmed.match(/`/g) ?? []).length % 2 === 1;
      }
      continue;
    }

    // 5. Ordinary line: prose unless a markup block is swallowing it.
    if (markupDepth === 0) kept.push(line);
  }

  return kept.join("\n");
}

export function markdownToHtml(markdown: string, siteUrl: string): string {
  const lines = stripJsxBlocks(markdown).split("\n");
  const out: string[] = [];

  let paragraph: string[] = [];
  let listTag: "ul" | "ol" | null = null;
  let quote: string[] = [];
  let fenceLanguage: string | null = null;
  let fence: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    out.push(
      `<p>${renderInline(escapeHtml(paragraph.join(" ")), siteUrl)}</p>`
    );
    paragraph = [];
  };

  const flushList = () => {
    if (listTag === null) return;
    out.push(`</${listTag}>`);
    listTag = null;
  };

  const flushQuote = () => {
    if (quote.length === 0) return;
    out.push(
      `<blockquote><p>${renderInline(
        escapeHtml(quote.join(" ")),
        siteUrl
      )}</p></blockquote>`
    );
    quote = [];
  };

  const flushBlocks = () => {
    flushParagraph();
    flushList();
    flushQuote();
  };

  for (let index = 0; index < lines.length; index++) {
    const rawLine = lines[index];
    const line = rawLine.replace(/\s+$/, "");
    const trimmed = line.trim();

    if (fenceLanguage !== null) {
      if (trimmed.startsWith(FENCE)) {
        const classAttr = fenceLanguage
          ? ` class="language-${escapeHtml(fenceLanguage)}"`
          : "";
        out.push(
          `<pre><code${classAttr}>${escapeHtml(fence.join("\n"))}</code></pre>`
        );
        fence = [];
        fenceLanguage = null;
      } else {
        fence.push(rawLine);
      }
      continue;
    }

    if (trimmed.startsWith(FENCE)) {
      flushBlocks();
      fenceLanguage = trimmed.slice(3).trim();
      continue;
    }

    if (trimmed === "") {
      flushBlocks();
      continue;
    }

    if (RULE_RE.test(trimmed)) {
      flushBlocks();
      out.push("<hr />");
      continue;
    }

    const heading = trimmed.match(HEADING_RE);
    if (heading) {
      flushBlocks();
      const level = heading[1].length;
      out.push(
        `<h${level}>${renderInline(
          escapeHtml(heading[2]),
          siteUrl
        )}</h${level}>`
      );
      continue;
    }

    const quoted = trimmed.match(QUOTE_RE);
    if (quoted) {
      flushParagraph();
      flushList();
      quote.push(quoted[1]);
      continue;
    }

    // A GFM table: header row, `|---|` divider, then body rows. Without this
    // the whole table collapses into one paragraph of pipe characters.
    if (
      TABLE_ROW_RE.test(trimmed) &&
      TABLE_DIVIDER_RE.test((lines[index + 1] ?? "").trim())
    ) {
      flushBlocks();
      const cell = (value: string) => renderInline(escapeHtml(value), siteUrl);
      const header = splitTableRow(trimmed);

      const body: string[][] = [];
      let cursor = index + 2;
      while (cursor < lines.length) {
        const row = lines[cursor].trim();
        if (!TABLE_ROW_RE.test(row) || TABLE_DIVIDER_RE.test(row)) break;
        body.push(splitTableRow(row));
        cursor++;
      }

      out.push(
        "<table><thead><tr>" +
          header.map(value => `<th>${cell(value)}</th>`).join("") +
          "</tr></thead><tbody>" +
          body
            .map(
              row =>
                "<tr>" +
                row.map(value => `<td>${cell(value)}</td>`).join("") +
                "</tr>"
            )
            .join("") +
          "</tbody></table>"
      );

      index = cursor - 1;
      continue;
    }

    const unordered = trimmed.match(UL_RE);
    const ordered = trimmed.match(OL_RE);
    if (unordered || ordered) {
      flushParagraph();
      flushQuote();
      const wanted: "ul" | "ol" = unordered ? "ul" : "ol";
      if (listTag !== wanted) {
        flushList();
        out.push(`<${wanted}>`);
        listTag = wanted;
      }
      const item = (unordered ? unordered[1] : ordered![1]) ?? "";
      out.push(`<li>${renderInline(escapeHtml(item), siteUrl)}</li>`);
      continue;
    }

    flushList();
    flushQuote();
    paragraph.push(trimmed);
  }

  if (fenceLanguage !== null && fence.length > 0) {
    out.push(`<pre><code>${escapeHtml(fence.join("\n"))}</code></pre>`);
  }
  flushBlocks();

  return out.join("\n");
}
