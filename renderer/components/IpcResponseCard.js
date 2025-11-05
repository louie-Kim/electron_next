export default function IpcResponseCard({ ipcResponse }) {
  if (!ipcResponse) {
    return null;
  }

  return (
    <div className="grid gap-2 rounded-xl bg-blue-50 p-4 text-blue-900">
      <p>
        <strong>Echo:</strong> {ipcResponse.echo}
      </p>
      <p>
        <strong>Tip:</strong> {ipcResponse.tip}
      </p>
      <p>
        <strong>Handled:</strong> {ipcResponse.handledAt}
      </p>
    </div>
  );
}
