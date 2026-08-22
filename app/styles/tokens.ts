/**
 * "Fire max" design system - raw token values.
 *
 * Single source of truth for the palette. Consumed by:
 *  - `app/globals.css`  (as CSS custom properties, hand-mirrored)
 *  - `tailwind.config.js` (through the CSS variables, so opacity utilities work)
 *  - OG image routes / `theme-effect.ts`, which need literal hex, not `var()`
 *
 * Identity: hot orange #FF5A1F as the signature mark, cream/paper as the light
 * ground, near-black ink as the type, plus a warm near-black dark register.
 * Light is the default register; dark is the alternate.
 *
 * Rendering surfaces should prefer the Tailwind semantic classes
 * (`bg-background`, `text-muted`, `border-border`, `text-accent`,
 * `bg-accent-field`, `text-accent-ink`, ...) over importing these values
 * directly. Import from here only when a real hex string is required
 * (Satori/ImageResponse, `<meta name="theme-color">`).
 *
 * ==========================================================================
 * CONTRAST RULE - READ BEFORE TOUCHING ANY ORANGE
 * ==========================================================================
 * The signature hot orange (#FF5A1F) sits at 2.92:1 against the cream ground.
 * That FAILS WCAG AA (4.5:1 body text, 3:1 large text / UI). It is therefore
 * NEVER the colour of body copy, links, or small metadata text on a light
 * ground.
 *
 * The tokens are named for their ROLE so the hot orange cannot be reached for
 * casually. The only legal uses are:
 *
 *   (a) FIELD    - `accentField` as a full-bleed fill with `accentInk`
 *                  (near-black) type on top.            5.94:1  PASS
 *   (b) CHIP     - `accentChip` tint behind `accent` (the muted ember) or ink,
 *                  for tags/badges.                     5.54:1  PASS
 *   (c) MARK     - `accentMark`, the hot orange used ONLY for non-text marks:
 *                  rules, bars, progress, focus rings, selection, callout
 *                  bars. Never carries a glyph.
 *   (d) DARK     - on the dark register the same hot orange reaches 6.05:1,
 *                  so the dark `accent` is a bright ember that IS text-legal.
 *
 * `accent` is the ONLY text-legal accent. On light it is a deep ember
 * (#A83607, 6.16:1); on dark it is a bright orange (#FF7A45, 7.29:1). If you
 * ever want orange text on cream, you want `accent` - not `accentField` and
 * not `accentMark`. If that reads too muted for the job, the answer is a field
 * or a chip, never a lighter text colour.
 */

export type ThemeName = "dark" | "light";

export interface FirePalette {
  /** page canvas - cream paper (light) / warm near-black (dark) */
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
  /** primary reading colour - near-black ink */
  text: string;
  /** secondary text: meta lines, captions, dates (AA on background) */
  muted: string;
  /** tertiary, decorative only: ordinals, watermarks, list markers */
  faint: string;
  /**
   * The one TEXT-LEGAL accent. Deep ember on light, bright orange on dark.
   * Use for links, tag text, small accent labels. AA against background.
   */
  accent: string;
  /** `accent` under pointer / focus - darker on light, lighter on dark */
  accentHover: string;
  /** text placed on top of a solid `accent` fill */
  accentContrast: string;
  /**
   * SIGNATURE HOT ORANGE, as a full-bleed FIELD only. Pair with `accentInk`.
   * Never put small or light-coloured text on this.
   */
  accentField: string;
  /** hover state of a field */
  accentFieldHover: string;
  /** near-black ink, the ONLY type colour allowed on top of `accentField` */
  accentInk: string;
  /**
   * SIGNATURE HOT ORANGE for NON-TEXT marks only: rules, bars, progress,
   * focus rings, selection, the left bar of a callout. Never carries a glyph.
   */
  accentMark: string;
  /** tint fill behind a chip/tag; pair with `accent` or `text` */
  accentChip: string;
}

export const LIGHT: FirePalette = {
  background: "#FBF7F1",
  surface: "#F3EDE3",
  surfaceRaised: "#FFFDF9",
  surfaceHover: "#EBE3D6",
  border: "#E0D7C8",
  borderStrong: "#C6B9A4",
  text: "#16130F",
  muted: "#5F574C",
  faint: "#7B7264",
  accent: "#A83607",
  accentHover: "#7E2704",
  accentContrast: "#FFF8F2",
  accentField: "#FF5A1F",
  accentFieldHover: "#E84A12",
  accentInk: "#16130F",
  accentMark: "#FF5A1F",
  accentChip: "#FFE7DA",
};

export const DARK: FirePalette = {
  background: "#121110",
  surface: "#1B1917",
  surfaceRaised: "#221F1C",
  surfaceHover: "#2A2622",
  border: "#2A2622",
  borderStrong: "#3A342E",
  text: "#F2EBE0",
  muted: "#A79C8D",
  faint: "#837A6C",
  accent: "#FF7A45",
  accentHover: "#FF9A6E",
  accentContrast: "#16130F",
  accentField: "#FF5A1F",
  accentFieldHover: "#FF6F36",
  accentInk: "#16130F",
  accentMark: "#FF5A1F",
  accentChip: "#2E1A10",
};

export const PALETTE: Record<ThemeName, FirePalette> = {
  dark: DARK,
  light: LIGHT,
};

/**
 * Values written into `<meta name="theme-color">`.
 * MUST stay in sync with `app/theme-effect.ts` (which is inlined as a string
 * in the document head and therefore cannot import this module) and with the
 * `viewport.themeColor` entries in `app/layout.tsx`.
 */
export const THEME_COLOR: Record<ThemeName, string> = {
  dark: DARK.background,
  light: LIGHT.background,
};

/** Reading measure for the article column. */
export const MEASURE = "68ch";

/** Font family stacks, mirrored by `app/styles/fonts.ts` / Tailwind. */
export const FONT_STACK = {
  display: 'Archivo, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
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
