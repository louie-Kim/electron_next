const { Notification, dialog } = require("electron");

const registerNotificationHandler = ({ ipcMain, mainWindow }) => {
  ipcMain.removeHandler("ipc-demo:notify");
  // 3. notification
  /**
   * options = {
        title: notificationTitle,
        body: notificationBody
        }
   */
  ipcMain.handle("ipc-demo:notify", (_event, options = {}) => {
    const title =
      typeof options.title === "string" && options.title.trim().length > 0
        ? options.title.trim()
        : "Electron Notification";
    const body =
      typeof options.body === "string" && options.body.trim().length > 0
        ? options.body.trim()
        : "Hello from the main process!";

    if (Notification?.isSupported?.()) {
      const notification = new Notification({
        title,
        body,
      });
      notification.show();
      // 알림이 정상적으로 표시되면 channel: "notification" toast 알림 사용
      return { shown: true, channel: "notification", title, body };
    }

    // Notification API가 지원되지 않을 때 -> 대화상자를 표시
    if (mainWindow && !mainWindow.isDestroyed()) {
      dialog.showMessageBox(mainWindow, {
        type: "info",
        title,
        message: body,
      });
      return { shown: true, channel: "dialog", title, body };
    }

    // 알림이 표시되지 않으면 -> channel: "none"
    return { shown: false, channel: "none", title, body };
  });
};

module.exports = {
  registerNotificationHandler
};

