import { defineConfig } from 'tsup';
import { reactLibPreset } from '@nesvel/tsup-config';

/**
 * Build configuration for @abdokouta/react-i18n
 *
 Uses the React library preset which:
 * - Outputs both ESM and CJS formats
 * - Externalizes React dependencies
 * - Enables automatic JSX transform
 * - Generates TypeScript declarations
 */
export default defineConfig({
  ...reactLibPreset,
  bundle: true,
  external: [
    '@abdokouta/ts-container',
    '@abdokouta/ts-http',
    '@abdokouta/ts-support',
    'i18next',
    'i18next-browser-languagedetector',
    'i18next-http-backend',
    'react-i18next',
    'react',
    'react-dom',
  ],
});
