export default function NotificationPanel({
  title,
  body,
  onTitleChange,
  onBodyChange,
  onSend,   //  onSend={handleSendNotification}
  isSending,
  status,
  channel
}) {
  return (
    <div className="grid gap-3  border-t border-slate-200 pt-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Desktop Notification</h3>
      </div>
      <p className="text-sm text-slate-600">{status}</p>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto]">
        <input
          type="text"
          value={title}
          placeholder="Notification title"
          onChange={(event) => onTitleChange(event.target.value)}
          className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
        />
        <input
          type="text"
          value={body}
          placeholder="Notification body"
          onChange={(event) => onBodyChange(event.target.value)}
          className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
        />
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-400"
          onClick={onSend}
          disabled={isSending}
        >
          {isSending ? 'Sending...' : 'Show Notification'}
        </button>
      </div>
      {channel && (
        <p className="text-sm text-slate-600">
          Delivered via: <strong>{channel}</strong>
        </p>
      )}
    </div>
  );
}
