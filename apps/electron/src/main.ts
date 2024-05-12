import { serve } from "@hono/node-server";
import { app, BrowserWindow } from "electron";
import { getPort } from "get-port-please";
import { Hono } from "hono";
import { startServer } from "next/dist/server/lib/start-server";
import * as path from "path";

let win: BrowserWindow;

app.on("ready", async () => {
  win = new BrowserWindow({ width: 800, height: 600, webPreferences: { nodeIntegration: true } });
  const nextJSPort = 3000;
  let url = `http://localhost:${nextJSPort}/`;
  const honoPort = await getPort({ portRange: [50_011, 60_000] });
  console.log(`Hono server is running on http://localhost:${honoPort}`);

  const hono = new Hono();
  hono.get("/", (c) => c.text("Hello Node.js!"));

  if (process.env.NODE_ENV !== "development") {
    const nextJSPort = await getPort({ portRange: [30_011, 50_000] });

    const appPath = app.getAppPath();
    const parentDir = path.dirname(appPath);
    const grandParentDir = path.dirname(parentDir);
    const webDir = path.join(grandParentDir, "web");
    process.env.HONO_PORT = honoPort.toString();
    startServer({
      dir: webDir,
      isDev: false,
      hostname: "localhost",
      port: nextJSPort,
      customServer: true,
      allowRetry: false,
    }).catch((err) => {
      console.error(err);
      process.exit(1);
    });
    url = `http://localhost:${nextJSPort}/`;
  }

  serve({
    fetch: hono.fetch,
    port: honoPort,
    hostname: "localhost",
  });

  win.loadURL(url);
  win.show();

  win.webContents.openDevTools();
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);
