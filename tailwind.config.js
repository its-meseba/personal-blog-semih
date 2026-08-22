const plugin = require("tailwindcss/plugin");

/**
 * "Fire max" design system.
 *
 * Colours are declared as `rgb(var(--c-*) / <alpha-value>)` so that every
 * utility keeps working with an opacity modifier (`bg-surface/60`) while the
 * actual values live once, in `app/globals.css`, and swap with the `.dark`
 * class. Raw hex lives in `app/styles/tokens.ts` for the places that cannot
 * read CSS (OG image routes, `theme-color` meta).
 */
const token = name => `rgb(var(--c-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./mdx-components.ts"],
  theme: {
    extend: {
      colors: {
        background: token("background"),
        surface: {
          DEFAULT: token("surface"),
          raised: token("surface-raised"),
          hover: token("surface-hover"),
        },
        border: {
          DEFAULT: token("border"),
          strong: token("border-strong"),
        },
        text: token("text"),
        /** alias for `text` - readable as `text-fg` where `text-text` reads badly */
        fg: token("text"),
        muted: token("muted"),
        faint: token("faint"),
        /**
         * Accent roles. `accent` (DEFAULT/hover/contrast) is the ONLY
         * text-legal one: deep ember on cream, bright orange on the dark
         * register. The signature hot orange #FF5A1F lives in `field` and
         * `mark`, which are named so they cannot be used for type by
         * accident - see the contrast rule in `app/styles/tokens.ts`.
         */
        accent: {
          DEFAULT: token("accent"),
          hover: token("accent-hover"),
          contrast: token("accent-contrast"),
          /** full-bleed fill; only `text-accent-ink` may sit on it */
          field: token("accent-field"),
          "field-hover": token("accent-field-hover"),
          /** near-black ink, the only type colour allowed on a field */
          ink: token("accent-ink"),
          /** non-text marks only: rules, bars, progress, focus, selection */
          mark: token("accent-mark"),
          /** tint behind a chip/tag; pair with `text-accent` or `text-fg` */
          chip: token("accent-chip"),
        },
      },

      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: [
          "var(--font-serif)",
          "ui-serif",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "serif",
        ],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },

      /**
       * Semantic type scale (1.25 major-third, rounded to sane px).
       * The numeric Tailwind sizes stay available; these name the roles.
       */
      fontSize: {
        micro: ["0.6875rem", { lineHeight: "1.45", letterSpacing: "0.06em" }], // 11 - tags
        meta: ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.02em" }], // 12 - dates, read time
        caption: ["0.8125rem", { lineHeight: "1.55" }], // 13 - figure captions
        ui: ["0.9375rem", { lineHeight: "1.6" }], // 15 - nav, buttons
        body: ["1.0625rem", { lineHeight: "1.75", letterSpacing: "-0.003em" }], // 17 - article body
        lead: ["1.1875rem", { lineHeight: "1.65", letterSpacing: "-0.008em" }], // 19 - standfirst
        h4: ["1.125rem", { lineHeight: "1.4", letterSpacing: "-0.01em" }], // 18
        h3: ["1.375rem", { lineHeight: "1.35", letterSpacing: "-0.015em" }], // 22
        h2: ["1.75rem", { lineHeight: "1.25", letterSpacing: "-0.02em" }], // 28
        h1: ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.028em" }], // 36
        display: [
          "clamp(2.25rem, 1.4rem + 3.6vw, 3.25rem)",
          { lineHeight: "1.08", letterSpacing: "-0.034em" },
        ],
      },

      /** Vertical rhythm. Base unit 4px stays; these name the article beats. */
      spacing: {
        flow: "1.5rem", // 24 - paragraph gap
        rhythm: "1.75rem", // 28 - between prose blocks
        block: "2.5rem", // 40 - figure / code block margin
        section: "4rem", // 64 - h2 section break
        chapter: "6rem", // 96 - page-level break
        rail: "13rem", // 208 - sticky outline rail at xl
      },

      maxWidth: {
        measure: "68ch", // the reading column
        prose: "68ch", // alias
        shell: "44rem", // page shell (index, about, links)
        wide: "64rem", // full-bleed-ish sections
      },

      borderRadius: {
        xs: "3px",
        sm: "5px",
        DEFAULT: "7px",
        md: "9px",
        lg: "12px",
        xl: "16px",
        card: "12px",
        code: "10px",
        pill: "9999px",
      },

      boxShadow: {
        // flat-first: these are edges, not drop shadows
        hairline: "0 0 0 1px rgb(var(--c-border) / 1)",
        panel: "0 1px 2px rgb(0 0 0 / 0.28), 0 8px 24px -12px rgb(0 0 0 / 0.35)",
        lifted: "0 2px 4px rgb(0 0 0 / 0.24), 0 16px 40px -16px rgb(0 0 0 / 0.45)",
        focus:
          "0 0 0 2px rgb(var(--c-background) / 1), 0 0 0 4px rgb(var(--c-accent-mark) / 1)",
        "accent-glow": "0 0 0 1px rgb(var(--c-accent-mark) / 0.45)",
      },

      letterSpacing: {
        tag: "0.08em",
      },

      transitionDuration: {
        instant: "80ms",
        quick: "140ms",
        base: "200ms",
      },

      transitionTimingFunction: {
        console: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      // this class is applied to `html` by `app/theme-efect.ts`, similar
      // to how `dark:` gets enabled
      addVariant("theme-system", ".theme-system &");
    }),
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
