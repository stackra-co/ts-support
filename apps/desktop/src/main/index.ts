/**
 * Electron Main Process
 *
 * |--------------------------------------------------------------------------
 * | Entry point for the Electron application.
 * |--------------------------------------------------------------------------
 * |
 * | Creates the main BrowserWindow, sets up the app menu,
 * | registers IPC handlers, and manages the app lifecycle.
 * |
 */

import { app, BrowserWindow, shell, ipcMain, Menu, Notification, dialog } from "electron";
import { join } from "path";
import { writeFileSync } from "fs";

/*
|--------------------------------------------------------------------------
| Window Creation
|--------------------------------------------------------------------------
*/

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: "Pixielity",
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Dev: load from Vite dev server. Prod: load built HTML.
  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  // Open external links in the default browser.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

/*
|--------------------------------------------------------------------------
| App Menu
|--------------------------------------------------------------------------
|
| Native menu bar: File, Edit, View, Window, Help.
| Menu actions send IPC messages to the renderer.
|
*/

function createMenu(): void {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: "File",
      submenu: [
        {
          label: "New Order",
          accelerator: "CmdOrCtrl+N",
          click: () => mainWindow?.webContents.send("menu:new-order"),
        },
        {
          label: "Print Receipt",
          accelerator: "CmdOrCtrl+P",
          click: () => mainWindow?.webContents.send("menu:print"),
        },
        { type: "separator" },
        {
          label: "Export Data",
          accelerator: "CmdOrCtrl+E",
          click: () => mainWindow?.webContents.send("menu:export"),
        },
        { type: "separator" },
        { role: "quit" },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Window",
      submenu: [{ role: "minimize" }, { role: "zoom" }, { type: "separator" }, { role: "close" }],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "Documentation",
          click: () => shell.openExternal("https://pixielity.com/docs"),
        },
        {
          label: "About",
          click: () => {
            dialog.showMessageBox({
              type: "info",
              title: "About Pixielity",
              message: `Pixielity Desktop v${app.getVersion()}`,
              detail: "Built with Electron + Vite + React",
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

/*
|--------------------------------------------------------------------------
| IPC Handlers
|--------------------------------------------------------------------------
|
| Handle requests from the renderer process (via preload bridge).
|
*/

function registerIpcHandlers(): void {
  // Print receipt HTML.
  ipcMain.handle("print-receipt", async (_event, html: string) => {
    const win = new BrowserWindow({ show: false });
    win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
    win.webContents.on("did-finish-load", () => {
      win.webContents.print({}, () => win.close());
    });
  });

  // Open cash drawer (placeholder — implement serial port command).
  ipcMain.handle("open-cash-drawer", async () => {
    console.log("[Main] Cash drawer open command sent");
  });

  // Export file — opens save dialog.
  ipcMain.handle("export-file", async (_event, data: string, filename: string) => {
    const result = await dialog.showSaveDialog(mainWindow!, {
      defaultPath: filename,
      filters: [
        { name: "CSV", extensions: ["csv"] },
        { name: "JSON", extensions: ["json"] },
        { name: "All Files", extensions: ["*"] },
      ],
    });
    if (!result.canceled && result.filePath) {
      writeFileSync(result.filePath, data, "utf-8");
      return result.filePath;
    }
    return null;
  });

  // Show OS notification.
  ipcMain.handle("notify", async (_event, title: string, body: string) => {
    new Notification({ title, body }).show();
  });

  // Get app version.
  ipcMain.handle("get-app-version", () => app.getVersion());
}

/*
|--------------------------------------------------------------------------
| App Lifecycle
|--------------------------------------------------------------------------
*/

app.whenReady().then(() => {
  createMenu();
  registerIpcHandlers();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
