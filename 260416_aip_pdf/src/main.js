const { app, BrowserWindow, dialog, ipcMain, shell } = require("electron");
const fs = require("node:fs/promises");
const path = require("node:path");
const { getAppInfo } = require("./shared/appInfo");
const { buildAuthorizeUrl, getMicrosoftAuthConfig } = require("./shared/microsoftAuth");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 760,
    minWidth: 960,
    minHeight: 640,
    title: "AIP PDF Gateway PoC",
    backgroundColor: "#ffffff",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));
}

app.whenReady().then(() => {
  ipcMain.handle("app:getInfo", () => getAppInfo({ appVersion: app.getVersion() }));
  ipcMain.handle("auth:getStatus", () => {
    const config = getMicrosoftAuthConfig();
    return {
      state: config.configured ? "ready" : "config_required",
      tenantId: config.tenantId,
      redirectUri: config.redirectUri,
      message: config.configured ? "Microsoft 로그인 준비됨" : "앱 승인 정보가 필요합니다.",
    };
  });
  ipcMain.handle("auth:startMicrosoftLogin", async () => {
    const config = getMicrosoftAuthConfig();
    if (!config.configured) {
      return {
        state: "config_required",
        tenantId: config.tenantId,
        redirectUri: config.redirectUri,
        message: "AIP_PDF_CLIENT_ID 설정 후 Microsoft 로그인을 시작할 수 있습니다.",
      };
    }

    const authorizeUrl = buildAuthorizeUrl(config);
    await shell.openExternal(authorizeUrl);
    return {
      state: "browser_opened",
      tenantId: config.tenantId,
      redirectUri: config.redirectUri,
      message: "Microsoft 로그인 창을 열었습니다.",
    };
  });
  ipcMain.handle("pdf:openFile", async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: "PDF 열기",
      properties: ["openFile"],
      filters: [{ name: "PDF", extensions: ["pdf"] }],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { canceled: true };
    }

    const filePath = result.filePaths[0];
    const buffer = await fs.readFile(filePath);

    return {
      canceled: false,
      fileName: path.basename(filePath),
      fileSize: buffer.byteLength,
      bytes: buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
    };
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
