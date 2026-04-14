/**
 * @fileoverview Theme Registry
 *
 * Registry for named themes. Modules register themes here;
 * the ThemeProvider and ThemeSwitcher consume them.
 *
 * @module @abdokouta/react-theming
 * @category Registries
 */

import { BaseRegistry } from "@abdokouta/react-support";
import type { ThemeConfig } from "@/types/theme.types";

export class ThemeRegistry extends BaseRegistry<ThemeConfig> {
  /** Returns all themes sorted by registration order */
  getThemes(): ThemeConfig[] {
    return this.getAll();
  }

  /** Returns theme ids — used by next-themes `themes` prop */
  getThemeIds(): string[] {
    return this.getKeys();
  }
}

export const themeRegistry = new ThemeRegistry();
