import { useCallback, useEffect } from "react";
import withErrorHandling from "./withErrorHandling";

// from useHomeHandlers.js
// ...homeState : ipc, updateIpc, setIpcPayload
// ...electronBridge : electronAPI
const useIpcHandlers = ({ ipc, updateIpc, setIpcPayload, electronAPI }) => {
  const handleRefreshHistory = useCallback(
    withErrorHandling(
      async () => {
        if (!electronAPI?.getDemoHistory) {
          updateIpc({
            history: [],
            historyStatus: "IPC bridge not available outside Electron.",
            isRefreshing: false,
          });
          return;
        }

        updateIpc({
          isRefreshing: true,
          historyStatus: "Requesting message history from the main process...",
        });

        const history = await electronAPI.getDemoHistory();
        if (Array.isArray(history) && history.length > 0) {
          updateIpc({
            history,
            historyStatus: "Latest IPC calls captured inside the main process.",
          });
        } else {
          updateIpc({
            history: [],
            historyStatus:
              "No IPC history yet. Send a message to populate this list.",
          });
        }
      },
      {
        label: "IPC history request failed",
        onError: () =>
          updateIpc({
            historyStatus: "Failed to load IPC history.",
          }),
        onFinally: () => updateIpc({ isRefreshing: false }),
      },
    ),
    [electronAPI, updateIpc],
  );

  // useCallback(fun, deps[]) : deps 배열 값이 변경될 때만 함수를 다시 만들어 불필요한 생성 비용을 줄이는 최적화입니다.
  const handleSendDemoMessage = useCallback(
    withErrorHandling(
      async (event) => {
        event.preventDefault();

        if (!electronAPI?.sendDemoMessage) {
          updateIpc({
            status: "IPC bridge not available outside Electron.",
          });
          return;
        }

        updateIpc({
          isSending: true,
          status: "Sending message to the main process...",
        });

        // request to main process
        const response = await electronAPI.sendDemoMessage(ipc.payload);
        updateIpc({
          response,
          status: "Reply received from the main process.",
        });
        await handleRefreshHistory();
      },
      {
        label: "IPC demo failed",
        onError: () =>
          updateIpc({
            status: "Failed to reach the main process.",
          }),
        onFinally: () => updateIpc({ isSending: false }),
      },
    ),
    [electronAPI, handleRefreshHistory, ipc.payload, updateIpc],
  );

  useEffect(() => {
    handleRefreshHistory();
  }, [handleRefreshHistory]);

  return {
    state: {
      ipc,
    },
    actions: {
      setIpcPayload,
    },
    handlers: {
      refreshHistory: handleRefreshHistory,
      handleSendDemoMessage, // 1. to useHomeHandlers.js , const ipcSegment = useIpcHandlers({
    },
  };
};

export default useIpcHandlers;
