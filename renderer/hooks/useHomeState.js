import { useCallback, useState } from "react";

const INITIAL_SYSTEM_STATE = {
  info: null,
  message: "Requesting info from Electron...",
};

const INITIAL_IPC_STATE = {
  payload: "Hello from the renderer!",
  status: "Type a message and send it to the main process.",
  response: null,
  isSending: false,
  history: [],
  historyStatus: "History will appear after a message is sent.",
  isRefreshing: false,
};

const INITIAL_REALTIME_STATE = {
  status: "Realtime updates will appear below.",
  snapshot: null,
};

const INITIAL_NOTIFICATION_STATE = {
  title: "Electron Desktop Alert",
  body: "This notification travelled through the main process.",
  status: "Ready to send a desktop notification.",
  channel: "",
  isSending: false,
};

const INITIAL_DIRECTORY_STATE = {
  tree: null, // result.root from handleBrowseDirectory()
  status: "Select a directory to explore.",
  isBrowsing: false,
  path: "",
  searchQuery: "",
  searchResults: [], // matches[]
  searchStatus: "Enter text to search in the selected directory.",
  isSearching: false,
  selectedEntry: null,
  previewStatus: "Select a file to preview.",
  previewDataUrl: "",
  previewText: "",
  isLoadingPreview: false,
};


const useHomeState = () => {
  // System state lives here.
  const [system, setSystem] = useState(INITIAL_SYSTEM_STATE);
  const updateSystem = useCallback((patch) => {
    setSystem((prev) => ({ ...prev, ...patch }));
  }, []);

  // IPC state lives here.
  const [ipc, setIpc] = useState(INITIAL_IPC_STATE);
  const updateIpc = useCallback((patch) => {
    // console.log("patch-----", patch);
    // 기존 ipc 상태를 복사한 -> patch로 덮어쓰기
    setIpc((prev) => ({ ...prev, ...patch }));
  }, []);

  // <input  onChange={(event) => setIpcPayload()} >
  // input 필드의 onChange 이벤트 핸들러로 전달됨
  const setIpcPayload = useCallback(
    (payload) => {
      console.log("payload?????", payload);

      updateIpc({ payload });
    },
    [updateIpc]
  );

  // Realtime state lives here.
  // realtime to index.js -> RealtimeStream( status, snapshot )
  const [realtime, setRealtime] = useState(INITIAL_REALTIME_STATE);
  // 6. realtime
  const updateRealtime = useCallback((patch) => {
    // console.log("updateRealtime patch-----", patch); // { status: , snapshot: }

    setRealtime((prev) => ({ ...prev, ...patch }));
  }, []);

  // Notification state lives here.
  const [notifications, setNotifications] = useState(
    INITIAL_NOTIFICATION_STATE
  );

  // [] -> 컴포넌트가 처음 렌더링될 때 단 한 번만 콜백을 만들어 두고
  //  이후에는 같은 함수 인스턴스를 계속 재사용
  const updateNotifications = useCallback((patch) => {
    console.log("notification patch-----", patch); // { title: , body: }
    setNotifications((prev) => ({ ...prev, ...patch }));
  }, []);

  // to useHomeHandlers -> index.js -> NotificationPanel( input: onTitleChange )
  const setNotificationTitle = useCallback(
    (title) => {
      updateNotifications({ title });
    },
    [updateNotifications]
  );
  // to useHomeHandlers -> index.js -> NotificationPanel( input: onBodyChange )
  const setNotificationBody = useCallback(
    (body) => {
      updateNotifications({ body });
    },
    [updateNotifications]
  );

  // Directory state lives here.
  const [directory, setDirectory] = useState(INITIAL_DIRECTORY_STATE);
  const updateDirectory = useCallback((patch) => {
    setDirectory((prev) => ({ ...prev, ...patch }));
  }, []);

  /**
   *  <input value={searchQuery ?? ""} >
   * 입력 필드가 “controlled component”로 동작하게 만들어 줍니다. 
   * 그래서 기본 역할은 input 값 관리가 전부
   * directory.searchQuery 새 문자로 업데이트
   */
  const setDirectorySearchQuery = useCallback(
    (query) => {
      updateDirectory({ searchQuery: query });
    },
    [updateDirectory]
  );

  return {
    system,
    updateSystem,
    ipc,
    updateIpc,
    setIpcPayload,
    realtime,
    updateRealtime,
    notifications,
    updateNotifications,
    setNotificationTitle,
    setNotificationBody,
    directory,  // tree: result.root : to index.js -> DirectoryBrowserPanel( tree )
    updateDirectory,
    setDirectorySearchQuery,
  };
};

export default useHomeState;
