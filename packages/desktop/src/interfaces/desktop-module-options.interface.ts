/**
 * Desktop Module Options
 *
 * Configuration for DesktopModule.forRoot().
 *
 * @module @abdokouta/ts-desktop
 */

export interface DesktopModuleOptions {
  /** Application name shown in the title bar and dock. */
  appName: string;

  /** Title bar style. 'native' uses OS chrome, 'hidden' for custom title bar. */
  titleBarStyle?: "native" | "hidden" | "hiddenInset";

  /** Default window width. @default 1280 */
  width?: number;

  /** Default window height. @default 800 */
  height?: number;

  /** Minimum window width. @default 800 */
  minWidth?: number;

  /** Minimum window height. @default 600 */
  minHeight?: number;

  /** Enable auto-update via electron-updater. @default false */
  autoUpdate?: boolean;

  /** Show system tray icon. @default false */
  tray?: boolean;

  /** Enable DevTools in production. @default false */
  devToolsInProduction?: boolean;

  /** URL to load in dev mode. @default 'http://localhost:5173' */
  devUrl?: string;
}
