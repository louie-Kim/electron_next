const { ipcMain } = require("electron");
const { registerSystemInfoHandler } = require("./systemInfoHandler");
const { registerMessageHandlers } = require("./messageHandler");
const { registerNotificationHandler } = require("./notificationHandler");
const { registerFilesystemHandlers } = require("./filesystemHandler");

const registerIpcHandlers = (mainWindow) => {
  registerSystemInfoHandler({ ipcMain });
  registerMessageHandlers({ ipcMain, mainWindow });
  registerNotificationHandler({ ipcMain, mainWindow });
  registerFilesystemHandlers({ ipcMain, mainWindow });

  console.log("IPC handlers registered:", ipcMain.eventNames());
};

module.exports = {
  registerIpcHandlers
};
