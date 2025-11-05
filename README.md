# Electron + Next.js demo

A tiny yet complete example that shows how Electron and Next.js can live together. The Electron
process lives under `main/`, while the Next.js UI stays under `renderer/`.

## Scripts

```bash
npm run dev    # next dev (renderer) + electron with hot reload
npm run build  # next build renderer (outputs .next inside renderer/)
npm start      # next start renderer + electron pointed at http://localhost:3000
```

## Folder structure

```
Electron_next/
|-- main/              # Electron entry point and preload bridge
|   |-- main.js
|   `-- preload.js
|-- renderer/          # Standard Next.js "pages" app
|   |-- next.config.js
|   |-- pages/
|   |   |-- _app.js
|   |   `-- index.js
|   `-- styles/
|       `-- globals.css
|-- package.json
`-- README.md
```

## Production flow

1. `npm run build` generates the optimized `.next` output for the renderer.
2. `npm start` runs `next start renderer` (serving the built files on port 3000) and boots Electron in
   parallel. The main process points the BrowserWindow at `ELECTRON_START_URL`, so the same entry file
   works for both dev and prod.
3. `main/preload.js` keeps IPC access explicit so the React code can safely call
   `window.electronAPI.getSystemInfo()`.

This is intentionally lightweight so developers can lift the pieces into their own projects.
