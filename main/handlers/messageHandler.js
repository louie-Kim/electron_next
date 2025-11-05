const { appendHistoryEntry, getHistorySnapshot } = require("../ipcHistory");
const { demoHistory } = require("./demoHistoryStore");

const registerMessageHandlers = ({ ipcMain, mainWindow }) => {
  ipcMain.removeHandler("ipc-demo:message");
  // messageFromRenderer = message = ipcPayload
  // messageFromRenderer가 undefined이면 ' 빈 문자열을 할당
  ipcMain.handle("ipc-demo:message", (_event, messageFromRenderer = "") => {
    const text =
      typeof messageFromRenderer === "string" ? messageFromRenderer.trim() : "";
    const echo = text || "Hello from the renderer!";

    const response = {
      echo,
      tip: "IPC tip: use ipcRenderer.invoke/ipcMain.handle for request/response patterns.",
      handledAt: new Date().toLocaleTimeString(),
    };

    // ipc-demo:message 채널로 받은 메시지를 demoHistory 배열에 저장 (정규화, 최대 개수 제한)
    appendHistoryEntry(demoHistory, {
      payload: text,
      echo: response.echo,
      handledAt: response.handledAt,
    });
    console.log("response-------", response);

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("ipc-demo:realtime-update", {
        historySize: demoHistory.length,
        lastPayload: demoHistory[0]?.payload ?? "",
        timestamp: new Date().toLocaleTimeString(),
      });
    }

    return response; // to await electronAPI.sendDemoMessage(ipc.payload);
  });

  ipcMain.removeHandler("ipc-demo:get-history");
  ipcMain.handle("ipc-demo:get-history", () => getHistorySnapshot(demoHistory));
};

module.exports = {
  registerMessageHandlers
};
