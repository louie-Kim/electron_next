const registerSystemInfoHandler = ({ ipcMain }) => {
  // 메인 프로세스 코드가 다시 실행돼도 중복 등록으로 인한 오류를 방지한다.
  ipcMain.removeHandler("system-info");
  ipcMain.handle("system-info", () => ({
    chrome: process.versions.chrome,
    electron: process.versions.electron,
    node: process.versions.node,
    platform: process.platform,
    time: new Date().toLocaleTimeString(),
  }));
};

module.exports = {
  registerSystemInfoHandler
};
