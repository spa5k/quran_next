import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import { BrowserWindow, app, ipcMain, shell } from "electron";
import log from "electron-log";
import settings from "electron-settings";
import { getPort } from "get-port-please";
import { startServer } from "next/dist/server/lib/start-server.js";
import * as path from "path";
import { join } from "path";
import { startHonoServer } from "./server/index.js";
import downloadFile from "./utils/downloader.js";
import { getLatestRelease, getLatestReleaseVersion } from "./utils/releases.js";

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
      nodeIntegration: true,
      contextIsolation: false,
    },
    backgroundMaterial: "acrylic",
  });

  const url = join(__dirname, "..", "public", "loading.html");

  loadingWindow.loadFile(url);

  if (process.platform === "win32") {
    loadingWindow.setBackgroundMaterial("mica");
  } else if (process.platform === "darwin") {
    loadingWindow.setBackgroundColor("#00000000"); // Transparent background for macOS
    loadingWindow.setBackgroundMaterial("auto");
  } else {
    loadingWindow.setBackgroundColor("#00000000"); // Transparent background for other platforms
  }

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

app.whenReady().then(async () => {
  try {
    electronApp.setAppUserModelId("com.electron");

    app.on("browser-window-created", (_, window) => {
      optimizer.watchWindowShortcuts(window);
    });

    ipcMain.on("ping", () => log.info("pong"));

    const honoPort = await startHonoServer();
    console.log("Hono server started on port:", honoPort);
    ipcMain.handle("getHonoPort", () => honoPort);

    const latestReleaseVersion = await getLatestReleaseVersion(
      "spa5k",
      "quran_data",
    );

    const lastReleaseVersion = await settings.get("lastReleaseVersion");

    loadingWindow = createLoadingWindow();

    if (latestReleaseVersion === lastReleaseVersion) {
      log.info(
        "No new release found in the repository. Last release is up to date.",
        lastReleaseVersion,
      );
    } else {
      const latestReleaseUrl = await getLatestRelease("spa5k", "quran_data");
      log.info("New release found. Downloading...");

      downloadFile(mainWindow!, latestReleaseUrl, { filename: "quran.db" })
        .then(() => {
          console.log("Download completed successfully");
          settings.set("lastReleaseVersion", latestReleaseVersion);
        })
        .catch((error) => {
          console.error("Download failed:", error);
        });
      log.info("Download complete.", latestReleaseVersion);
    }
    // wait for 3 to show main window
    setTimeout(() => {
      mainWindow = createWindow();
    }, 3000);
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
