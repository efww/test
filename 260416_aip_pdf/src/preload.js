const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("gateway", {
  getAppInfo: () => ipcRenderer.invoke("app:getInfo"),
  openPdfFile: () => ipcRenderer.invoke("pdf:openFile"),
});
