import { defineConfig } from "tsup";
import { resolve } from "path";

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: {
    resolve: true,
  },
  sourcemap: true,
  clean: !options.watch,
  external: ["react", "react-dom", "@heroui/react", "reflect-metadata", "next-themes"],
  treeshake: true,
  esbuildOptions(options) {
    options.alias = {
      "@": resolve(__dirname, "src"),
    };
  },
}));
