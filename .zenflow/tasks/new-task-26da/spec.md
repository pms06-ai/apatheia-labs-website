# Technical Specification — CI/CD & Code Review Fixes for PRs #1 and #2

## 1. Technical Context

### 1.1 Repository Overview

| Property | Value |
|----------|-------|
| Repository | `pms06-ai/apatheia-labs-website` |
| Primary language | JavaScript / TypeScript |
| Package manager | npm |
| Node version (CI) | 20 |
| CI platform | GitHub Actions |
| Deployment | Vercel |

### 1.2 Branch Architecture

| Branch | Stack | Build system | Status |
|--------|-------|-------------|--------|
| `new-task-cfdd` (PR #1) | Vanilla HTML/CSS/JS | `node build.js` (custom) | Failing: E2E, Vercel deploy |
| `new-task-af54` (PR #2) | Next.js 16, React 19, Tailwind 4, TS 5.9 | `next build` (static export) | Failing: E2E, CodeQL Rust |

### 1.3 Shared CI Workflow

Both branches use an identical `.github/workflows/e2e.yml`:

```
checkout → setup node 20 → npm ci → playwright install chromium → npm run build → npm run e2e
```

The workflow expects an `"e2e"` script in `package.json`. Neither branch defines one.

### 1.4 Dependencies Already Present

**PR #1 (`new-task-cfdd`)**:
- `@playwright/test ^1.58.0` (devDep)
- `serve ^14.2.5` (devDep)
- `glob`, `gray-matter`, `marked` (deps)

**PR #2 (`new-task-af54`)**:
- `next 16.1.6`, `react 19.2.4`, `tailwindcss 4.1.18` (deps)
- `typescript 5.9.3`, `eslint 9.39.2` (devDeps)
- No `@playwright/test` — must be added

---

## 2. Implementation Approach

All changes follow existing code patterns. No new frameworks, abstractions, or architectural changes are introduced. Each fix is the minimum change required to resolve the CI failure or review comment.

---

## 3. PR #1 — Branch `new-task-cfdd`

### 3.1 R1.1 — Add Missing npm Scripts

**File**: `package.json`

**Change**: Add two scripts to the `"scripts"` object:

```json
"dev": "npx serve . -l 3000 --no-clipboard",
"e2e": "npx playwright test"
```

**Rationale**:
- `"e2e"` — required by the CI workflow (`npm run e2e`).
- `"dev"` — required by `playwright.config.ts` which sets `webServer.command: 'npm run dev'`. The config on this branch uses `npx serve . -l 3000 --no-clipboard` as the static server (port 3000, matching `baseURL`). Without this script, Playwright cannot start the web server.

**Note**: The `playwright.config.ts` on this branch uses `baseURL: 'http://localhost:3000'` and `webServer.command: 'npx serve . -l 3000 --no-clipboard'`. The `"dev"` script must match the webServer command exactly.

**Verification**: `npm run e2e` succeeds locally after `npm run build`.

### 3.2 R1.2 — Add `vercel.json`

**File**: `vercel.json` (new file at repo root)

**Content**:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "."
}
```

**Rationale**:
- `build.js` writes output in-place: `research/{category}/{article}/index.html`, `sitemap.xml`, and `research/metadata.json` — all alongside the root `index.html`, `styles.css`, and `app.js`.
- There is no separate output directory; the repo root **is** the output directory.
- Without `vercel.json`, Vercel cannot detect the framework and fails to build.

**Design Decision**: Using `"outputDirectory": "."` is correct because `build.js` mutates the source tree in-place rather than emitting to a `dist/` or `out/` directory. All static assets (`index.html`, `404.html`, `styles.css`, `app.js`, `robots.txt`, `sitemap.xml`, `og-image.png`, `favicon.ico`) live at the repo root and will be served by Vercel.

**Verification**: Deploy preview builds and serves the site correctly.

### 3.3 R1.3 — bfcache Handler Reinitialization

**File**: `app.js`

**Change**: Add a `pageshow` event listener immediately after the existing `pagehide` listener.

**Current code** (end of `app.js`):

```javascript
window.addEventListener('pagehide', destroyAll);

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
```

**New code**:

```javascript
window.addEventListener('pagehide', destroyAll);
window.addEventListener('pageshow', (e) => { if (e.persisted) init(); });

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
```

**Rationale**:
- When a page is restored from bfcache, `DOMContentLoaded` does not fire again. The `pageshow` event fires with `event.persisted === true`.
- `init()` is idempotent in practice: `Modal.init()` creates the overlay (or re-creates it), `initMobileMenu()` and `initWaitlistForm()` attach listeners. Since `destroyAll()` removed all listeners on `pagehide`, re-calling `init()` is safe.
- The `loadModalContent()` call inside `init()` will fetch the JSON again, but since it's cached by the browser, this is negligible overhead.

**Verification**: Navigate to the page → click a link to navigate away → press browser back button → verify modals, mobile menu, and waitlist form remain functional.

---

## 4. PR #2 — Branch `new-task-af54`

### 4.1 R2.1 — Add Playwright E2E Infrastructure

This requires multiple coordinated changes:

#### 4.1.1 Add devDependency

**File**: `package.json`

**Change**: Add to `"devDependencies"`:

```json
"@playwright/test": "^1.52.0"
```

Then run `npm install` to update `package-lock.json`.

#### 4.1.2 Add `"e2e"` Script

**File**: `package.json`

**Change**: Add to `"scripts"`:

```json
"e2e": "npx playwright test"
```

#### 4.1.3 Create `playwright.config.ts`

**File**: `playwright.config.ts` (new file at repo root)

**Content**:

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [
        ['list'],
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
        ['junit', { outputFile: 'playwright-results.xml' }],
      ]
    : [['html', { open: 'on-failure', outputFolder: 'playwright-report' }]],
  timeout: 30000,
  expect: { timeout: 5000 },
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    viewport: { width: 1400, height: 900 },
    actionTimeout: 10000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npx serve out -l 3000 --no-clipboard',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 10000,
  },
})
```

**Design decisions**:
- **`webServer.command: 'npx serve out -l 3000'`**: Since `next.config.ts` sets `output: 'export'`, `next build` produces a static site in `out/`. We serve this with `serve` rather than starting the Next.js dev server, which aligns with how CI runs `npm run build` before `npm run e2e`.
- **Port 3000**: Standard Next.js port, avoids conflicts.
- **Reporter config**: Matches the CI workflow's artifact upload expectations (`playwright-report/`, `playwright-results.xml`).
- **`serve` as a devDependency**: Must be added alongside `@playwright/test`.

#### 4.1.4 Add `serve` devDependency

**File**: `package.json`

**Change**: Add to `"devDependencies"`:

```json
"serve": "^14.2.5"
```

#### 4.1.5 Create Smoke Test

**File**: `e2e/smoke.spec.ts` (new file)

```typescript
import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Phronesis|Apatheia/i)
  })

  test('renders hero section', async ({ page }) => {
    await page.goto('/')
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()
  })

  test('header navigation is present', async ({ page }) => {
    await page.goto('/')
    const nav = page.locator('header nav')
    await expect(nav).toBeVisible()
  })
})
```

**Rationale**: A minimal smoke test that verifies the homepage loads, renders a heading, and has navigation. This is sufficient to validate the build output is a functioning site. Full E2E test porting is out of scope per the requirements.

**Verification**: `npm run build && npm run e2e` passes locally and in CI.

### 4.2 R2.2 — Fix CodeQL Rust Analysis

**File**: `.github/workflows/codeql.yml` (new file)

**Content**:

```yaml
name: 'CodeQL'

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '30 5 * * 1'

jobs:
  analyze:
    name: Analyze (${{ matrix.language }})
    runs-on: ubuntu-latest
    permissions:
      security-events: write
      packages: read
      actions: read
      contents: read

    strategy:
      fail-fast: false
      matrix:
        language:
          - javascript-typescript

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Initialize CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: ${{ matrix.language }}

      - name: Autobuild
        uses: github/codeql-action/autobuild@v3

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v3
        with:
          category: '/language:${{ matrix.language }}'
```

**Design decisions**:
- **Only `javascript-typescript`**: The project is purely JS/TS after the Rust removal. The requirements mention Python but the Next.js branch has no Python code — include only languages actually present.
- **Weekly schedule**: Standard CodeQL practice for catching vulnerabilities in dependencies.
- **Explicit workflow overrides default setup**: Having a `.github/workflows/codeql.yml` file causes GitHub to use this instead of the default CodeQL setup, which still includes Rust.

**Note**: After this workflow is merged, the repository owner should disable the "default setup" CodeQL configuration in Settings → Code security → Code scanning to avoid the duplicate "configuration not found" warning.

**Verification**: CodeQL workflow runs without Rust analysis errors.

### 4.3 R2.3 — Deduplicate TOC Heading IDs

**File**: `lib/research.ts`

**Function**: `extractHeadings()`

**Current code** (lines ~182-191):

```typescript
export function extractHeadings(
  markdown: string,
): { depth: number; text: string; id: string }[] {
  const headings: { depth: number; text: string; id: string }[] = [];
  const lines = markdown.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const depth = match[1].length;
      const text = match[2].replace(/\*\*/g, '').replace(/`/g, '').trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      headings.push({ depth, text, id });
    }
  }

  return headings;
}
```

**New code**:

```typescript
export function extractHeadings(
  markdown: string,
): { depth: number; text: string; id: string }[] {
  const headings: { depth: number; text: string; id: string }[] = [];
  const idCounts = new Map<string, number>();
  const lines = markdown.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const depth = match[1].length;
      const text = match[2].replace(/\*\*/g, '').replace(/`/g, '').trim();
      let id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      const count = idCounts.get(id) ?? 0;
      idCounts.set(id, count + 1);
      if (count > 0) {
        id = `${id}-${count}`;
      }

      headings.push({ depth, text, id });
    }
  }

  return headings;
}
```

**Rationale**:
- Uses a `Map<string, number>` scoped within the function (no shared state).
- First occurrence: `the-event` (count starts at 0, no suffix).
- Second occurrence: `the-event-1` (count was 1).
- Third occurrence: `the-event-2` (count was 2).
- Matches `rehype-slug` deduplication behavior as specified in the requirements.

**Verification**: Given markdown with two `## The Event` headings, the output IDs are `the-event` and `the-event-1`.

### 4.4 R2.4 — Fix Hash-Only Navigation Links

**File**: `components/layout/header.tsx`

**Current code** (lines 12-14 in `navLinks` array):

```typescript
{ href: '#roadmap', label: 'Roadmap' },
{ href: '#download', label: 'Download' },
```

**New code**:

```typescript
{ href: '/#roadmap', label: 'Roadmap' },
{ href: '/#download', label: 'Download' },
```

**Rationale**:
- Hash-only hrefs (`#roadmap`) resolve relative to the current path. On `/research`, clicking "Roadmap" navigates to `/research#roadmap`, which doesn't exist.
- Prefixing with `/` makes them absolute paths to the homepage sections (`/#roadmap`), which works from any route.
- Next.js `<Link>` handles `/#roadmap` correctly — it navigates to the homepage and scrolls to the `#roadmap` anchor.

**Verification**: From `/research`, clicking "Roadmap" navigates to `/#roadmap` (homepage scrolled to the roadmap section).

---

## 5. Source Code Structure Changes

### PR #1 (`new-task-cfdd`)

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Modify | Add `"dev"` and `"e2e"` scripts |
| `vercel.json` | Create | Build command and output directory config |
| `app.js` | Modify | Add `pageshow` bfcache listener (1 line) |

### PR #2 (`new-task-af54`)

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Modify | Add `"e2e"` script, `@playwright/test` and `serve` devDeps |
| `playwright.config.ts` | Create | Playwright config for static export |
| `e2e/smoke.spec.ts` | Create | Minimal homepage smoke test |
| `.github/workflows/codeql.yml` | Create | CodeQL workflow without Rust |
| `lib/research.ts` | Modify | Add heading ID deduplication |
| `components/layout/header.tsx` | Modify | Prefix hash hrefs with `/` |

---

## 6. Delivery Phases

### Phase 1: PR #1 Fixes (branch `new-task-cfdd`)

These changes are independent and can be committed together.

1. Add `"dev"` and `"e2e"` scripts to `package.json`
2. Create `vercel.json`
3. Add `pageshow` listener to `app.js`
4. Verify: `npm run build && npm run e2e` passes

### Phase 2: PR #2 Fixes (branch `new-task-af54`)

These changes are independent and can be committed together.

1. Add `@playwright/test` and `serve` devDependencies, add `"e2e"` script
2. Create `playwright.config.ts`
3. Create `e2e/smoke.spec.ts`
4. Create `.github/workflows/codeql.yml`
5. Modify `lib/research.ts` — heading ID deduplication
6. Modify `components/layout/header.tsx` — prefix hash hrefs
7. Verify: `npm run build && npm run e2e` passes

---

## 7. Verification Approach

Since there is no separate test suite (`npm run build` is the validation step per AGENTS.md), verification uses:

| Check | Command | Applies to |
|-------|---------|-----------|
| Build succeeds | `npm run build` | Both PRs |
| E2E tests pass | `npm run e2e` | Both PRs |
| Lint passes | `npm run lint` | PR #2 only |
| TypeScript compiles | (covered by `npm run build`) | PR #2 only |

**Manual verification** (not automatable in CI):
- R1.2: Vercel deploy preview builds correctly
- R1.3: bfcache restore reattaches event handlers
- R2.2: CodeQL workflow skips Rust analysis
- R2.4: Hash links navigate to homepage from non-home routes

---

## 8. Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| PR #2 `serve` serves `out/` but `next build` might not produce `out/` if `output: 'export'` is removed | Verified: `next.config.ts` has `output: 'export'`, which outputs to `out/` |
| `pageshow` + `init()` in PR #1 could double-initialize if called without prior `destroyAll()` | Safe: `pageshow` with `persisted` only fires after bfcache restore, which always follows `pagehide` → `destroyAll()` |
| CodeQL default setup may still run alongside the explicit workflow | Note added: repo owner should disable default setup after merge |
| E2E smoke test may fail if homepage markup changes | Smoke test uses resilient selectors (`h1`, `header nav`, page title regex) |
