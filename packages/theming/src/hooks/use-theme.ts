/**
 * @fileoverview useTheme Hook
 *
 * Access and control the active named theme.
 *
 * @module @abdokouta/react-theming
 * @category Hooks
 *
 * @example
 * ```tsx
 * const { theme, setTheme, themes } = useTheme();
 * ```
 */

"use client";

import { useThemeContext } from "@/contexts/theme.context";
import type { ThemeConfig } from "@/types/theme.types";

export interface UseThemeReturn {
  /** Currently active theme id */
  theme: string;
  /** Set the active theme by id */
  setTheme: (id: string) => void;
  /** All registered themes */
  themes: ThemeConfig[];
}

export function useTheme(): UseThemeReturn {
  const { theme, setTheme, themes } = useThemeContext();
  return { theme, setTheme, themes };
}
