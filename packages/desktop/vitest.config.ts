/**
 * Vitest Configuration
 *
 * |--------------------------------------------------------------------------
 * | @abdokouta/ts-desktop
 * |--------------------------------------------------------------------------
 * |
 * | Test runner configuration for the desktop integration package.
 * |
 * | Features:
 * |   - Global test functions (describe, it, expect) — no imports needed
 * |   - jsdom environment for simulating browser/Electron renderer
 * |   - Setup file for mocking DI decorators and window.electronAPI
 * |   - v8 coverage provider (faster than istanbul)
 * |   - Path alias @ → ./src for consistent imports
 * |   - passWithNoTests — CI won't fail if no tests exist yet
 * |
 * @see https://vitest.dev/config/
 */

import { fileURLToPath } from "url";
import { resolve, dirname } from "path";
import { defineConfig } from "vitest/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  test: {
    /*
    |--------------------------------------------------------------------------
    | Globals
    |--------------------------------------------------------------------------
    */
    globals: true,

    /*
    |--------------------------------------------------------------------------
    | Environment
    |--------------------------------------------------------------------------
    |
    | jsdom simulates a browser DOM — required for testing services that
    | check window.electronAPI, navigator.onLine, document.addEventListener.
    |
    */
    environment: "jsdom",

    /*
    |--------------------------------------------------------------------------
    | Setup Files
    |--------------------------------------------------------------------------
    */
    setupFiles: ["./__tests__/vitest.setup.ts"],

    /*
    |--------------------------------------------------------------------------
    | Test File Pattern
    |--------------------------------------------------------------------------
    */
    include: ["__tests__/**/*.{test,spec}.{ts,tsx}"],

    /*
    |--------------------------------------------------------------------------
    | Pass With No Tests
    |--------------------------------------------------------------------------
    */
    passWithNoTests: true,

    /*
    |--------------------------------------------------------------------------
    | Server Dependencies
    |--------------------------------------------------------------------------
    */
    server: {
      deps: {
        inline: ["inversiland", "@inversiland/inversify"],
      },
    },

    /*
    |--------------------------------------------------------------------------
    | Coverage
    |--------------------------------------------------------------------------
    */
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "test/",
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.config.ts",
      ],
    },
  },

  /*
  |--------------------------------------------------------------------------
  | Path Aliases
  |--------------------------------------------------------------------------
  */
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
