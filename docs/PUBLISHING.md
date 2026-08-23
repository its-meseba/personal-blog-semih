# Publishing & distribution

One rule underneath all of this: **the site is the source of truth.** Substack,
LinkedIn, dev.to and anything else are one-way mirrors. Nothing is ever edited
on a mirror and copied back.

```
app/(post)/2026/<slug>/page.mdx        ← the only file you write
        │
        ├── lib/content.ts  ──▶ index, /thoughts, series pages, sitemap
        ├── lib/feed.ts     ──▶ /atom  (full text, every published post)
        └── lib/post-metadata.ts ──▶ <link rel="canonical">, OG + Twitter cards
                                              │
                                              └─▶ scripts/substack-draft.mjs
                                                     ──▶ paste-ready mirror
```

## One file ships a post

Create `app/(post)/2026/<slug>/page.mdx` — the folder name *is* the slug — and
start it with the two exports every post has:

```mdx
import { postMetadata } from "@/lib/post-metadata";

export const post = {
  slug: "my-post",              // must equal the folder name
  title: "…",
  description: "…",             // also the card excerpt and the Substack subtitle
  date: "2026-08-22",           // owns the URL year: /2026/my-post
  updated: "2026-09-14",        // optional; ONLY for a real revision — see below
  series: "Agentic Coding",     // optional; must exist in app/series.ts
  tags: ["agents"],
  cover: "/images/covers/my-post.webp",  // optional; see docs/IMAGES.md
  status: "draft",              // "draft" until it is ready; then "published"
};

export const metadata = postMetadata(post);
```

That is the whole registration step. There is no `posts.json`; the index is
built from these exports at build time and a malformed one fails the build by
file name instead of vanishing from the site.

`status: "draft"` means: visible in `pnpm dev`, `noindex`, and excluded from the
production index, the sitemap and `/atom`. Flip it to `"published"` to ship.

## `updated` — the revision date

`updated` is the **only** thing that makes a post claim it was revised. It is
an ISO `YYYY-MM-DD` date, validated exactly like `date`, and it may not be
earlier than `date` — the build fails if it is.

Leave it out and the post says nothing: `dateModified` equals the publish
date, the byline shows no "Updated …" line, `<updated>` in `/atom` and
`lastmod` in the sitemap both carry the publish date, and the `BlogPosting`
JSON-LD reports `dateModified === datePublished`.

**Set it only for a real revision** — a corrected claim, a rewritten section,
new material, something a returning reader would notice. It is a statement to
readers and a freshness signal to search engines, and both are lies if the
prose did not change.

**Do not set it for touching the file.** Reformatting, a typo fix, a tag
change, a metadata migration, a domain flip, a lint pass: none of these are
revisions. This field exists *because* the site previously derived
`dateModified` from each file's last git commit, and a batch of unrelated
migrations made all ten posts announce "Updated 23 August" when their prose
had not changed since January. Nothing infers this date any more. The author
declares it or it does not exist.

When you do revise, say what changed in the post itself if it matters to the
argument. The date tells a reader *that* something changed; only prose tells
them *what*.

## Canonical URLs

`postMetadata` gives every post a **self-referencing canonical** —
`https://www.mehmetsemihbabacan.com/<year>/<slug>` — with no per-post work. Since every
post file calls it, a post cannot ship without one.

Set `canonical` only when the piece **was published somewhere else first**:

```mdx
export const post = {
  slug: "guest-piece",
  // …
  canonical: "https://other-site.com/original",  // absolute http(s) URL
};
```

It must be an absolute URL or the build fails. It moves both
`<link rel="canonical">` and the OpenGraph `url`, so search engines and shared
cards never disagree about where the piece lives.

**A mirror is not a reason to set this.** Posting to Substack does not make
Substack the original — our copy stays self-canonical, and the mirror links
back to us.

## Mirroring to Substack

Substack has no write API and gives publishers no canonical field, so a
full-text copy there competes with our own page on a higher-authority domain.
The mirror is therefore a **lead-in plus a link**, not the whole article.

```bash
node scripts/substack-draft.mjs <slug>
```

Prints, ready to paste: the title, the subtitle (`description`), the first two
sections as the lead-in, a "Read the full piece" link to the canonical URL, and
a numbered list of every diagram and image to re-upload (Substack will not
render our inline SVG, and hotlinked images are unreliable). Diagrams are
screenshotted from the live post.

Flags: `--sections=N` (default `2`) and `--words=N` (default `450`), which
trims the lead-in at a paragraph boundary. The script warns if the post is
still a draft or declares an external canonical.

Bulk import instead of pasting: Substack's Settings → Import accepts an RSS
URL — give it `https://www.mehmetsemihbabacan.com/atom`, which carries full content for
every published post. That imports the whole text, so it makes the SEO trade the
lead-in avoids; use it for the archive, paste for new posts.

## The feed

`/atom` is full-content Atom 1.0, published posts only, newest first. It is
discoverable three ways: `<link rel="alternate" type="application/atom+xml">`
in the head of every page (site-wide in `app/layout.tsx`, and again per post via
`postMetadata`), and a link in the site footer.
