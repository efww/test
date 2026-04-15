const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("gateway", {
  getAppInfo: () => ipcRenderer.invoke("app:getInfo"),
  getAuthStatus: () => ipcRenderer.invoke("auth:getStatus"),
  startMicrosoftLogin: () => ipcRenderer.invoke("auth:startMicrosoftLogin"),
  openPdfFile: () => ipcRenderer.invoke("pdf:openFile"),
});
