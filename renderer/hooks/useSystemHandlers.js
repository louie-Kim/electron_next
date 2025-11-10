import { useCallback, useEffect } from "react";
import withErrorHandling from "./withErrorHandling";
import {
  createDirectoryReadyState,
  createDirectoryUnavailableState,
} from "./directoryStateHelpers";

const useSystemHandlers = ({
  system,
  updateSystem,
  updateRealtime,
  updateNotifications,
  updateDirectory,
  electronAPI,
  isElectronAvailable,
}) => {
  const handleMarkUnavailable = useCallback(() => {
    updateSystem({
      info: null,
      message: "Not running inside Electron (try npm run dev or npm start).",
    });
    updateRealtime({
      status: "Realtime updates not available outside Electron.",
      snapshot: null,
    });
    updateNotifications({
      status: "Notifications not available outside Electron.",
      channel: "",
    });
    updateDirectory(createDirectoryUnavailableState());
  }, [updateDirectory, updateNotifications, updateRealtime, updateSystem]);

  const handleInitializeSystem = useCallback(
    withErrorHandling(
      async () => {
        if (!electronAPI?.getSystemInfo) {
          updateSystem({
            message: "Failed to reach the main process.",
          });
          return;
        }

        const info = await electronAPI.getSystemInfo();
        updateSystem({
          info,
          message: "Electron bridge online.",
        });
        updateNotifications({
          status: "Ready to send a desktop notification.",
        });
        updateDirectory(createDirectoryReadyState());
      },
      {
        label: "System info request failed",
        onError: () =>
          updateSystem({
            message: "Failed to reach the main process.",
          }),
      },
    ),
    [electronAPI, updateDirectory, updateNotifications, updateSystem],
  );

  useEffect(() => {
    if (!isElectronAvailable) {
      handleMarkUnavailable();
      return;
    }
    handleInitializeSystem();
  }, [handleInitializeSystem, handleMarkUnavailable, isElectronAvailable]);

  return {
    state: {
      system,
    },
  };
};

export default useSystemHandlers;
