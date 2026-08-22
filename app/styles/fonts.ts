/**
 * "Fire max" design system - font loading.
 *
 * Three faces, loaded through `next/font/google` (self-hosted at build time,
 * no runtime request to fonts.googleapis.com, no layout-shift flash):
 *
 *   Archivo         display / headings / UI labels   -> --font-display
 *   Source Serif 4  article body                     -> --font-serif
 *   JetBrains Mono  code, dates, meta, tags          -> --font-mono
 *
 * Archivo is a wide, high-contrast grotesk drawn for headlines and posters -
 * it holds up at 800/900 for the broadside register the fire palette wants,
 * and it keeps the tight, workmanlike feel next to Source Serif 4 body copy.
 *
 * Each exposes a CSS variable rather than a class, so Tailwind's
 * `font-display` / `font-serif` / `font-mono` utilities resolve to them and a
 * component can opt in per element. `app/layout.tsx` mounts them by adding
 * `fontVariables` to <html>.
 *
 * NOTE: the `@fontsource/*` packages in package.json are NOT dead - the
 * postinstall hook (`fonts/init.mjs`) copies their .woff files into `fonts/`,
 * which `app/opengraph-image/route.tsx` and `app/(post)/og/[id]/route.tsx`
 * read from disk for Satori. Removing them breaks OG image generation.
 */

import { Archivo, JetBrains_Mono, Source_Serif_4 } from "next/font/google";

export const displayFont = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"],
  fallback: [
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

export const serifFont = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  style: ["normal", "italic"],
  fallback: [
    "ui-serif",
    "Iowan Old Style",
    "Georgia",
    "Cambria",
    "Times New Roman",
    "serif",
  ],
});

export const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  fallback: [
    "ui-monospace",
    "SFMono-Regular",
    "SF Mono",
    "Menlo",
    "Consolas",
    "Liberation Mono",
    "monospace",
  ],
});

/** Class string for <html>. Mounts all three CSS variables. */
export const fontVariables = [
  displayFont.variable,
  serifFont.variable,
  monoFont.variable,
].join(" ");
