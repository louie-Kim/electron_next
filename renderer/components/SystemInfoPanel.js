export default function SystemInfoPanel({ systemMessage, systemInfo }) {
  return (
    <>
      <p className="text-base text-slate-600">{systemMessage}</p>
      {systemInfo && (
        <ul className="mt-5 grid list-none gap-3 p-0">
          {Object.entries(systemInfo).map(([label, value]) => (
            <li key={label} className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {label}
              </span>
              <span className="block text-lg font-semibold text-slate-900">{value}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
