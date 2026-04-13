/**
 * electron-vite Configuration
 *
 * |--------------------------------------------------------------------------
 * | Configures three build targets:
 * |   - main:     Electron main process (Node.js)
 * |   - preload:  Preload script (contextBridge)
 * |   - renderer: Your Vite app (browser)
 * |--------------------------------------------------------------------------
 *
 * @see https://electron-vite.org/config/
 */

import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  /*
  |--------------------------------------------------------------------------
  | Main Process
  |--------------------------------------------------------------------------
  |
  | Runs in Node.js. Creates BrowserWindow, handles IPC, manages menus.
  | All node_modules are externalized (not bundled).
  |
  */
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: "dist-electron/main",
      rollupOptions: {
        input: {
          index: resolve(__dirname, "src/main/index.ts"),
        },
      },
    },
  },

  /*
  |--------------------------------------------------------------------------
  | Preload Script
  |--------------------------------------------------------------------------
  |
  | Runs in a sandboxed context with access to both Node.js and DOM APIs.
  | Exposes window.electronAPI via contextBridge.
  |
  */
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: "dist-electron/preload",
      rollupOptions: {
        input: {
          index: resolve(__dirname, "src/preload/index.ts"),
        },
      },
    },
  },

  /*
  |--------------------------------------------------------------------------
  | Renderer (Your Vite App)
  |--------------------------------------------------------------------------
  |
  | The web app that runs inside the BrowserWindow.
  | In dev: loads from http://localhost:5173
  | In prod: loads from file://dist-electron/renderer/index.html
  |
  */
  renderer: {
    root: resolve(__dirname, "src/renderer"),
    plugins: [react()],
    build: {
      outDir: "dist-electron/renderer",
      rollupOptions: {
        input: {
          index: resolve(__dirname, "src/renderer/index.html"),
        },
      },
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src/renderer/src"),
      },
    },
  },
});
