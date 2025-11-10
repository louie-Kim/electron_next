import { useMemo, useCallback } from "react";

const resolveElectronAPI = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return window.electronAPI ?? null;
};

const useElectronAPI = () => {
  const electronAPI = useMemo(() => resolveElectronAPI(), []);
  const isElectronAvailable = Boolean(electronAPI);

  /**
   * ensureMethod("sendNotification")처럼 사용
   * window.electronAPI.sendNotification이 실제 함수인지 검사해서 있으면 반환하고
   * 없으면 null
   */
  const ensureMethod = useCallback(
    (methodName) => {
      if (!electronAPI || typeof electronAPI[methodName] !== "function") {
        return null;
      }
      return electronAPI[methodName];
    },
    [electronAPI],
  );

  return {
    electronAPI,
    isElectronAvailable,
    ensureMethod,
  };
};

export default useElectronAPI;
