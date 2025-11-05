const { app, BrowserWindow } = require("electron");
const path = require("path");
const { registerIpcHandlers } = require("./handlers");
const { demoHistory } = require("./handlers/demoHistoryStore");
const { log } = require("console");

// main.js (Electron 진입점)
const isDev = process.env.NODE_ENV !== "production";
console.log("isDev", isDev);

const getRendererUrl = () =>
  process.env.ELECTRON_START_URL || "http://localhost:3000";

let mainWindow;
let broadcastIntervalId = null;

const stopRealtimeBroadcast = () => {
  if (broadcastIntervalId !== null) {
    clearInterval(broadcastIntervalId);
    broadcastIntervalId = null;
  }
};

// 2. realtime
const startRealtimeBroadcast = () => {
  // 기존에 동작 중인 interval이 있으면 중지한다.
  stopRealtimeBroadcast();

  broadcastIntervalId = setInterval(() => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      stopRealtimeBroadcast();
      return;
    }
    // 3. realtime: ipc-demo:realtime-update 채널로 메시지를 전송한다.
    // appendHistoryEntry(demoHistory, ...)가 호출 -> 배열 객체가 갱신 -> demoHistory 배열 참조
    mainWindow.webContents.send("ipc-demo:realtime-update", {
      historySize: demoHistory.length,
      lastPayload: demoHistory[0]?.payload ?? "",
      timestamp: new Date().toLocaleTimeString(),
    });
  }, 1500);
};

function createWindow() {
  // Electron 브라우저 창을 생성한다.
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 800,
    minHeight: 500,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // 미리 로드할 preload.js 등록
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  // IPC 핸들러들을 등록한다.
  // to  main/handlers/index.js
  registerIpcHandlers(mainWindow); 

  const rendererUrl = getRendererUrl();
  // Next.js 페이지를 불러온다.
  mainWindow.loadURL(rendererUrl); // http://localhost:3000

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
    stopRealtimeBroadcast();
  });
  // 1. realtime
  mainWindow.webContents.on("did-finish-load", () => {
    startRealtimeBroadcast();
  });
}

// 앱이 준비되면 창을 생성한다.
app.whenReady().then(() => {
  createWindow();

  // macOS: 모든 창을 닫은 뒤 Dock 아이콘을 클릭하면 다시 창을 연다.
  app.on("activate", () => {
    // Re-open the window if none are left (common macOS behaviour).
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  // macOS가 아니면 모든 창을 닫을 때 앱을 종료한다.
  if (process.platform !== "darwin") {
    app.quit();
  }
});



