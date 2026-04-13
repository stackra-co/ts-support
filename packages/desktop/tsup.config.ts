import { defineConfig } from "tsup";

/**
 * tsup Build Configuration — @abdokouta/ts-desktop
 */
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
  target: "es2020",
  platform: "neutral",
  external: [
    "@abdokouta/ts-container",
    "@abdokouta/ts-container-react",
    "@abdokouta/ts-support",
    "electron",
    "react",
  ],
  splitting: false,
  skipNodeModulesBundle: true,
  outExtension({ format }) {
    return { js: format === "esm" ? ".mjs" : ".js" };
  },
});
