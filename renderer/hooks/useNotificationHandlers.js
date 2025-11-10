import { useCallback } from "react";
import withErrorHandling from "./withErrorHandling";

const useNotificationHandlers = ({
  notifications,
  updateNotifications,
  setNotificationTitle,
  setNotificationBody,
  electronAPI,
}) => {
  // useCallback(fun, deps[]) : deps 배열 값이 변경될 때만 함수를 다시 만들어 불필요한 생성 비용을 줄이는 최적화입니다.
  // 실제 돌아가는 함수
  const handleSendNotification = useCallback(
    withErrorHandling(
      async () => {
        // Electron 환경 연결 상태 확인
        if (!electronAPI?.sendNotification) {
          updateNotifications({
            status: "Notifications not available outside Electron.",
          });
          return;
        }

        updateNotifications({
          isSending: true,
          status: "Requesting desktop notification from the main process...",
          channel: "",
        });

        const response = await electronAPI.sendNotification({
          title: notifications.title,
          body: notifications.body,
        });

        if (response?.shown) {
          updateNotifications({
            status: "Notification displayed successfully.",
            channel: response.channel || "",
          });
        } else {
          updateNotifications({
            status: "Notification could not be displayed.",
            channel: response?.channel || "",
          });
        }
      },
      {
        label: "Notification request failed",
        onError: () =>
          updateNotifications({
            status: "Failed to trigger a desktop notification.",
          }),
        onFinally: () => updateNotifications({ isSending: false }),
      },
    ),
    [electronAPI, notifications.body, notifications.title, updateNotifications],
  );

  return {
    state: {
      notifications,
    },
    actions: {
      setNotificationTitle,
      setNotificationBody,
    },
    handlers: {
      handleSendNotification, // to 
    },
  };
};

export default useNotificationHandlers;
