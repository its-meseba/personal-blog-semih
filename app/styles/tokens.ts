/** meseba: burgundy, warm paper, ink, and muted rose.
 * Keep CSS channels in globals.css and theme-effect.ts canvas colors in sync.
 * Pair accentField with accentInk; rose is decorative on light backgrounds.
 */
export type ThemeName = "dark" | "light";
export interface BrandPalette {
  background: string;
  surface: string;
  surfaceRaised: string;
  surfaceHover: string;
  border: string;
  borderStrong: string;
  text: string;
  muted: string;
  faint: string;
  accent: string;
  accentHover: string;
  accentContrast: string;
  accentField: string;
  accentFieldHover: string;
  accentInk: string;
  accentMark: string;
  accentChip: string;
}

export const LIGHT: BrandPalette = {
  background: "#F4EFE7",
  surface: "#ECE4DC",
  surfaceRaised: "#FCF8F3",
  surfaceHover: "#E7DCD6",
  border: "#DBCDC7",
  borderStrong: "#C69A9C",
  text: "#242326",
  muted: "#64585E",
  faint: "#817078",
  accent: "#722F43",
  accentHover: "#592334",
  accentContrast: "#F4EFE7",
  accentField: "#722F43",
  accentFieldHover: "#592334",
  accentInk: "#F4EFE7",
  accentMark: "#722F43",
  accentChip: "#EAD7DB",
};

export const DARK: BrandPalette = {
  background: "#242326",
  surface: "#2D292D",
  surfaceRaised: "#373035",
  surfaceHover: "#40363C",
  border: "#4B3F45",
  borderStrong: "#82626E",
  text: "#F4EFE7",
  muted: "#C7B6BD",
  faint: "#A38B96",
  accent: "#D9A7B5",
  accentHover: "#E9BEC9",
  accentContrast: "#242326",
  accentField: "#722F43",
  accentFieldHover: "#81394F",
  accentInk: "#F4EFE7",
  accentMark: "#D9A7B5",
  accentChip: "#442D36",
};

export const PALETTE: Record<ThemeName, BrandPalette> = {
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
