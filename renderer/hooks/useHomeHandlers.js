import useHomeState from "./useHomeState";
import useElectronAPI from "./useElectronAPI";
import useIpcHandlers from "./useIpcHandlers";
import useNotificationHandlers from "./useNotificationHandlers";
import useDirectoryHandlers from "./useDirectoryHandlers";
import useRealtimeHandlers from "./useRealtimeHandlers";
import useSystemHandlers from "./useSystemHandlers";

// 세그먼트의 state, actions, handlers를 Object.assign으로 한데 모아 최종 결과를 반환
// systemSegment, ipcSegment, notificationSegment, …  => ...segments
// 3.
const mergeSegments = (...segments) => {
  // console.log("[useHomeHandlers] mergeSegments", segments);
  return {
    state: Object.assign({}, ...segments.map((segment) => segment.state ?? {})),
    actions: Object.assign(
      {},
      ...segments.map((segment) => segment.actions ?? {}),
    ),
    handlers: Object.assign(
      {},
      ...segments.map((segment) => segment.handlers ?? {}),
    ),
  }; // { state, actions, handlers } => = useHomeHandlers(); / page.index.js 에서 사용

};

const useHomeHandlers = () => {
  const homeState = useHomeState();
  const electronBridge = useElectronAPI();

  const systemSegment = useSystemHandlers({
    ...homeState,
    ...electronBridge,
  });
  // 2.  ipcSegment : to mergeSegments -> return { state, actions, handlers }
  const ipcSegment = useIpcHandlers({
    ...homeState,
    ...electronBridge,
  });
  // console.log("ipcSegment-----", ipcSegment);
  
  const notificationSegment = useNotificationHandlers({
    ...homeState,
    ...electronBridge,
  });
  /**
   * {
        "state": notifications,
        "actions": setNotificationBody, setNotificationTitle
        "handlers": handleSendNotification
    }
   */
  // console.log("notificationSegment-----", notificationSegment); 
  

  // 
  const directorySegment = useDirectoryHandlers({
    ...homeState,
    ...electronBridge,
  });
  /**
   * {
      "state": directory,
      "actions": setDirectorySearchQuery,
      "handlers": handleBrowseDirectory, handleSearchDirectory,handleSelectSearchResult,
      }
   */
  // console.log("directorySegment-----", directorySegment);
  

  // 
  const realtimeSegment = useRealtimeHandlers({
    ...homeState,
    ...electronBridge,
  });

  return mergeSegments(
    // 
    systemSegment,
    ipcSegment,
    notificationSegment,
    directorySegment,
    realtimeSegment,
  );
};

export default useHomeHandlers;
