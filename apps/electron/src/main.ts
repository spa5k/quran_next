import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import { serve } from "@hono/node-server";
import { BrowserWindow, app, ipcMain, shell } from "electron";
import { download } from "electron-dl";
import Store from "electron-store";
import { getPort } from "get-port-please";
import { Hono } from "hono";
import { startServer } from "next/dist/server/lib/start-server.js";
import * as path from "path";
import { join } from "path";

const store = new Store();
const __dirname = path.dirname(new URL(import.meta.url).pathname);

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
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  if (is.dev) {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    const port = startNextJSServer();
    mainWindow.loadURL(`http://localhost:${port}`);
  }

  return mainWindow;
}

async function startNextJSServer() {
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
}

async function startHonoServer() {
  const honoPort = await getPort({ portRange: [50000, 51000] });
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

app.whenReady().then(async () => {
  electronApp.setAppUserModelId("com.electron");

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  ipcMain.on("ping", () => console.log("pong"));

  const honoPort = startHonoServer();
  ipcMain.handle("getHonoPort", () => honoPort);

  const latestReleaseVersion = await getLatestReleaseVersion(
    "spa5k",
    "quran_data",
  );

  const lastReleaseVersion = store.get("lastReleaseVersion");

  if (latestReleaseVersion === lastReleaseVersion) {
    console.log(
      "No new release found in the repository. Last release is up to date.",
      lastReleaseVersion,
    );
  } else {
    const latestReleaseUrl = await getLatestRelease("spa5k", "quran_data");
    console.log("New release found. Downloading...");
    const win = createWindow();
    await download(win, latestReleaseUrl, {
      directory: app.getPath("userData"),
    }).then((dl) => {
      console.log("Downloaded to:", dl.getSavePath());
    });
    store.set("lastReleaseVersion", latestReleaseVersion);
    console.log("Download complete.", latestReleaseVersion);
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

async function getLatestReleaseVersion(
  user: string,
  repo: string,
): Promise<string> {
  const response = await fetch(
    `https://api.github.com/repos/${user}/${repo}/releases/latest`,
  );
  const data = await response.json();
  return data.tag_name;
}

async function getLatestRelease(user: string, repo: string): Promise<string> {
  const response = await fetch(
    `https://api.github.com/repos/${user}/${repo}/releases/latest`,
  );
  const data = await response.json();
  const asset = data.assets.find((asset: any) => asset.name === "quran.db");
  return asset.browser_download_url;
}
