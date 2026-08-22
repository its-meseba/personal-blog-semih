/**
 * Console design system - raw token values.
 *
 * Single source of truth for the palette. Consumed by:
 *  - `app/globals.css`  (as CSS custom properties, hand-mirrored)
 *  - `tailwind.config.js` (through the CSS variables, so opacity utilities work)
 *  - OG image routes / `theme-effect.ts`, which need literal hex, not `var()`
 *
 * Dark is the primary theme; light is the alternate.
 * Rendering surfaces should prefer the Tailwind semantic classes
 * (`bg-background`, `text-muted`, `border-border`, `text-accent`, ...)
 * over importing these values directly. Import from here only when a real
 * hex string is required (Satori/ImageResponse, `<meta name="theme-color">`).
 */

export type ThemeName = "dark" | "light";

export interface ConsolePalette {
  /** page canvas */
  background: string;
  /** panels, code blocks, cards sitting on the canvas */
  surface: string;
  /** a panel that needs to sit above `surface` */
  surfaceRaised: string;
  /** hover state for interactive surfaces */
  surfaceHover: string;
  /** hairlines, dividers, input outlines */
  border: string;
  /** a rule that must be visible, not just felt */
  borderStrong: string;
  /** primary reading colour */
  text: string;
  /** secondary text: meta lines, captions, dates */
  muted: string;
  /** tertiary text: disabled, ordinals, watermarks */
  faint: string;
  /** signal blue - the one accent, page-wide */
  accent: string;
  /** accent under pointer / focus */
  accentHover: string;
  /** accent as a fill behind text (tags, callouts) */
  accentSubtle: string;
  /** text placed on top of a solid `accent` fill */
  accentContrast: string;
}

export const DARK: ConsolePalette = {
  background: "#0C0D10",
  surface: "#16181D",
  surfaceRaised: "#1C1F26",
  surfaceHover: "#20242C",
  border: "#22252B",
  borderStrong: "#2E323A",
  text: "#E6E8EC",
  muted: "#8A9099",
  faint: "#5C626B",
  accent: "#2F81F7",
  accentHover: "#589BFF",
  accentSubtle: "#16233A",
  accentContrast: "#FFFFFF",
};

export const LIGHT: ConsolePalette = {
  background: "#FFFFFF",
  surface: "#F5F6F8",
  surfaceRaised: "#FFFFFF",
  surfaceHover: "#ECEEF2",
  border: "#E4E6EA",
  borderStrong: "#CBD0D8",
  text: "#101215",
  muted: "#5C636D",
  faint: "#868D97",
  accent: "#1858C7",
  accentHover: "#0F44A0",
  accentSubtle: "#E8F0FE",
  accentContrast: "#FFFFFF",
};

export const PALETTE: Record<ThemeName, ConsolePalette> = {
  dark: DARK,
  light: LIGHT,
};

/**
 * Values written into `<meta name="theme-color">`.
 * MUST stay in sync with `app/theme-effect.ts` (which is inlined as a string
 * in the document head and therefore cannot import this module).
 */
export const THEME_COLOR: Record<ThemeName, string> = {
  dark: DARK.background,
  light: LIGHT.background,
};

/** Reading measure for the article column. */
export const MEASURE = "68ch";

/** Font family stacks, mirrored by `app/styles/fonts.ts` / Tailwind. */
export const FONT_STACK = {
  display: 'Sora, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  serif: '"Source Serif 4", ui-serif, Georgia, Cambria, "Times New Roman", serif',
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
} as const;

/** `#RRGGBB` -> `"r g b"`, the channel form Tailwind needs for `/ <alpha-value>`. */
export function toRgbChannels(hex: string): string {
  const value = hex.replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map(c => c + c)
          .join("")
      : value;
  const int = parseInt(full, 16);
  return `${(int >> 16) & 255} ${(int >> 8) & 255} ${int & 255}`;
}
