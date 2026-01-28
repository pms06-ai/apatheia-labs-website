# Spec and build

## Configuration
- **Artifacts Path**: {@artifacts_path} → `.zenflow/tasks/{task_id}`

---

## Agent Instructions

Ask the user questions when anything is unclear or needs their input. This includes:
- Ambiguous or incomplete requirements
- Technical decisions that affect architecture or user experience
- Trade-offs that require business context

Do not make assumptions on important decisions — get clarification first.

---

## Workflow Steps

### [x] Step: Technical Specification
<!-- chat-id: fa17b65b-bff1-4cdb-bd1e-35162bceb8ee -->

Assess the task's difficulty, as underestimating it leads to poor outcomes.
- easy: Straightforward implementation, trivial bug fix or feature
- medium: Moderate complexity, some edge cases or caveats to consider
- hard: Complex logic, many caveats, architectural considerations, or high-risk changes

Create a technical specification for the task that is appropriate for the complexity level:
- Review the existing codebase architecture and identify reusable components.
- Define the implementation approach based on established patterns in the project.
- Identify all source code files that will be created or modified.
- Define any necessary data model, API, or interface changes.
- Describe verification steps using the project's test and lint commands.

Save the output to `{@artifacts_path}/spec.md` with:
- Technical context (language, dependencies)
- Implementation approach
- Source code structure changes
- Data model / API / interface changes
- Verification approach

If the task is complex enough, create a detailed implementation plan based on `{@artifacts_path}/spec.md`:
- Break down the work into concrete tasks (incrementable, testable milestones)
- Each task should reference relevant contracts and include verification steps
- Replace the Implementation step below with the planned tasks

Rule of thumb for step size: each step should represent a coherent unit of work (e.g., implement a component, add an API endpoint, write tests for a module). Avoid steps that are too granular (single function).

Save to `{@artifacts_path}/plan.md`. If the feature is trivial and doesn't warrant this breakdown, keep the Implementation step below as is.

---

### [x] Step: Project Setup — Pull Codebase and Configure Environment
<!-- chat-id: a1cc6d75-3855-4613-860f-97d58041785f -->

Pull the existing codebase from `https://github.com/pms06-ai/apatheia-labs-website.git` into this worktree. Set up the project for development.

- Add the GitHub repo as a remote and pull the existing code into this branch
- Create `.gitignore` with entries for `node_modules/`, `dist/`, `.DS_Store`, `*.log`, and generated research HTML files
- Run `npm install` to install dependencies
- Run `npm run build` to verify the build pipeline works
- Verify the project structure is intact and all research articles generate correctly

**Verification:** `npm run build` completes without errors; `.gitignore` exists and covers generated artifacts.

---

### [ ] Step: Fix Critical HTML Syntax Errors and Accessibility

Fix broken HTML that affects parsing and accessibility compliance.

- Fix `</a>a>` → `</a>` at line 60 of `index.html`
- Fix `</div>div>` → `</div>` at line 63 of `index.html`
- Fix `</header>h` → `</header>` at line 87 of `index.html`
- Fix `</section>h` syntax error at line 90 of `index.html`
- Add `id="main-content"` to the appropriate element so the skip-to-content link works
- Add missing meta tags: `theme-color`, `og:locale`
- Verify all anchor links on the landing page resolve to existing sections

**Verification:** HTML parses cleanly (no stray text nodes); skip-to-content link navigates to the correct target; all `#anchor` links scroll to valid sections.

---

### [ ] Step: CSS Cleanup — Remove Duplicates, Unused Rules, and Standardize Breakpoints

Clean up `styles.css` to remove bloat and improve maintainability.

- Remove duplicate `.mobile-menu-btn` rule (appears at lines ~1998 and ~2762)
- Remove duplicate `.waitlist-form input[type='email']` rule (appears at lines ~1895 and ~2606)
- Remove or implement: `.scroll-progress` CSS (line ~2444) — either add the JS for a scroll progress indicator or remove the dead CSS
- Remove or implement: `.back-to-top` CSS (line ~2456) — either add the button to HTML or remove the dead CSS
- Standardize responsive breakpoints to 3-4 consistent sizes (e.g., 640px, 768px, 1024px)
- Extract repeated inline `rgba(184, 134, 11, ...)` values into CSS variables (`--bronze-10`, `--bronze-20`, etc.)
- Remove any other dead/unreachable selectors found during cleanup

**Verification:** `styles.css` has no duplicate rule blocks; file size reduced; site renders identically at all breakpoints (visual comparison).

---

### [ ] Step: JavaScript Refactoring — Extract Modal Data and Clean Up app.js

Refactor `app.js` to separate content from logic and fix code quality issues.

- Extract the `MODAL_CONTENT` object (~1,160 lines of data) into a separate `data/modal-content.json` file
- Update `app.js` to fetch or import the modal content data
- Consolidate multiple `DOMContentLoaded` listeners into a single initialization function
- Add cleanup for event listeners (`beforeunload` or equivalent)
- Remove `console.warn` from production code (line ~1225)
- Consolidate duplicate modal close button logic
- Fix waitlist form: replace the JavaScript `alert()` with a proper "coming soon" UI state (e.g., disabled input with placeholder text, or a styled banner explaining the waitlist is not yet active)

**Verification:** Modals still open/close correctly; mobile menu works; no console warnings in browser devtools; `app.js` file size reduced.

---

### [ ] Step: Navigation and Header/Footer Consistency

Align navigation, headers, and footers across all pages (landing page and research hub).

- Update `templates/partials/header.html` to match the landing page nav structure (remove broken `/#documentation`, `/#roadmap`, `/#waitlist` links that don't resolve on research pages)
- Align header tagline: use consistent tagline across landing page and research pages
- Update `templates/partials/footer.html` to match landing page footer
- Update `research/index.html` to use the aligned header/footer
- Rebuild research articles with `npm run build` so all generated HTML picks up the template changes
- Verify all cross-page links work (landing → research, research → landing)

**Verification:** Clicking every nav link on both landing page and research pages navigates correctly (no 404s, no dead anchors). Header/footer visually consistent across pages.

---

### [ ] Step: Build System Hardening

Improve `build.js` reliability and configurability.

- Wrap file write operations in try/catch with meaningful error messages
- Make base URL configurable via environment variable (`BASE_URL` env var with fallback to `https://apatheialabs.com`)
- Add basic validation that generated HTML contains expected elements (`<h1>`, no unresolved `{{placeholders}}`)
- Clean up root directory: move `.cargo-features-migration.md` and `.fcip-removal-summary.md` to `_rpi/archive/` or delete them

**Verification:** `npm run build` still succeeds; intentionally breaking a markdown file produces a clear error message (not a silent failure); generated HTML has no `{{template}}` placeholders.

---

### [ ] Step: Testing and Final Verification

Run all tests and perform comprehensive verification.

- Run existing Playwright E2E tests (`npx playwright test`) and fix any failures
- Manually verify: landing page loads, all sections visible, modals open/close, mobile menu works
- Manually verify: research hub loads, article pages render with TOC and breadcrumbs
- Check all internal links (anchors and cross-page) don't 404
- Verify CSS cleanup didn't break any layouts (compare key pages before/after)
- Write report to `{@artifacts_path}/report.md` describing what was implemented, how it was tested, and any issues encountered

**Verification:** All E2E tests pass; no visual regressions; no broken links; no console errors.
