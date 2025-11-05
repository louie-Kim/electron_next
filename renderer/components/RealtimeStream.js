export default function RealtimeStream({ status, snapshot }) {
  return (
    <div className="grid gap-3 border-t border-slate-200 pt-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Realtime Stream</h3>
      </div>
      <p className="text-sm text-slate-600">{status}</p>
      {snapshot && (
        <ul className="mt-3 grid list-none gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <li className="flex items-center gap-2">
            <strong>Timestamp:</strong> {snapshot.timestamp}
          </li>
          <li className="flex items-center gap-2">
            <strong>History Size:</strong> {snapshot.historySize}
          </li>
          <li className="flex items-center gap-2">
            <strong>Latest Payload:</strong> {snapshot.lastPayload || "(empty)"}
          </li>
        </ul>
      )}
    </div>
  );
}
