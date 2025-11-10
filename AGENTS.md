# Repository Guidelines

## Project Structure & Module Organization
The Electron process lives in `main/`, with window bootstrapping in `main/main.js`, preload isolation in `main/preload.js`, and IPC logic under `main/handlers/` (e.g., `filesystemHandler.js`, `messageHandler.js`). The Next.js UI sits inside `renderer/`, following standard `pages/`, `components/`, `hooks/`, `styles/`, and `public/` folders; assets such as static icons or Tailwind config stay colocated there. Shared utilities or release helpers belong in `scripts/`. All automated checks live in `tests/`, which contains Node test modules like `tests/ipcHistory.test.js`. Keep temporary build output (`renderer/.next/`) out of commits.

## Build, Test, and Development Commands
Run `npm run dev` to start Next.js on port 3000 and attach Electron with hot reload via Nodemon. `npm run build` performs `next build renderer`, producing optimized assets under `renderer/.next`. Use `npm start` after a build to serve the renderer (`next start renderer`) and launch Electron in production mode. `npm test` executes all Node-based tests (`node --test`). When adding new workflows, extend `package.json` scripts rather than introducing ad-hoc shell snippets.
Before marking a task as complete, double-check that no ESLint or TypeScript errors remain; this ensures code quality and prevents build regressions.

## Coding Style & Naming Conventions
JavaScript is authored with CommonJS modules in `main/` and ES modules in `renderer/`. Match the existing 2-space indentation, prefer double quotes, and retain semicolons. Components and hooks follow PascalCase (`RendererPanel`) and `useFoo` naming, while IPC channels use dashed strings such as `ipc-demo:realtime-update`. Preload bridges should only expose explicit, typed APIs on `contextBridge.exposeInMainWorld`. Reuse Tailwind utility classes from `renderer/styles/globals.css` instead of inline styles.

## Testing Guidelines
Tests rely on the built-in `node:test` runner plus `node:assert/strict`. Name files `*.test.js` and group them under `tests/` to stay automatically discoverable. Mirror the structure of the module under test (`main/ipcHistory.js` → `tests/ipcHistory.test.js`) and isolate state within each test via fresh fixtures. Execute `npm test` locally before requesting review; if a change affects IPC flow or preload contracts, add regression tests that assert both happy-path behavior and boundary conditions (e.g., history limits, invalid payloads). Target meaningful coverage but prioritize deterministic behavior over broad numbers.

## Commit & Pull Request Guidelines
Recent commits are terse (`Fri`, `!@#`), so adopt clearer, imperative summaries such as `feat: add filesystem handler retries`. Each PR should include: (1) a short description of the motivation and approach, (2) references to related issues or tickets, (3) manual verification notes (`npm run dev` / platform), and (4) screenshots or GIFs for UI-facing updates from `renderer/`. Keep changes scoped; split refactors from feature work to simplify review.

## Security & Configuration Tips
Electron runs with `contextIsolation: true`, so avoid leaking Node globals—extend the preload contract instead. Do not hard-code secrets or file paths; read configuration from environment variables like `ELECTRON_START_URL` or from `.env.local` consumed by Next.js. When introducing new IPC channels, validate inputs in the handler layer and reuse `appendHistoryEntry` to make activity auditable.

## Preservation & Localization
Throughout all work, preserve the existing codebase as much as possible and prevent any UTF/encoding corruption of Korean comments or annotations.
