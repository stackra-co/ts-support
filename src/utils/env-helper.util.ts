/**
 * Standalone env() Helper
 *
 * A convenience function that wraps `Env.get()` for use with the
 * auto-import plugin. Provides the same API as the `Env.get()` static
 * method but as a standalone function call.
 *
 * @module env/env-helper
 *
 * @example
 * ```typescript
 * // Auto-imported — no explicit import needed
 * const appName = env("VITE_APP_NAME", "My App");
 * const timeout = env("VITE_TIMEOUT", 5000);
 * const debug = env("VITE_DEBUG", false);
 * ```
 */

import { Env } from "@/services/env.service";

/**
 * Allowed fallback value types for environment variable access.
 */
type EnvValue = string | number | boolean | undefined;

/**
 * Get an environment variable value with an optional fallback.
 *
 * Delegates to `Env.get()` — reads from the repository configured
 * via `Env.setRepository()` (typically `import.meta.env` in Vite apps).
 *
 * @typeParam T - The fallback value type (inferred from the default)
 * @param key - The environment variable name (e.g. `'VITE_APP_NAME'`)
 * @param fallback - Default value returned when the variable is not set
 * @returns The variable's string value, or the fallback if not set
 *
 * @example
 * ```typescript
 * env("VITE_API_URL", "https://api.example.com");  // string
 * env("VITE_PORT", 3000);                          // string | number
 * env("VITE_DEBUG", false);                        // string | boolean
 * env("VITE_SECRET");                              // string | undefined
 * ```
 */
export function env<T extends EnvValue = undefined>(key: string, fallback?: T): string | T {
  return Env.get(key, fallback);
}
