const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
  getHonoPort: () => {
    console.log("😊 getPort preload ");
    return ipcRenderer.sendSync("getHonoPort");
  },
});
