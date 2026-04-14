/**
 * @fileoverview Theme Types
 * @module @abdokouta/react-theming
 * @category Types
 */

/** Color mode — maps to next-themes values */
export type ColorMode = "light" | "dark" | "system";

/**
 * Full set of HeroUI CSS variable overrides for one mode.
 * Values are raw oklch strings e.g. "58.14% 0.2349 27.99"
 * OR plain CSS values for non-color vars like radius.
 *
 * NOTE: For built-in themes, define vars in globals.css using
 * [data-theme="id"] selectors. This type is for programmatic/runtime themes.
 */
export interface ThemeVars {
  accent?: string;
  accentForeground?: string;
  background?: string;
  foreground?: string;
  surface?: string;
  surfaceForeground?: string;
  surfaceSecondary?: string;
  surfaceSecondaryForeground?: string;
  surfaceTertiary?: string;
  surfaceTertiaryForeground?: string;
  overlay?: string;
  overlayForeground?: string;
  muted?: string;
  border?: string;
  separator?: string;
  scrollbar?: string;
  focus?: string;
  default?: string;
  defaultForeground?: string;
  fieldBackground?: string;
  fieldForeground?: string;
  fieldPlaceholder?: string;
  segment?: string;
  segmentForeground?: string;
  success?: string;
  successForeground?: string;
  warning?: string;
  warningForeground?: string;
  danger?: string;
  dangerForeground?: string;
  /** Plain CSS value e.g. "0.5rem" */
  radius?: string;
  /** Plain CSS value e.g. "0.75rem" */
  fieldRadius?: string;
}

/** A registered theme entry */
export interface ThemeConfig {
  /** Unique theme identifier */
  id: string;
  /** Display label shown in the theme switcher */
  label: string;
  /** Preview hex color shown as a swatch */
  color?: string;
  /**
   * Light mode CSS variable overrides.
   * For built-in themes prefer CSS [data-theme] selectors in globals.css.
   * For runtime/programmatic themes use these fields.
   */
  light?: ThemeVars;
  /** Dark mode CSS variable overrides. */
  dark?: ThemeVars;
}

/** ThemeModule forRoot options */
export interface ThemeModuleOptions {
  /** Default color mode. @default "system" */
  defaultMode?: ColorMode;
  /** Default theme id. @default "default" */
  defaultTheme?: string;
  /** localStorage key for persisting the color palette. @default "theme-color" */
  storageKey?: string;
  /** Additional themes to register on init */
  themes?: ThemeConfig[];
}
