/**
 * Desktop Manager
 *
 * |--------------------------------------------------------------------------
 * | Central orchestrator for the desktop integration.
 * |--------------------------------------------------------------------------
 * |
 * | On init:
 * |   1. Detects platform (Electron vs browser)
 * |   2. Reads MenuRegistry for collected @Menu items
 * |   3. Sends the menu template to the Electron main process via IPC
 * |   4. Registers IPC listeners for menu action callbacks
 * |
 * @module @abdokouta/ts-desktop
 */

import { Injectable, Inject, Optional, type OnModuleInit } from "@abdokouta/ts-container";

import { DESKTOP_CONFIG } from "@/constants";
import type { DesktopModuleOptions, DesktopBridge } from "@/interfaces";
import { ElectronBridge } from "@/bridge/electron-bridge";
import { BrowserBridge } from "@/bridge/browser-bridge";
import { MenuRegistry } from "./menu-registry.service";

@Injectable()
export class DesktopManager implements OnModuleInit {
  private _bridge: DesktopBridge | null = null;
  private readonly config: DesktopModuleOptions;
  private readonly menuRegistry: MenuRegistry;

  constructor(
    @Inject(DESKTOP_CONFIG) config: DesktopModuleOptions,
    @Optional() @Inject(MenuRegistry) menuRegistry?: MenuRegistry,
  ) {
    this.config = config;
    this.menuRegistry = menuRegistry ?? new MenuRegistry();
  }

  /*
  |--------------------------------------------------------------------------
  | onModuleInit — called after DI container is fully bootstrapped
  |--------------------------------------------------------------------------
  |
  | At this point, all forFeature() calls have run and the MenuRegistry
  | has all @Menu items collected. We send the template to the main process.
  |
  */
  onModuleInit(): void {
    if (!this.isDesktop) return;

    // Send the menu template to the Electron main process.
    const template = this.menuRegistry.buildTemplate();
    if (template.length > 0) {
      this.bridge.send("menu:set", template);
      console.log(
        `[DesktopManager] Sent menu template to main process: ${template.map((m) => m.label).join(", ")}`,
      );
    }

    // Register IPC listeners for menu action callbacks.
    for (const channel of this.menuRegistry.getChannels()) {
      const handler = this.menuRegistry.getHandler(channel);
      if (handler) {
        this.bridge.onMenuAction(channel, handler);
      }
    }
  }

  /** Get the platform bridge. */
  get bridge(): DesktopBridge {
    if (!this._bridge) {
      this._bridge = this._detectBridge();
    }
    return this._bridge;
  }

  /** Whether the app is running inside Electron. */
  get isDesktop(): boolean {
    return this.bridge.isDesktop;
  }

  /** Get the module configuration. */
  getConfig(): DesktopModuleOptions {
    return this.config;
  }

  /** Get the app name from config. */
  getAppName(): string {
    return this.config.appName;
  }

  /** Get the menu registry. */
  getMenuRegistry(): MenuRegistry {
    return this.menuRegistry;
  }

  private _detectBridge(): DesktopBridge {
    if (typeof window !== "undefined" && (window as any).electronAPI) {
      return new ElectronBridge();
    }
    return new BrowserBridge();
  }
}
