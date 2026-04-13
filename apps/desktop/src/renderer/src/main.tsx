/**
 * Desktop Renderer Entry
 *
 * Same as the Vite app entry but with DesktopModule added.
 * This file bootstraps the React app inside the Electron BrowserWindow.
 */

import "reflect-metadata";
import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div style={{ padding: 40, fontFamily: "system-ui" }}>
      <h1>Pixielity Desktop</h1>
      <p>
        Electron is running. Replace this with your full Vite app by importing from{" "}
        <code>apps/vite/src</code>.
      </p>
      <p>
        Platform: <strong>{window.electronAPI ? "Electron" : "Browser"}</strong>
      </p>
    </div>
  </React.StrictMode>,
);
