# Product Requirements Document — CI/CD & Code Review Fixes for PRs #1 and #2

## Overview

Two open pull requests (`new-task-cfdd` — PR #1 and `new-task-af54` — PR #2) are failing CI checks and have outstanding code-review suggestions. This task addresses all failures and review feedback so both PRs can merge cleanly.

---

## Scope

The work spans **two separate branches** with no shared changes. Each set of fixes is independent and can be implemented in parallel.

---

## PR #1 — Branch `new-task-cfdd` (Vanilla JS Site)

### Current State

- **Stack**: Static HTML/CSS/JS landing page, `node build.js` generates research pages in-place under `research/`.
- **package.json scripts**: `build`, `build:sitemap`, `watch` — no `e2e` or `dev` script.
- **Playwright config** (`playwright.config.ts`): Uses `npx serve . -l 3000` as the webServer, tests in `e2e/specs/`, baseURL `http://localhost:3000`.
- **devDependencies**: `@playwright/test ^1.58.0`, `serve ^14.2.5`.
- **CI workflow** (`.github/workflows/e2e.yml`): Runs `npm run build` then `npm run e2e`.
- **No `vercel.json`** exists.
- **`app.js`**: Has `init()` and `destroyAll()` functions, `pagehide` listener calls `destroyAll()`, but no `pageshow` listener for bfcache restore.

### R1.1 — Add Missing `"e2e"` npm Script

| Field | Detail |
|-------|--------|
| **Problem** | The E2E workflow runs `npm run e2e` but there is no `"e2e"` script in `package.json`, so CI fails immediately. |
| **Requirement** | Add `"e2e": "npx playwright test"` to the `scripts` section of `package.json`. |
| **Acceptance Criteria** | `npm run e2e` executes Playwright against the existing `e2e/specs/` tests without errors (assuming the server is running). CI's E2E job passes. |
| **Notes** | The Playwright config already defines a `webServer` block that starts `npx serve . -l 3000`, so the `e2e` script itself only needs to invoke `npx playwright test`. Also add a `"dev": "npx serve . -l 3000 --no-clipboard"` script since `playwright.config.ts` references `npm run dev` in its webServer command. |

### R1.2 — Fix Vercel Deployment

| Field | Detail |
|-------|--------|
| **Problem** | Vercel cannot auto-detect the framework because the project uses a custom `build.js`, causing deployment failures. |
| **Requirement** | Add a `vercel.json` at the repo root that specifies the build command and output directory. |
| **Acceptance Criteria** | Vercel successfully deploys the site using the custom build script. The config correctly points to the output directory (`.` — the repo root, since `build.js` writes HTML in-place under `research/`). |
| **Design Decision** | Since `build.js` writes output into `research/{category}/{article}/index.html` alongside the repo root files (`index.html`, `styles.css`, `app.js`), the output directory is the repo root itself (`.`). The `vercel.json` should set `"buildCommand": "npm run build"` and `"outputDirectory": "."`. |
| **Notes** | Verify that `vercel.json` is committed with correct JSON syntax. Review whether any `404.html`, `robots.txt`, and `sitemap.xml` are picked up by Vercel from the root. |

### R1.3 — bfcache Handler Reinitialization

| Field | Detail |
|-------|--------|
| **Problem** | `destroyAll()` runs on `pagehide`, removing all event listeners. If the user navigates back via bfcache, `DOMContentLoaded` does not re-fire, leaving the page non-interactive (modal triggers, mobile menu, waitlist form all broken). |
| **Requirement** | Add a `pageshow` event listener in `app.js` that re-runs `init()` when `event.persisted` is `true`. |
| **Acceptance Criteria** | After navigating away and pressing the browser back button, all interactive features (modals, mobile menu, waitlist form) work correctly. |
| **Implementation Guidance** | Add immediately after the existing `window.addEventListener('pagehide', destroyAll)` line: `window.addEventListener('pageshow', (e) => { if (e.persisted) init(); });` |

---

## PR #2 — Branch `new-task-af54` (Next.js Rebuild)

### Current State

- **Stack**: Next.js 16, React 19, Tailwind CSS 4, TypeScript 5.9.
- **package.json scripts**: `dev`, `build`, `start`, `lint`, `postbuild` — no `e2e` script.
- **No `@playwright/test` devDependency**.
- **CI workflow** (`.github/workflows/e2e.yml`): Same as PR #1 — runs `npm run e2e`.
- **`src-tauri/` directory** has been removed, but CodeQL default setup still scans for Rust.
- **`lib/research.ts`**: `extractHeadings()` generates heading IDs without deduplication.
- **`components/layout/header.tsx`**: `navLinks` array has `#roadmap` and `#download` as hash-only hrefs.

### R2.1 — Add Missing `"e2e"` npm Script and Playwright Setup

| Field | Detail |
|-------|--------|
| **Problem** | No `"e2e"` script exists in `package.json`. Additionally, `@playwright/test` is not a devDependency, no `playwright.config.ts` exists for Next.js, and no test specs target the new site. |
| **Requirement** | (a) Add `@playwright/test` as a devDependency. (b) Create a `playwright.config.ts` configured for the Next.js app (webServer using `npm run dev` or `npm start`, baseURL `http://localhost:3000`). (c) Create at least one smoke-test E2E spec that loads the homepage and verifies it renders. (d) Add `"e2e": "npx playwright test"` to `package.json` scripts. |
| **Acceptance Criteria** | `npm run e2e` runs Playwright, the smoke test passes against the Next.js dev server, and the CI E2E job goes green. |
| **Notes** | Since the old vanilla-JS E2E tests (smoke, navigation, analysis specs) are tightly coupled to the old page structure (hash routing, Tauri-style page objects), they cannot be reused directly. A minimal smoke test is sufficient for now. |

### R2.2 — Fix CodeQL Rust Analysis Failure

| Field | Detail |
|-------|--------|
| **Problem** | The `src-tauri/` Rust source was removed in this PR, but the repo's CodeQL default setup still includes Rust scanning. The Rust analysis job errors out because there's no Rust code to scan. |
| **Requirement** | Add a `.github/workflows/codeql.yml` workflow that explicitly lists only the languages present in the project (`javascript-typescript`, `python`) plus `actions`. This overrides the default setup and prevents the Rust job from running. |
| **Acceptance Criteria** | CodeQL runs successfully without Rust analysis errors. All configured language scans pass. |
| **Notes** | Use the standard GitHub CodeQL analysis workflow template. The workflow should trigger on push to `main`, PRs to `main`, and on a weekly schedule. |

### R2.3 — Deduplicate TOC Heading IDs in `lib/research.ts`

| Field | Detail |
|-------|--------|
| **Problem** | The `extractHeadings()` function (lines ~182-191) generates heading IDs by lowercasing and slugifying text but does not deduplicate. If two headings have identical text (e.g., "The Event" appears twice), they produce the same `id`, breaking in-page anchor navigation. |
| **Requirement** | Add a deduplication counter so the second occurrence of an ID becomes `{id}-1`, the third becomes `{id}-2`, etc., matching `rehype-slug` behavior. |
| **Acceptance Criteria** | Given markdown with two `## The Event` headings, the generated IDs are `the-event` and `the-event-1`. The function remains pure (no shared state across calls). |
| **Implementation Guidance** | Maintain a `Map<string, number>` within `extractHeadings()` to track seen IDs. On collision, append `-{count}` and increment. |

### R2.4 — Fix Hash-Only Navigation Links in `header.tsx`

| Field | Detail |
|-------|--------|
| **Problem** | The header's nav links include `#roadmap` and `#download` as bare hash hrefs. When on a non-home route (e.g., `/research`), clicking these navigates to `/research#roadmap` instead of the homepage section. |
| **Requirement** | Change `#roadmap` to `/#roadmap` and `#download` to `/#download` in the `navLinks` array in `components/layout/header.tsx`. |
| **Acceptance Criteria** | Clicking "Roadmap" or "Download" from any page navigates to the homepage and scrolls to the target section. |

---

## Out of Scope

- Porting all old E2E tests (smoke, navigation, analysis) to the Next.js architecture (PR #2). Only a smoke test is required now.
- Changing CodeQL settings via the GitHub UI (Settings → Code security). The fix uses a workflow file override instead.
- Vercel project settings changes (handled via `vercel.json` in-repo).
- Any feature work, design changes, or content updates beyond the CI/review fixes listed above.

---

## Dependencies and Constraints

| Constraint | Detail |
|------------|--------|
| **Branch isolation** | PR #1 and PR #2 fixes are on separate branches (`new-task-cfdd` and `new-task-af54`). Changes must be committed to the correct branch. |
| **CI validation** | Each fix should be verified by checking that the relevant CI job would pass (e.g., `npm run e2e` succeeds locally, `npm run build` succeeds). |
| **No breaking changes** | Fixes must not alter existing functionality. The bfcache fix (R1.3) adds behavior; the TOC fix (R2.3) changes IDs only for duplicate headings. |
| **Conventional Commits** | Commit messages must follow the `type: subject` format per AGENTS.md. |

---

## Summary of Requirements

| ID | PR | Category | Summary |
|----|-----|----------|---------|
| R1.1 | #1 | CI fix | Add `"e2e"` and `"dev"` npm scripts to `package.json` |
| R1.2 | #1 | CI fix | Add `vercel.json` for custom build deployment |
| R1.3 | #1 | Code review | Add `pageshow` bfcache handler in `app.js` |
| R2.1 | #2 | CI fix | Add Playwright devDep, config, smoke test, and `"e2e"` script |
| R2.2 | #2 | CI fix | Add `codeql.yml` workflow excluding Rust |
| R2.3 | #2 | Code review | Deduplicate heading IDs in `extractHeadings()` |
| R2.4 | #2 | Code review | Prefix hash-only nav hrefs with `/` in header |
