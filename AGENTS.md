# Repository Guidelines

## Project Structure & Module Organization
- `src/` hosts the React UI (pages in `src/pages/`, shared UI in `src/components/`, hooks in `src/hooks/`, utilities in `src/lib/`, styles in `src/styles/`, tests in `src/__tests__/`).
- `src-tauri/` contains the Rust/Tauri backend (`src-tauri/src/engines/`, `commands/`, `db/`, `sam/`).
- `packages/` holds workspace packages (`packages/mcp-server/`, `packages/obsidian-plugin/`).
- `public/` is app static assets; `website/` holds the marketing site and research pages; `dist/` is build output.

## Build, Test, and Development Commands
- `npm run dev`: start the Vite dev server.
- `npm run tauri:dev`: run the desktop app with Tauri in dev mode.
- `npm run build`: Vite production build (generates `dist/`).
- `cargo check --manifest-path src-tauri/Cargo.toml`: Rust compile check.
- `npm run type-check`: TypeScript compile check.
- `npm run lint` / `npm run format`: ESLint and Prettier.
- `npm test` / `npm run test:watch` / `npm run test:coverage`: Jest tests.
- `npm run mcp:dev` and `npm run obsidian:dev`: workspace package dev flows.

## Coding Style & Naming Conventions
- Prettier enforces 2-space indentation, single quotes, no semicolons, 100-char lines.
- ESLint is active for TS/React; prefix intentionally unused args with `_`.
- Use PascalCase for components (e.g., `src/components/TimelinePanel.tsx`) and `useX` for hooks.

## Testing Guidelines
- Jest + Testing Library; tests live under `src/__tests__/` and use `*.test.ts(x)` naming.
- Coverage thresholds are enforced (40% lines/branches, 35% functions); run `npm run test:coverage` or `npm run test:ci`.

## Commit & Pull Request Guidelines
- Conventional Commits; scope is optional but must match `commitlint.config.js` when used.
- Examples: `feat(ui): add timeline panel`, `fix(tauri): guard db init`.
- Use lower-case subjects and keep headers ≤72 chars.
- PRs should include a clear description, linked issue, and screenshots for UI changes; run `npm run validate`, `npm run build`, and `cargo check --manifest-path src-tauri/Cargo.toml` before requesting review.

## Tauri/IPC Integration Notes
- `src/CONTRACT.ts` is the TS source of truth for IPC types; keep it aligned with Rust commands.
- Register new commands in `src-tauri/src/lib.rs` and wire wrappers in `src/lib/tauri/commands.ts`.

## Configuration Tips
- Copy `.env.example` to `.env.local` for local secrets; never commit real credentials.
