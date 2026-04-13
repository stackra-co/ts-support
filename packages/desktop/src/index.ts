/**
 * @abdokouta/ts-desktop
 *
 * |--------------------------------------------------------------------------
 * | Electron Desktop Integration
 * |--------------------------------------------------------------------------
 * |
 * | Platform-agnostic desktop integration with DI, decorators, and hooks.
 * | Same code runs in Electron (real IPC) and browser (graceful fallbacks).
 * |
 * | Architecture:
 * |   DesktopModule.forRoot() → DesktopManager → DesktopBridge
 * |   @Menu() + @MenuItem() → auto-discovered menu definitions
 * |   useDesktop() → platform bridge in React components
 * |
 * @module @abdokouta/ts-desktop
 */

import "reflect-metadata";

// Module
export { DesktopModule } from "./desktop.module";

// Services
export { DesktopManager } from "./services";

// Bridge
export { ElectronBridge, BrowserBridge } from "./bridge";

// Decorators
export { Menu, MenuItem, Shortcut, OnIpc } from "./decorators";
export type { ShortcutMetadata, OnIpcMetadata } from "./decorators";

// Hooks
export { useDesktop, useMenuAction } from "./hooks";

// Interfaces
export type {
  DesktopModuleOptions,
  DesktopBridge,
  MenuItemOptions,
  MenuMetadata,
  MenuItemMetadata,
} from "./interfaces";

// Constants
export {
  DESKTOP_CONFIG,
  DESKTOP_MANAGER,
  MENU_METADATA,
  MENU_ITEM_METADATA,
  SHORTCUT_METADATA,
  ON_IPC_METADATA,
} from "./constants";
