const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("gateway", {
  getAppInfo: () => ipcRenderer.invoke("app:getInfo"),
  getAuditLogPath: () => ipcRenderer.invoke("audit:getLogPath"),
  recordBlockedAction: (action) => ipcRenderer.invoke("audit:blockedAction", action),
  getAuthStatus: () => ipcRenderer.invoke("auth:getStatus"),
  startMicrosoftLogin: () => ipcRenderer.invoke("auth:startMicrosoftLogin"),
  openPdfFile: () => ipcRenderer.invoke("pdf:openFile"),
});
