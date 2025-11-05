export default function IpcMessageForm({
  ipcPayload,
  setIpcPayload, // setIpcPayload={setIpcPayload}
  isSendingDemoMessage,
  onSubmit      // onSubmit={handleSendDemoMessage}
}) {
  return (
    <form className="grid gap-3" onSubmit={onSubmit}>
      <label className="text-sm font-medium text-slate-700" htmlFor="ipc-message">
        Send a custom message to the main process:
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="ipc-message"
          type="text"
          value={ipcPayload}
          onChange={(event) => setIpcPayload(event.target.value)}
          placeholder="Hello, main process!"
          className="flex-1 rounded-lg border border-blue-200 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={isSendingDemoMessage || !ipcPayload.trim()}
        >
          {isSendingDemoMessage ? 'Sending...' : 'Send via IPC'}
        </button>
      </div>
    </form>
  );
}
