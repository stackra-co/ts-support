/**
 * DI Tokens for @abdokouta/ts-desktop
 *
 * @module @abdokouta/ts-desktop
 */

/** Injection token for the desktop module configuration. */
export const DESKTOP_CONFIG = Symbol.for("DESKTOP_CONFIG");

/** Injection token for the DesktopManager. */
export const DESKTOP_MANAGER = Symbol.for("DESKTOP_MANAGER");

/** Metadata key for @Menu() decorator. */
export const MENU_METADATA = Symbol.for("MENU_METADATA");

/** Metadata key for @MenuItem() decorator. */
export const MENU_ITEM_METADATA = Symbol.for("MENU_ITEM_METADATA");

/** Metadata key for @Shortcut() decorator. */
export const SHORTCUT_METADATA = Symbol.for("SHORTCUT_METADATA");

/** Metadata key for @OnIpc() decorator. */
export const ON_IPC_METADATA = Symbol.for("ON_IPC_METADATA");
