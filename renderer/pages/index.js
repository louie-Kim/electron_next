import IntroPanel from "../components/IntroPanel";
import SystemInfoPanel from "../components/SystemInfoPanel";
import IpcMessageForm from "../components/IpcMessageForm";
import IpcResponseCard from "../components/IpcResponseCard";
import RealtimeStream from "../components/RealtimeStream";
import IpcHistoryPanel from "../components/IpcHistoryPanel";
import NotificationPanel from "../components/NotificationPanel";
import DirectoryBrowserPanel from "../components/DirectoryBrowserPanel";
import useHomeHandlers from "../hooks/useHomeHandlers";

export default function Home() {
  const {
    state: { system, ipc, realtime, notifications, directory },
    actions: {
      setIpcPayload,
      setNotificationTitle,
      setNotificationBody,
      setDirectorySearchQuery,
    },
    handlers: {
      refreshHistory,
      handleSendDemoMessage,
      handleSendNotification,
      handleBrowseDirectory,
      handleSearchDirectory,
      handleSelectSearchResult,
    },
  } = useHomeHandlers();

  return (
    <main className="min-h-screen grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 py-12 px-[clamp(1rem,4vw,3rem)]">
      <div className="grid gap-4">
        <IntroPanel />
        <div className="flex flex-col gap-6 rounded-[18px] bg-white p-8 shadow-[0_25px_50px_-12px_rgba(15,23,42,0.1)]">
          <h2 className="text-2xl font-semibold text-slate-900">IPC Demo</h2>
          <SystemInfoPanel
            systemMessage={system.message}
            systemInfo={system.info}
          />
        </div>
      </div>
      <section className="flex flex-col gap-6 rounded-[18px] bg-white p-8 shadow-[0_25px_50px_-12px_rgba(15,23,42,0.1)]">
        <IpcMessageForm
          ipcPayload={ipc.payload}
          setIpcPayload={setIpcPayload}
          isSendingDemoMessage={ipc.isSending}
          onSubmit={handleSendDemoMessage}
        />
        <p className="text-sm text-slate-600">{ipc.status}</p>
        <IpcResponseCard ipcResponse={ipc.response} />
        <IpcHistoryPanel
          historyStatus={ipc.historyStatus}
          ipcHistory={ipc.history}
          onRefresh={refreshHistory}
          isRefreshingHistory={ipc.isRefreshing}
        />
        <NotificationPanel
          title={notifications.title}
          body={notifications.body}
          onTitleChange={setNotificationTitle}
          onBodyChange={setNotificationBody}
          onSend={handleSendNotification}
          isSending={notifications.isSending}
          status={notifications.status}
          channel={notifications.channel}
        />
        <DirectoryBrowserPanel
          status={directory.status}
          tree={directory.tree}
          onBrowse={handleBrowseDirectory}
          isBrowsing={directory.isBrowsing}
          searchQuery={directory.searchQuery}
          onSearchChange={setDirectorySearchQuery}
          onSearch={handleSearchDirectory}
          searchResults={directory.searchResults}
          searchStatus={directory.searchStatus}
          isSearching={directory.isSearching}
          selectedEntry={directory.selectedEntry}
          onSelectResult={handleSelectSearchResult}
          previewStatus={directory.previewStatus}
          previewDataUrl={directory.previewDataUrl}
          previewText={directory.previewText}
          isLoadingPreview={directory.isLoadingPreview}
        />
        <RealtimeStream status={realtime.status} snapshot={realtime.snapshot} />
      </section>
    </main>
  );
}
