# MDX component kit

> Shipping a post, canonical URLs and the Substack mirror live in
> [`docs/PUBLISHING.md`](./PUBLISHING.md). This file is the tag reference.

Everything here is registered in `mdx-components.ts`, so a post uses it with
**no import**. Just write the tag in `page.mdx`.

Source lives in `app/(post)/components/`. All of it is token-styled — no hex
outside `app/styles/tokens.ts` — and server-rendered unless it needs state.

| Tag | Use it for |
|---|---|
| `<Figure>` | an image with a caption |
| `<Diagram>` | inline SVG that shows a mechanism |
| `<Callout>` | a caveat, warning, or aside next to the argument |
| `<PullQuote>` | breaking a long stretch of prose |
| `<Steps>` / `<Step>` | a procedure the reader follows in order |
| `<CodeCompare>` | before/after of the same code |
| `<Embed>` | a standalone interactive HTML file from `/public` |

---

## `<Figure>`

```mdx
<Figure
  src="/images/blog/ralph-loop/queue.png"
  alt="A queue with three pending jobs and one running"
  caption="The queue after the third retry — one worker, three waiting."
/>
```

`alt` is what a screen reader hears; `caption` is what everyone reads. Write
both — they are different jobs. `caption` is optional; drop it and only the
image is rendered.

It also wraps arbitrary content when there is no `src`:

```mdx
<Figure wide caption="Cost per run, three months.">
  <MyChart />
</Figure>
```

`wide` adds the framed panel (border + surface + padding).

---

## `<Diagram>`

Wraps hand-written inline SVG.

```mdx
<Diagram
  title="Feed to marketplace, one hop"
  caption="The cost snapshot is taken at parse time, not at push time."
>
  <svg viewBox="0 0 320 60">
    <rect x="1" y="14" width="90" height="32" rx="6" fill="none" stroke="currentColor" />
    <text x="46" y="34" textAnchor="middle">XML feed</text>

    <line x1="95" y1="30" x2="125" y2="30" stroke="currentColor" />

    <rect x="129" y="14" width="90" height="32" rx="6"
          fill="rgb(var(--c-surface-raised))" stroke="rgb(var(--c-accent))" />
    <text x="174" y="34" textAnchor="middle">parse</text>
  </svg>
</Diagram>
```

Rules for the SVG you pass in:

1. Give it a **`viewBox`** and **no fixed `width`/`height`** — the wrapper
   sizes it (`max-width: 100%`, height auto).
2. Colour it with **`currentColor`** or the CSS custom properties
   (`rgb(var(--c-accent))`, `--c-border`, `--c-surface`, `--c-muted`).
   **Never a literal hex** — that is what makes the drawing follow the theme.
3. A wide drawing scrolls inside its own container instead of widening the
   page. If it genuinely needs the room, give the `<svg>` a
   `className="min-w-[640px]"`.

Accessibility: the wrapper is `role="img"` with `aria-label={title}`, so the
`title` prop must be a real description of the drawing, not a label like
"Diagram 2".

---

## `<Callout>`

```mdx
<Callout kind="note">
Trendyol and Hepsiburada ship price and stock in the *same* payload. There is
no stock-only call.
</Callout>

<Callout kind="warning">
Writing the raw barcode instead of the sync key is a **silent no-op** — the
request returns 200 and nothing changes.
</Callout>

<Callout kind="aside">
Skippable background: the hash prefix exists because two suppliers reuse the
same short codes.
</Callout>
```

`kind` is `note` (default) | `warning` | `aside`. `warning` and `aside` print
a small label; override it with `label="…"`.

The older emoji form still works and is unchanged:

```mdx
<Callout emoji="💡">A big idea</Callout>
```

---

## `<PullQuote>`

```mdx
<PullQuote cite="Postmortem, 30 July">
A request that returns 200 and changes nothing is worse than one that fails.
</PullQuote>
```

Display type, accent rail, its own vertical rhythm. Use it to break a long
stretch of prose — one or two per post, not every screen. `cite` is optional.

---

## `<Steps>` / `<Step>`

```mdx
<Steps>
  <Step title="Measure first">
    Run the diagnostic against the live endpoint and record the counter.
  </Step>
  <Step title="Change one thing">
    Push the fix to a single connection, never all nine.
  </Step>
  <Step>
    Read the counter again. If it did not move, the work is not done.
  </Step>
</Steps>
```

Counters are monospaced and sit in the margin, on the rule. `title` is
optional — a `<Step>` with only prose still gets its number.

---

## `<CodeCompare>`

```mdx
<CodeCompare
  label="The identity has to come from the sync key, not the barcode."
  beforeLabel="broken"
  afterLabel="fixed"
  before={`items.push({ barcode: p.barcode, quantity })`}
  after={`items.push({ barcode: marketplaceSyncKey(p), quantity })`}
/>
```

Side by side from `md` up, stacked below it. Both panels carry the normal
code-block frame (filename strip + copy button). `label` renders as a caption
under the pair; `beforeLabel` / `afterLabel` default to `before` / `after`.

Pass the code as template literals so newlines survive MDX.

---

## `<Embed>`

Iframes a standalone HTML file you dropped in `/public` — an interactive
one-off that was never going to be a React component.

```mdx
The simulator below runs the same retry policy the queue uses: three attempts,
fifteen minutes apart. Push the failure rate past 40% and the queue never
drains — which is the whole reason the cooldown exists.

<Embed
  src="/retry-simulator.html"
  title="Retry policy simulator"
  caption="Drag the failure rate; the queue depth is simulated over one hour."
  height={480}
/>
```

**An embed must always be preceded by a text summary.** An iframe contributes
nothing to the RSS feed, nothing to search engines, and nothing to a reader
with scripting off — the full-content Atom feed at `/atom` will show the
paragraph and not the widget. State in prose what the thing shows and what the
reader is meant to conclude; the embed is the illustration, the text is the
article.

`height` is in pixels (default `420`). The iframe is `loading="lazy"`, so it
costs nothing until it scrolls into view.

---

## Adding a new one

1. Write it in `app/(post)/components/<name>.tsx`. Server component unless it
   truly needs state — `code-block.tsx` is the only client one here.
2. Semantic classes only (`bg-surface`, `text-fg`, `border-border`,
   `text-muted`, `font-mono`, `rounded-card`, `my-block` …). No hex.
3. Mobile first: nothing may overflow at 360px. Wide things get their own
   `overflow-x-auto` container; they never widen the page.
4. Register it in `mdx-components.ts` — both the import and the returned
   object — so posts get it without an import.
5. Add a row to the table at the top of this file and a section with a real
   example.
