import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import { serve } from "@hono/node-server";
import { BrowserWindow, app, ipcMain, shell } from "electron";
import { getPort } from "get-port-please";
import { Hono } from "hono";
import { startServer } from "next/dist/server/lib/start-server";
import * as path from "path";
import { join } from "path";

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      sandbox: false,
      nodeIntegration: true,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev) {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    const port = startNextJSServer();
    mainWindow.loadURL(`http://localhost:${port}`);
  }
}

async function startNextJSServer() {
  const nextJSPort = await getPort({ portRange: [30_011, 50_000] });
  const appPath = app.getAppPath();
  const parentDir = path.dirname(appPath);
  const grandParentDir = path.dirname(parentDir);
  const webDir = path.join(grandParentDir, "web");

  await startServer({
    dir: webDir,
    isDev: false,
    hostname: "localhost",
    port: nextJSPort,
    customServer: true,
    allowRetry: false,
  });

  return nextJSPort;
}

async function startHonoServer() {
  const honoPort = await getPort({ portRange: [50_000, 51_000] });
  console.log("Hono server port:", honoPort);

  const hono = new Hono();

  hono.get("/health", (c) => c.text("Hono!"));

  serve({
    fetch: hono.fetch,
    port: honoPort,
    hostname: "localhost",
  });

  return honoPort;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on("ping", () => console.log("pong"));

  // Start the Hono server
  const honoPort = startHonoServer();
  ipcMain.handle("getHonoPort", () => honoPort);

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
