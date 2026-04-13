/**
 * Scan Config Files Utility
 *
 * Scans and collects all .config.ts files based on the provided options.
 * Uses dynamic import for glob to avoid bundling it when not used.
 */

import type { ViteConfigPluginOptions } from '@/interfaces/vite-config-plugin-options.interface';

/**
 * Scan and collect all .config.ts files
 *
 * @param options - Plugin options containing scan configuration
 * @returns Array of absolute file paths to config files
 */
export async function scanConfigFiles(options: ViteConfigPluginOptions): Promise<string[]> {
  const {
    configFilePattern = 'src/**/*.config.ts',
    excludeDirs = ['node_modules', 'dist', 'build', '.git'],
    root = process.cwd(),
  } = options;

  // Dynamic import to avoid bundling glob when not used.
  const { glob } = await import('glob');

  const patterns = Array.isArray(configFilePattern) ? configFilePattern : [configFilePattern];
  const configFiles: string[] = [];

  for (const pattern of patterns) {
    const files = await glob(pattern, {
      cwd: root,
      absolute: true,
      ignore: excludeDirs.map((dir: string) => `**/${dir}/**`),
    });
    configFiles.push(...files);
  }

  return configFiles;
}
