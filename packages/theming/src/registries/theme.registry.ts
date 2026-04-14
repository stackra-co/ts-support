/**
 * Theme Registry
 *
 * |--------------------------------------------------------------------------
 * | Registry for named themes.
 * |--------------------------------------------------------------------------
 * |
 * | Modules register themes here via ThemeModule.forRoot() or
 * | ThemeModule.registerTheme(). The ThemeProvider and ThemeSwitcher
 * | consume them.
 * |
 * | Extends BaseRegistry from @abdokouta/react-support for consistent
 * | registry API (get, has, getAll, getKeys, register, clear).
 * |
 * @module @abdokouta/react-theming
 * @category Registries
 */

import { Injectable } from "@abdokouta/ts-container";
import { BaseRegistry } from "@abdokouta/react-support";
import type { ThemeConfig } from "@/types/theme.types";

@Injectable()
export class ThemeRegistry extends BaseRegistry<ThemeConfig> {
  /*
  |--------------------------------------------------------------------------
  | getThemes
  |--------------------------------------------------------------------------
  |
  | Returns all registered themes in registration order.
  |
  */
  getThemes(): ThemeConfig[] {
    return this.getAll();
  }

  /*
  |--------------------------------------------------------------------------
  | getThemeIds
  |--------------------------------------------------------------------------
  |
  | Returns theme ids — used by next-themes `themes` prop.
  |
  */
  getThemeIds(): string[] {
    return this.getKeys();
  }
}

/** Global singleton ThemeRegistry — shared across forRoot and forFeature. */
export const themeRegistry = new ThemeRegistry();
