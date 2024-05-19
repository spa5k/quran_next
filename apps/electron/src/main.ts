import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import { serve } from "@hono/node-server";
import { BrowserWindow, app, ipcMain, shell } from "electron";
import { download } from "electron-dl";
import log from "electron-log";
import Store from "electron-store";
import { getPort } from "get-port-please";
import { Hono } from "hono";
import { startServer } from "next/dist/server/lib/start-server.js";
import * as path from "path";
import { join } from "path";
import { getLatestRelease, getLatestReleaseVersion } from "./utils/releases.js";

const store = new Store();
const __dirname = path.dirname(new URL(import.meta.url).pathname);

let mainWindow: BrowserWindow | null = null;
let loadingWindow: BrowserWindow | null = null;

function createLoadingWindow(): BrowserWindow {
  const loadingWindow = new BrowserWindow({
    width: 300,
    height: 200,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
    },
    backgroundMaterial: "auto",
  });

  const url = `${join(__dirname, "..", "..", "public", "loading.html")}`;

  loadingWindow.loadFile(url);

  return loadingWindow;
}

function createWindow(): BrowserWindow {
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
    if (loadingWindow) {
      loadingWindow.close();
      loadingWindow = null;
    }
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (is.dev) {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    startNextJSServer()
      .then((port) => {
        mainWindow.loadURL(`http://localhost:${port}`);
      })
      .catch((error) => {
        log.error("Failed to start Next.js server:", error);
      });
  }

  return mainWindow;
}

async function startNextJSServer() {
  try {
    const nextJSPort = await getPort({ portRange: [30011, 50000] });
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
  } catch (error) {
    log.error("Error starting Next.js server:", error);
    throw error;
  }
}

async function startHonoServer() {
  try {
    const honoPort = await getPort({ portRange: [50000, 51000] });
    log.info("Hono server port:", honoPort);

    const hono = new Hono();

    hono.get("/health", (c) => c.text("Hono!"));

    serve({
      fetch: hono.fetch,
      port: honoPort,
      hostname: "localhost",
    });

    return honoPort;
  } catch (error) {
    log.error("Error starting Hono server:", error);
    throw error;
  }
}

app.whenReady().then(async () => {
  try {
    electronApp.setAppUserModelId("com.electron");

    app.on("browser-window-created", (_, window) => {
      optimizer.watchWindowShortcuts(window);
    });

    ipcMain.on("ping", () => log.info("pong"));

    const honoPort = await startHonoServer();
    ipcMain.handle("getHonoPort", () => honoPort);

    const latestReleaseVersion = await getLatestReleaseVersion(
      "spa5k",
      "quran_data",
    );

    const lastReleaseVersion = store.get("lastReleaseVersion");

    loadingWindow = createLoadingWindow();
    mainWindow = createWindow();

    if (latestReleaseVersion === lastReleaseVersion) {
      log.info(
        "No new release found in the repository. Last release is up to date.",
        lastReleaseVersion,
      );
    } else {
      const latestReleaseUrl = await getLatestRelease("spa5k", "quran_data");
      log.info("New release found. Downloading...");

      await download(mainWindow, latestReleaseUrl, {
        directory: app.getPath("userData"),
      }).then((dl) => {
        log.info("Downloaded to:", dl.getSavePath());
      });
      store.set("lastReleaseVersion", latestReleaseVersion);
      log.info("Download complete.", latestReleaseVersion);
    }

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  } catch (error) {
    log.error("Error during app initialization:", error);
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
