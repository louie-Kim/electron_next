const { contextBridge, ipcRenderer } = require('electron');

// preload.js (렌더러-메인 연결 브리지)
// 2️⃣ 전역 window 객체에 electronAPI라는 키 생성 -> getSystemInfo 함수 등록
// 2️⃣ 전역 window 객체에 electronAPI라는 키 생성 -> sendDemoMessage 함수 등록
// 2️⃣ 전역 window 객체에 electronAPI라는 키 생성 -> getDemoHistory 함수 등록
// 2️⃣ 전역 window 객체에 electronAPI라는 키 생성 -> sendNotification 함수 등록
// 2️⃣ 전역 window 객체에 electronAPI라는 키 생성 -> browseDirectory 함수 등록
// await window.electronAPI.getSystemInfo();
// await window.electronAPI.sendDemoMessage(ipcPayload) : ipcPayload = message
// await window.electronAPI.getDemoHistory()
// await window.electronAPI.sendNotification(options)
// await window.electronAPI.browseDirectory()
contextBridge.exposeInMainWorld('electronAPI', {
  getSystemInfo: () => ipcRenderer.invoke('system-info'),
  sendDemoMessage: (message) => ipcRenderer.invoke('ipc-demo:message', message),
  getDemoHistory: () => ipcRenderer.invoke('ipc-demo:get-history'),
  // 2. notification
  sendNotification: (options) => ipcRenderer.invoke('ipc-demo:notify', options),
  // 4. directory browser
  browseDirectory: () => ipcRenderer.invoke('filesystem:choose-directory'),
  searchDirectory: (options) => ipcRenderer.invoke('filesystem:search-directory', options),
  getFilePreview: (options) => ipcRenderer.invoke('filesystem:get-preview', options),
  subscribeToRealtimeUpdates: (callback) => {
    if (typeof callback !== 'function') {
      return () => {};
    }

    const channel = 'ipc-demo:realtime-update';
    const handler = (_event, payload) => {
      /**
       * payload
       * {
            "historySize": 2,
            "lastPayload": "456",
            "timestamp": "오후 4:35:15"
        }
       */
      
      // payload를 그대로 callback(payload)에 전달해서 렌더러에서 활용 가능하도록 함
      callback(payload);
    };

    // 4. realtime
    ipcRenderer.on(channel, handler);

    return () => {
      ipcRenderer.removeListener(channel, handler);
    };
  }
});
