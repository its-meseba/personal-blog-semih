// Minimal Markdown -> HTML renderer for the feeds.
//
// Feed readers and importers want the whole article as HTML, not a teaser. The
// site renders MDX through Next; the feed cannot, so this covers the subset the
// posts actually use: headings, paragraphs, lists, fenced code, blockquotes,
// rules, tables-as-text, links, images, bold/italic/inline code.
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
const JSX_RE = /^<[A-Z][\w.]*/;

export function markdownToHtml(markdown: string, siteUrl: string): string {
  const lines = markdown.split("\n");
  const out: string[] = [];

  let paragraph: string[] = [];
  let listTag: "ul" | "ol" | null = null;
  let quote: string[] = [];
  let fenceLanguage: string | null = null;
  let fence: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    out.push(`<p>${renderInline(escapeHtml(paragraph.join(" ")), siteUrl)}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (listTag === null) return;
    out.push(`</${listTag}>`);
    listTag = null;
  };

  const flushQuote = () => {
    if (quote.length === 0) return;
    out.push(`<blockquote><p>${renderInline(escapeHtml(quote.join(" ")), siteUrl)}</p></blockquote>`);
    quote = [];
  };

  const flushBlocks = () => {
    flushParagraph();
    flushList();
    flushQuote();
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/, "");
    const trimmed = line.trim();

    if (fenceLanguage !== null) {
      if (trimmed.startsWith("```")) {
        const classAttr = fenceLanguage ? ` class="language-${escapeHtml(fenceLanguage)}"` : "";
        out.push(`<pre><code${classAttr}>${escapeHtml(fence.join("\n"))}</code></pre>`);
        fence = [];
        fenceLanguage = null;
      } else {
        fence.push(rawLine);
      }
      continue;
    }

    if (trimmed.startsWith("```")) {
      flushBlocks();
      fenceLanguage = trimmed.slice(3).trim();
      continue;
    }

    if (trimmed === "") {
      flushBlocks();
      continue;
    }

    // Bare JSX components have no feed equivalent; drop the line, keep the prose.
    if (JSX_RE.test(trimmed)) {
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
      out.push(`<h${level}>${renderInline(escapeHtml(heading[2]), siteUrl)}</h${level}>`);
      continue;
    }

    const quoted = trimmed.match(QUOTE_RE);
    if (quoted) {
      flushParagraph();
      flushList();
      quote.push(quoted[1]);
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
