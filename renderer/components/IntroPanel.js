export default function IntroPanel() {
  return (
    <section className="rounded-[18px] bg-white p-8 shadow-[0_25px_50px_-12px_rgba(15,23,42,0.1)]">
      <h1 className="text-3xl font-semibold text-slate-900">Electron + Next.js</h1>
      <p className="mt-3 text-base text-slate-600">
        This tiny project shows the full lifecycle: Next.js renders the UI, Electron owns the desktop shell,
        and a preload bridge wires the two together.
      </p>
      <ol className="mt-5 list-decimal space-y-3 pl-5 text-base text-slate-700">
        <li>
          <strong>npm run dev</strong> starts the Next dev server and waits for it before launching Electron.
        </li>
        <li>
          <strong>main/main.js</strong> creates a BrowserWindow and loads the URL exposed via{' '}
          <code>ELECTRON_START_URL</code>, so the exact same entry file works in dev and prod.
        </li>
        <li>
          <strong>main/preload.js</strong> exposes a safe API so React components can talk to Electron.
        </li>
        <li>
          <strong>npm run build</strong> runs <code>next build renderer</code>; <strong>npm start</strong>{' '}
          runs <code>next start renderer</code> plus Electron for a production-like boot.
        </li>
      </ol>
    </section>
  );
}
