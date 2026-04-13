/**
 * Electron Preload Script
 *
 * |--------------------------------------------------------------------------
 * | Bridge between the main process (Node.js) and renderer (browser).
 * |--------------------------------------------------------------------------
 * |
 * | Exposes window.electronAPI via contextBridge.
 * | The renderer can ONLY access what's explicitly exposed here.
 * | This is the security boundary — never expose ipcRenderer directly.
 * |
 */

import { contextBridge, ipcRenderer } from "electron";

/**
 * Expose a safe API to the renderer process.
 *
 * The renderer accesses these via window.electronAPI.
 * Matches the ElectronBridge interface in @abdokouta/ts-desktop.
 */
contextBridge.exposeInMainWorld("electronAPI", {
  /*
  |--------------------------------------------------------------------------
  | App Info
  |--------------------------------------------------------------------------
  */
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),

  /*
  |--------------------------------------------------------------------------
  | Printing
  |--------------------------------------------------------------------------
  */
  print: (html: string) => ipcRenderer.invoke("print-receipt", html),

  /*
  |--------------------------------------------------------------------------
  | Cash Drawer
  |--------------------------------------------------------------------------
  */
  openCashDrawer: () => ipcRenderer.invoke("open-cash-drawer"),

  /*
  |--------------------------------------------------------------------------
  | File Export
  |--------------------------------------------------------------------------
  */
  exportFile: (data: string, filename: string) => ipcRenderer.invoke("export-file", data, filename),

  /*
  |--------------------------------------------------------------------------
  | Notifications
  |--------------------------------------------------------------------------
  */
  notify: (title: string, body: string) => ipcRenderer.invoke("notify", title, body),

  /*
  |--------------------------------------------------------------------------
  | Auto-Update
  |--------------------------------------------------------------------------
  */
  checkForUpdates: () => ipcRenderer.invoke("check-updates"),

  /*
  |--------------------------------------------------------------------------
  | Generic IPC
  |--------------------------------------------------------------------------
  */
  send: (channel: string, ...args: unknown[]) => ipcRenderer.send(channel, ...args),

  invoke: <T = unknown>(channel: string, ...args: unknown[]): Promise<T> =>
    ipcRenderer.invoke(channel, ...args),

  /**
   * Listen for messages from the main process.
   * Returns an unsubscribe function.
   */
  on: (channel: string, callback: (...args: unknown[]) => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, ...args: unknown[]) => callback(...args);
    ipcRenderer.on(channel, handler);
    return () => ipcRenderer.removeListener(channel, handler);
  },
});
