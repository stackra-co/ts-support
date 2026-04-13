import { defineConfig } from 'tsup';

/**
 * tsup Configuration for @abdokouta/ts-eloquent
 *
 * Laravel Eloquent-style ORM built on RxDB.
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
    '@abdokouta/ts-support',
    '@abdokouta/ts-logger',
    'rxdb',
    'rxjs',
    '@supabase/supabase-js',
  ],
  splitting: false,
  skipNodeModulesBundle: true,
  outExtension({ format }) {
    return { js: format === 'esm' ? '.mjs' : '.js' };
  },
});
