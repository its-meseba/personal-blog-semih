# Images

Two things live here: **how a post cover is rendered** (the vertical-space
rule) and **how a post cover is made** (the illustration recipe). Read the
first before touching layout, the second before generating art.

---

## 1. The vertical-space rule

> Vertical space must always be used nicely.

That is the house rule. For the post hero it cashes out as five concrete
constraints. Apply them the same way every time; do not re-litigate them per
post.

### 1.1 The hero must not push the prose below the fold

On a laptop the reader should see **title + byline + hero + the first line of
prose together**. A hero that fills the viewport is not a hero, it is a
splash screen.

The source covers are **3:2** (1248x832). Rendered at 3:2 inside the 68ch
reading column that is roughly 450px tall — which, under a title, a
standfirst and a byline, is exactly the failure above.

So the hero is **letterboxed, not shown at its native ratio**:

| viewport | aspect  | max-height |
| -------- | ------- | ---------- |
| `< sm`   | 2.2 : 1 | 200px      |
| `>= sm`  | 2.5 : 1 | 340px      |

`object-fit: cover` crops the 3:2 source into that box. At the 68ch measure
(~680px) the aspect ratio is what binds — the box computes to ~272px tall and
the cap never fires. The cap is a guard rail for wide viewports, not the
normal case.

This is also why the illustration recipe below insists on a **centred
composition with generous white space**: the crop eats the top and bottom of
the frame, so nothing that matters may live there.

### 1.2 Zero cumulative layout shift, by construction

Reserve the box before the bytes arrive:

- the wrapper carries an explicit `aspect-ratio` (plus the `max-h` cap), so
  its height is a pure function of its own width;
- the image is `next/image` with `fill` inside that sized parent (an explicit
  `width`/`height` pair is equally fine).

No `onLoad` handler, no measuring after paint, no "it settles down after a
moment". If you find yourself computing a height in JavaScript, you have
broken this rule.

The hero is the LCP candidate on every post, so it carries `priority` — it
loads eagerly instead of waiting for the lazy-load observer.

### 1.3 Spacing comes from the tokens, always

The gap above and below the hero uses the existing rhythm scale
(`mt-rhythm`, `mb-block`, `pb-rhythm` — see `tailwind.config.js`). Never
invent a spacing value for an image. If a gap looks wrong, the fix is a
different token, not a new number.

### 1.4 The page leads with words

Order inside the masthead is fixed:

```
series tag → title → standfirst → byline → HERO → prose
```

The hero sits after the byline and before the article body. A picture never
introduces the piece; the sentence does.

### 1.5 No cover means no space

A post without a `cover` renders **exactly as it did before covers existed**
— no frame, no placeholder, no reserved gap. The component is only mounted
when `post.cover` is set (`app/(post)/header.tsx`), so absence costs zero
pixels.

Implementation: `app/components/PostCover.tsx`.

### 1.6 Declaring a cover

`cover` is an optional field on the post metadata contract
(`lib/post-types.ts`), site-absolute and resolved against `public/`:

```js
export const post = {
  slug: "ralph-loop",
  // ...
  cover: "/images/covers/ralph-loop.webp",
  status: "published",
};
```

`lib/content.ts` validates it at build time: the path must start with `/`
**and a file must exist behind it**. A typo fails `pnpm build` with the
offending post file named, rather than shipping a hero that 404s for every
reader.

### 1.7 Storage and format

- Location: `public/images/covers/<slug>.webp`.
- Format: **WebP**, quality 90, 1248px wide. Flat vector art compresses
  extremely well — the current set of eleven covers totals ~252 KB, about
  23 KB each. PNG sources are ~780 KB each; do not ship them.

```bash
cwebp -q 90 -resize 1248 0 -m 6 <source>.png -o public/images/covers/<slug>.webp
```

---

## 2. The illustration style

One approved look, so the covers read as a set rather than eleven unrelated
pictures.

### 2.1 What the style is

Flat vector **product-marketing illustration**:

- soft warm gradient ground, cream to pale peach
- flat shapes with thin near-black outlines
- generous rounded corners
- soft drop shadows
- lots of white space
- centred composition
- **exactly one accent — the brand orange — on two or three small elements**
- no people, no photography, no 3D

Everything else in the frame is neutral. The orange is a punctuation mark,
not a colour scheme.

### 2.2 The prompt template

Replace `{{SUBJECT}}` and keep the rest verbatim.

```
{{SUBJECT}}. Flat vector product-marketing illustration, soft warm gradient
background from cream to pale peach, flat shapes with thin near-black
outlines, generous rounded corners, soft drop shadows, lots of white space,
centred composition, single accent colour #FF5A1F used on only two or three
small elements, everything else neutral warm grey and off-white, no people,
no photography, no 3D rendering, clean modern editorial style.
ABSOLUTELY NO TEXT: no words, no letters, no numbers, no labels, no captions,
no logos, no watermarks, no colour codes, no UI copy anywhere in the image.
```

### 2.3 How to describe a subject

Describe **objects and their arrangement**. Never describe a concept.

Concepts render as mush — "agent orchestration" produces a swirl of nothing.
The model draws nouns.

| ✗ concept                | ✓ objects                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| "agent identity crisis"  | "a single ID badge card at the centre, three identical blank badge cards fanned behind it"   |
| "the night shift"        | "a laptop with a closed lid on a desk, a small crescent moon above, a progress bar beside it" |
| "skills integration"     | "three puzzle-shaped tiles slotting into a rounded rectangular panel"                        |

Keep the subject to one sentence of concrete nouns and their spatial
relationship. Remember §1.1: the render will be cropped to ~2.5:1, so put the
subject dead centre and keep the top and bottom of the frame empty.

### 2.4 Two hard-won rules

**Rule 1 — a hex code in the prompt can be DRAWN as visible text.**
One cover came back with the literal string `FF5A1F` rendered inside an
orange block. The hex is an instruction to the model, and the model sometimes
reads it as content. Keep the hex (see Rule 2), but **always pair it with the
explicit zero-text clause above, and always eyeball the finished image for
stray glyphs before shipping it.** Look especially inside coloured blocks and
along shape edges.

**Rule 2 — removing the hex is not the fix.**
Dropping `#FF5A1F` does stop the text leak, but the accent then drifts to a
generic amber and the covers no longer match the brand or each other. So the
hex stays. The fix for the text leak is the stronger no-text instruction plus
a human visual check — not a weaker colour spec.

Corollary: **generated images must never contain text.** Any words that need
to appear over a cover belong in HTML on top of it, where they are
selectable, translatable, accessible and correct.

### 2.5 Generating one

- Platform: **Vertex AI**, project `botcu-lumio`
- Model: `gemini-2.5-flash-image`
- Endpoint: **`:generateContent`** — `:predict` is the Imagen-style endpoint
  and returns HTTP 400 for Gemini image models
- `aspectRatio: "3:2"` (1248x832)
- Auth: the Lumio service-account key at
  `~/dev/work/lumio-studio/assets/gcloud/data-ops-lumio-sa.json`. **Never a
  user token** — `contact@lumiostudio.co` tokens expire under the Workspace
  reauth policy and the call dies mid-batch with a reauth error that looks
  like a permissions problem.

Working script: [`scripts/generate-cover.mjs`](../scripts/generate-cover.mjs).

```bash
gcloud auth activate-service-account \
  --key-file=~/dev/work/lumio-studio/assets/gcloud/data-ops-lumio-sa.json

node scripts/generate-cover.mjs ralph-loop \
  "a laptop with a closed lid on a desk, a small crescent moon above it, a thin progress bar beside it"

# then eyeball it for stray text (Rule 1), and only then:
cwebp -q 90 -resize 1248 0 -m 6 /tmp/covers/ralph-loop.png \
  -o public/images/covers/ralph-loop.webp
```
