/**
 * Electron Main Process
 *
 * |--------------------------------------------------------------------------
 * | Thin shell that wraps the existing Vite app.
 * |--------------------------------------------------------------------------
 * |
 * | Dev:  loads http://localhost:5173 (Vite dev server)
 * | Prod: loads ../vite/dist/index.html (built Vite app)
 * |
 * | Menu is built dynamically:
 * |   1. Starts with a minimal default menu (Edit, View, Window, Help)
 * |   2. Renderer sends 'menu:set' with the full template from MenuRegistry
 * |   3. Main process rebuilds the native menu from the template
 * |
 */

import { app, BrowserWindow, shell, ipcMain, Menu, Notification, dialog } from "electron";
import { join } from "path";
import { writeFileSync } from "fs";

const isDev = !app.isPackaged;
const isMac = process.platform === "darwin";

/*
|--------------------------------------------------------------------------
| Window
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
    backgroundColor: "#18181b",
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 15, y: 15 },
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, "../../renderer/index.html"));
  }

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
| Default Menu (before renderer sends the full template)
|--------------------------------------------------------------------------
|
| Minimal menu that's shown while the DI container boots.
| Once the renderer sends 'menu:set', this gets replaced.
|
*/

function createDefaultMenu(): void {
  const template: Electron.MenuItemConstructorOptions[] = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" as const },
              { type: "separator" as const },
              { role: "services" as const },
              { type: "separator" as const },
              { role: "hide" as const },
              { role: "hideOthers" as const },
              { role: "unhide" as const },
              { type: "separator" as const },
              { role: "quit" as const },
            ],
          },
        ]
      : []),
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
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
      submenu: [{ role: "minimize" }, { role: "zoom" }],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

/*
|--------------------------------------------------------------------------
| Dynamic Menu (received from renderer via IPC)
|--------------------------------------------------------------------------
|
| The renderer's MenuRegistry collects @Menu/@MenuItem decorated classes
| and sends the full template here. We convert it to Electron's format
| and rebuild the native menu.
|
| SerializedMenu format (from @abdokouta/ts-desktop):
| {
|   id: 'file',
|   label: 'File',
|   order: 0,
|   items: [
|     { label: 'New Order', accelerator: 'CmdOrCtrl+N', ipcChannel: 'menu:file:newOrder' },
|     { type: 'separator' },
|     { role: 'quit' },
|   ]
| }
|
*/

interface SerializedMenuItem {
  label?: string;
  accelerator?: string;
  type?: string;
  role?: string;
  enabled?: boolean;
  visible?: boolean;
  ipcChannel?: string;
}

interface SerializedMenu {
  id: string;
  label: string;
  order: number;
  items: SerializedMenuItem[];
}

function buildMenuFromTemplate(menus: SerializedMenu[]): void {
  const template: Electron.MenuItemConstructorOptions[] = [];

  // macOS app menu (always first).
  if (isMac) {
    template.push({
      label: app.name,
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
      ],
    });
  }

  // Convert each SerializedMenu to Electron format.
  for (const menu of menus) {
    const submenu: Electron.MenuItemConstructorOptions[] = [];

    for (const item of menu.items) {
      // Role-based items (undo, redo, cut, copy, paste, quit, etc.)
      if (item.role) {
        submenu.push({ role: item.role as any });
        continue;
      }

      // Separator
      if (item.type === "separator") {
        submenu.push({ type: "separator" });
        continue;
      }

      // Custom item with IPC channel
      submenu.push({
        label: item.label,
        accelerator: item.accelerator,
        enabled: item.enabled ?? true,
        visible: item.visible ?? true,
        click: item.ipcChannel ? () => mainWindow?.webContents.send(item.ipcChannel!) : undefined,
      });
    }

    template.push({ label: menu.label, submenu });
  }

  // Always add Window menu.
  template.push({
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      ...(isMac
        ? [{ type: "separator" as const }, { role: "front" as const }]
        : [{ role: "close" as const }]),
    ],
  });

  // Always add Help menu.
  template.push({
    label: "Help",
    submenu: [
      {
        label: "Documentation",
        click: () => shell.openExternal("https://pixielity.com/docs"),
      },
      {
        label: `About v${app.getVersion()}`,
        click: () => {
          dialog.showMessageBox({
            type: "info",
            title: "About",
            message: `Pixielity Desktop v${app.getVersion()}`,
            detail: "Built with Electron + Vite + React",
          });
        },
      },
    ],
  });

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  console.log(`[Main] Menu updated: ${menus.map((m) => m.label).join(", ")}`);
}

/*
|--------------------------------------------------------------------------
| IPC Handlers
|--------------------------------------------------------------------------
*/

function registerIpcHandlers(): void {
  // App info.
  ipcMain.handle("get-app-version", () => app.getVersion());

  /*
  |--------------------------------------------------------------------------
  | menu:set — receive menu template from renderer
  |--------------------------------------------------------------------------
  |
  | The renderer's DesktopManager sends the full menu template
  | after the DI container boots and MenuRegistry is populated.
  |
  */
  ipcMain.on("menu:set", (_event, menus: SerializedMenu[]) => {
    buildMenuFromTemplate(menus);
  });

  /*
  |--------------------------------------------------------------------------
  | menu:get — renderer requests the current menu state
  |--------------------------------------------------------------------------
  */
  ipcMain.handle("menu:get", () => {
    return Menu.getApplicationMenu();
  });

  // Printing.
  ipcMain.handle("print-receipt", async (_event, html: string) => {
    const win = new BrowserWindow({ show: false });
    win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
    win.webContents.on("did-finish-load", () => {
      win.webContents.print({}, () => win.close());
    });
  });

  // Cash drawer.
  ipcMain.handle("open-cash-drawer", async () => {
    console.log("[Main] Cash drawer open command");
  });

  // File export.
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

  // Notifications.
  ipcMain.handle("notify", async (_event, title: string, body: string) => {
    new Notification({ title, body }).show();
  });
}

/*
|--------------------------------------------------------------------------
| App Lifecycle
|--------------------------------------------------------------------------
*/

app.whenReady().then(() => {
  createDefaultMenu();
  registerIpcHandlers();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
