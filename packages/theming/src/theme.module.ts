/**
 * @fileoverview ThemeModule
 *
 * DI module for the `@abdokouta/react-theming` package.
 *
 * @module @abdokouta/react-theming
 *
 * @example Basic setup
 * ```ts
 * @Module({ imports: [ThemeModule.forRoot()] })
 * export class AppModule {}
 * ```
 *
 * @example Register a customizer panel
 * ```ts
 * @Module({
 *   imports: [
 *     ThemeModule.forRoot(),
 *     ThemeModule.registerCustomizer({
 *       id: "auth",
 *       title: "Auth",
 *       component: AuthThemeCustomizer,
 *       order: 10,
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 */

import "reflect-metadata";
import { Module, type DynamicModule } from "@abdokouta/ts-container";
import {
  customizerRegistry,
  type CustomizerPanel,
} from "@/registries/customizer.registry";
import { themeRegistry } from "@/registries/theme.registry";
import type { ThemeConfig, ThemeModuleOptions } from "@/types/theme.types";

// ─── Built-in themes ──────────────────────────────────────────────────────────

const BUILT_IN_THEMES: ThemeConfig[] = [
  { id: "default", label: "Default", color: "#6366f1" },
  { id: "netflix", label: "Netflix", color: "#e50914" },
  { id: "ocean",   label: "Ocean",   color: "#0ea5e9" },
  { id: "rose",    label: "Rose",    color: "#f43f5e" },
  { id: "forest",  label: "Forest",  color: "#22c55e" },
  { id: "amber",   label: "Amber",   color: "#f59e0b" },
  { id: "violet",  label: "Violet",  color: "#8b5cf6" },
];

// ─── ThemeModule ──────────────────────────────────────────────────────────────
@Module({})
export class ThemeModule {
  /**
   * Configure the theming module.
   * Registers built-in themes + any extra themes from options.
   */
  static forRoot(options: ThemeModuleOptions = {}): DynamicModule {
    // Register built-ins (idempotent — skip if already registered)
    for (const theme of BUILT_IN_THEMES) {
      if (!themeRegistry.has(theme.id)) {
        themeRegistry.register(theme.id, theme);
      }
    }
    // Register any extra themes from options
    if (options.themes) {
      for (const theme of options.themes) {
        themeRegistry.register(theme.id, theme);
      }
    }
    return { module: ThemeModule, providers: [], exports: [] };
  }

  /**
   * Register a single customizer panel.
   */
  static registerCustomizer(panel: CustomizerPanel): DynamicModule {
    customizerRegistry.register(panel.id, panel);
    return { module: ThemeModule, providers: [], exports: [] };
  }

  /**
   * Register multiple customizer panels at once.
   */
  static registerCustomizers(panels: CustomizerPanel[]): DynamicModule {
    for (const panel of panels) {
      customizerRegistry.register(panel.id, panel);
    }
    return { module: ThemeModule, providers: [], exports: [] };
  }

  /**
   * Register a custom theme.
   */
  static registerTheme(theme: ThemeConfig): DynamicModule {
    themeRegistry.register(theme.id, theme);
    return { module: ThemeModule, providers: [], exports: [] };
  }

  /**
   * Register multiple custom themes.
   */
  static registerThemes(themes: ThemeConfig[]): DynamicModule {
    for (const theme of themes) {
      themeRegistry.register(theme.id, theme);
    }
    return { module: ThemeModule, providers: [], exports: [] };
  }
}
