// default electron setup
import { app, BrowserWindow } from "electron";
import { startServer } from "next/dist/server/lib/start-server";
import * as path from "path";

let win: BrowserWindow;

app.on("ready", async () => {
  win = new BrowserWindow({ width: 800, height: 600 });
  const nextJSPort = 3000;

  const appPath = app.getAppPath();
  const parentDir = path.dirname(appPath);
  const grandParentDir = path.dirname(parentDir);
  const webDir = path.join(grandParentDir, "web");
  console.log("webDir", webDir);

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

  const url = `http://localhost:${nextJSPort}/`;

  win.loadURL(url);
  win.show();

  win.webContents.openDevTools();
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);
