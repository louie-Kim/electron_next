export default function IpcHistoryPanel({
  historyStatus,
  ipcHistory,
  onRefresh,
  isRefreshingHistory
}) {
  return (
    <div className="grid gap-3 border-t border-slate-200 pt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">IPC Request History</h3>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-400"
          onClick={onRefresh}
          disabled={isRefreshingHistory}
        >
          {isRefreshingHistory ? 'Refreshing...' : 'Refresh history'}
        </button>
      </div>
      <p className="text-sm text-slate-600">{historyStatus}</p>
      {ipcHistory.length > 0 && (
        <ol className="list-decimal space-y-3 pl-5">
          {ipcHistory.map((entry, index) => (
            <li
              key={`${entry.handledAt || 'unknown'}-${index}`}
              className="grid gap-1 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800"
            >
              <span>
                <strong>Message:</strong> {entry.payload || '(empty)'}
              </span>
              <span>
                <strong>Echo:</strong> {entry.echo}
              </span>
              <span>
                <strong>Handled:</strong> {entry.handledAt}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
