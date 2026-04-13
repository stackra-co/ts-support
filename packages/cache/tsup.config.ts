import { defineConfig } from 'tsup';

/**
 * tsup Configuration for @abdokouta/ts-cache
 *
 * Multi-driver cache system with memory, Redis, and null stores.
 * Builds with dual format output (ESM + CJS).
 *
 * @see https://tsup.egoist.dev/
 */
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
  target: 'es2020',
  platform: 'neutral',
  external: [
    '@abdokouta/ts-container',
    '@abdokouta/ts-container-react',
    '@abdokouta/ts-support',
    '@abdokouta/ts-redis',
    '@upstash/redis',
    'react',
  ],
  splitting: false,
  skipNodeModulesBundle: true,
  outExtension({ format }) {
    return { js: format === 'esm' ? '.mjs' : '.js' };
  },
});
