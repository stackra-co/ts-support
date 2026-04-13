/**
 * Desktop Manager
 *
 * |--------------------------------------------------------------------------
 * | Central orchestrator for the desktop integration.
 * |--------------------------------------------------------------------------
 * |
 * | Manages the platform bridge (Electron vs Browser), menu registry,
 * | and provides the consumer-facing DesktopService.
 * |
 * | Auto-detects the platform on init:
 * |   - window.electronAPI exists → ElectronBridge
 * |   - otherwise → BrowserBridge (graceful fallbacks)
 * |
 * @module @abdokouta/ts-desktop
 */

import { Injectable, Inject } from "@abdokouta/ts-container";

import { DESKTOP_CONFIG } from "@/constants";
import type { DesktopModuleOptions, DesktopBridge } from "@/interfaces";
import { ElectronBridge } from "@/bridge/electron-bridge";
import { BrowserBridge } from "@/bridge/browser-bridge";

@Injectable()
export class DesktopManager {
  private _bridge: DesktopBridge | null = null;
  private readonly config: DesktopModuleOptions;

  constructor(@Inject(DESKTOP_CONFIG) config: DesktopModuleOptions) {
    this.config = config;
  }

  /**
   * Get the platform bridge.
   *
   * Lazily created on first access. Auto-detects Electron vs browser.
   */
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

  /**
   * Detect the platform and create the appropriate bridge.
   */
  private _detectBridge(): DesktopBridge {
    if (typeof window !== "undefined" && window.electronAPI) {
      return new ElectronBridge();
    }
    return new BrowserBridge();
  }
}
