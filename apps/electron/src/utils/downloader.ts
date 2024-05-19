import { app, BrowserWindow } from "electron";
import log from "electron-log";
import fs from "fs";
import https from "https";
import path from "path";
import { URL } from "url";

async function downloadFile(
  mainWindow: BrowserWindow,
  url: string,
  options: { directory?: string; filename?: string } = {},
): Promise<void> {
  const directory = options.directory || app.getPath("userData");
  const urlObject = new URL(url);
  const filename = options.filename || path.basename(urlObject.pathname);
  const filePath = path.join(directory, filename);

  log.info(`Downloading file: ${url}`);
  log.info(`Downloading to: ${filePath}`);

  // Check if the file exists and delete it if it does
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      log.info(`Deleted existing file: ${filePath}`);
    } catch (err) {
      log.error(`Failed to delete existing file: ${filePath}`, err);
      throw err;
    }
  }

  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filePath);
        response.pipe(fileStream);

        fileStream.on("finish", () => {
          fileStream.close();
          log.info(`Downloaded to: ${filePath}`);
          resolve();
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirects
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          log.info(`Redirecting to: ${redirectUrl}`);
          downloadFile(mainWindow, redirectUrl, options)
            .then(resolve)
            .catch(reject);
        } else {
          reject(new Error(`Redirect without location header`));
        }
      } else {
        reject(
          new Error(
            `Failed to download file: ${response.statusCode} ${response.statusMessage}`,
          ),
        );
      }
    });

    request.on("error", (err) => {
      log.error("Download error:", err);
      reject(err);
    });

    request.end();
  });
}

export default downloadFile;
