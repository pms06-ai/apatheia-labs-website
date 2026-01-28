# Full SDD workflow

## Configuration
- **Artifacts Path**: {@artifacts_path} → `.zenflow/tasks/{task_id}`

---

## Workflow Steps

### [x] Step: Requirements
<!-- chat-id: 2ba2ed09-3ff1-4a42-809a-2b22a0867f52 -->

Create a Product Requirements Document (PRD) based on the feature description.

1. Review existing codebase to understand current architecture and patterns
2. Analyze the feature definition and identify unclear aspects
3. Ask the user for clarifications on aspects that significantly impact scope or user experience
4. Make reasonable decisions for minor details based on context and conventions
5. If user can't clarify, make a decision, state the assumption, and continue

Save the PRD to `{@artifacts_path}/requirements.md`.

### [x] Step: Technical Specification
<!-- chat-id: 26b7e084-5569-4e0c-a868-72d223b3133b -->

Create a technical specification based on the PRD in `{@artifacts_path}/requirements.md`.

1. Review existing codebase architecture and identify reusable components
2. Define the implementation approach

Save to `{@artifacts_path}/spec.md` with:
- Technical context (language, dependencies)
- Implementation approach referencing existing code patterns
- Source code structure changes
- Data model / API / interface changes
- Delivery phases (incremental, testable milestones)
- Verification approach using project lint/test commands

### [x] Step: Planning
<!-- chat-id: baac1f33-2269-4b89-af7a-2dd68d2bd2ea -->

Create a detailed implementation plan based on `{@artifacts_path}/spec.md`.

1. Break down the work into concrete tasks
2. Each task should reference relevant contracts and include verification steps
3. Replace the Implementation step below with the planned tasks

Save to `{@artifacts_path}/plan.md`.

---

### [x] Step: PR #1 fixes — branch `new-task-cfdd`
<!-- chat-id: bc316a73-b5db-46f4-b1f6-2cd826128d72 -->

Checkout branch `new-task-cfdd` and apply all three fixes for the vanilla JS site. These changes are independent of PR #2 and should be committed together.

**Context**: Branch uses `node build.js` as a custom build system, has `@playwright/test` and `serve` as devDeps, and Playwright config in `playwright.config.ts` with `e2e/specs/` test directory.

- [x] **R1.1 — Add missing npm scripts** (`package.json`)
  - Add `"dev": "npx serve . -l 3000 --no-clipboard"` to scripts (required by `playwright.config.ts` webServer command)
  - Add `"e2e": "npx playwright test"` to scripts (required by CI workflow `.github/workflows/e2e.yml`)
  - Reference: spec.md §3.1

- [x] **R1.2 — Add `vercel.json`** (new file at repo root)
  - Create `vercel.json` with `{ "buildCommand": "npm run build", "outputDirectory": "." }`
  - Output dir is `.` because `build.js` writes HTML in-place under `research/` alongside root static files
  - Reference: spec.md §3.2

- [x] **R1.3 — Add bfcache handler** (`app.js`)
  - Add `window.addEventListener('pageshow', (e) => { if (e.persisted) init(); });` after the existing `pagehide` listener
  - This re-attaches all event handlers after bfcache restore since `DOMContentLoaded` doesn't re-fire
  - Reference: spec.md §3.3

- [x] **Verify**: Run `npm run build && npm run e2e` on the branch and confirm both pass
- [x] **Commit**: Use conventional commit format, e.g. `fix: add e2e script, vercel config, and bfcache handler`

### [x] Step: PR #2 fixes — branch `new-task-af54`
<!-- chat-id: 9522effd-16f8-4aff-bf67-8bf3bd015de1 -->

Checkout branch `new-task-af54` and apply all four fixes for the Next.js rebuild. These changes are independent of PR #1 and should be committed together.

**Context**: Branch is a Next.js 16 + React 19 + Tailwind 4 + TypeScript 5.9 project with `output: 'export'` (static export to `out/`). No Playwright infrastructure exists yet.

- [x] **R2.1 — Add Playwright E2E infrastructure**
  - [x] Add `@playwright/test` and `serve` as devDependencies in `package.json`
  - [x] Add `"e2e": "npx playwright test"` to scripts in `package.json`
  - [x] Create `playwright.config.ts` at repo root — configure `webServer` to serve `out/` on port 3000 via `npx serve out -l 3000 --no-clipboard`, set `testDir: './e2e'`, single `chromium` project, CI-aware reporter config
  - [x] Create `e2e/smoke.spec.ts` — minimal smoke test: homepage loads, has title matching `/Phronesis|Apatheia/i`, renders `h1`, has `header nav`
  - [x] Run `npm install` to update `package-lock.json`
  - Reference: spec.md §4.1

- [x] **R2.2 — Add CodeQL workflow** (`.github/workflows/codeql.yml`)
  - Create workflow that scans only `javascript-typescript` (no Rust)
  - Trigger on push to main, PRs to main, and weekly schedule
  - Uses `actions/checkout@v4`, `github/codeql-action/init@v3`, `github/codeql-action/autobuild@v3`, `github/codeql-action/analyze@v3`
  - Reference: spec.md §4.2

- [x] **R2.3 — Deduplicate TOC heading IDs** (`lib/research.ts`)
  - In `extractHeadings()`, add a `Map<string, number>` to track seen IDs
  - On collision, append `-{count}` (e.g. `the-event`, `the-event-1`, `the-event-2`)
  - Change `const id` to `let id` and add deduplication logic after slug generation
  - Reference: spec.md §4.3

- [x] **R2.4 — Fix hash-only nav links** (`components/layout/header.tsx`)
  - Change `{ href: '#roadmap', label: 'Roadmap' }` → `{ href: '/#roadmap', label: 'Roadmap' }`
  - Change `{ href: '#download', label: 'Download' }` → `{ href: '/#download', label: 'Download' }`
  - Reference: spec.md §4.4

- [x] **Verify**: Run `npm run build && npm run e2e` and `npm run lint` on the branch and confirm all pass
- [x] **Commit**: Use conventional commit format, e.g. `fix: add e2e infrastructure, codeql workflow, and review fixes`
