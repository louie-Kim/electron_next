import { useEffect } from "react";

const useRealtimeHandlers = ({
  realtime,
  updateRealtime,
  electronAPI,
  isElectronAvailable,
}) => {
  useEffect(() => {
    if (!isElectronAvailable || !electronAPI?.subscribeToRealtimeUpdates) {
      updateRealtime({
        status: "Realtime updates not available outside Electron.",
        snapshot: null,
      });
      return undefined;
    }

    updateRealtime({
      status: "Listening for realtime updates...",
    });

    // realtime 스트림 구독
    const unsubscribe = electronAPI.subscribeToRealtimeUpdates((payload) => {
      updateRealtime({
        status: "Receiving realtime updates from the main process.",
        snapshot: payload,
      });
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [electronAPI, isElectronAvailable, updateRealtime]);

  return {
    state: {
      realtime,
    },
  };
};

export default useRealtimeHandlers;
