# Technical Specification: Clean Up and Build Out Apatheia Labs Website

## Difficulty Assessment: **Hard**

Complex project involving codebase migration, HTML/CSS/JS cleanup across multiple files, feature completion, build system fixes, and structural reorganization. High risk of regressions given the 1,400+ line index.html, 1,400+ line app.js, and 2,900+ line styles.css with no unit tests.

---

## Technical Context

- **Language**: HTML5, CSS3, Vanilla JavaScript (ES6 modules)
- **Build Tool**: Node.js (`build.js`) — converts Markdown research articles to HTML
- **Dependencies**: `glob` (^11.0.0), `gray-matter` (^4.0.3), `marked` (^15.0.0)
- **Testing**: Playwright E2E tests (Chromium)
- **Hosting**: Static site at `www.apatheialabs.com`
- **Source Repository**: `https://github.com/pms06-ai/apatheia-labs-website.git` (156 commits, needs to be pulled into this worktree)
- **Desktop App**: Tauri/Rust scaffolding exists in `src-tauri/` (out of scope for this task)

---

## Current State Summary

The live site at `www.apatheialabs.com` is a static landing page + research hub for "Phronesis," a forensic intelligence platform. It has:

- **Landing page** (`index.html`): 1,442 lines — hero, about, methodology, engines, use cases, roadmap, download, waitlist
- **App logic** (`app.js`): 1,416 lines — modals (50+ content definitions), mobile menu, waitlist form
- **Styles** (`styles.css`): 2,913 lines — custom CSS with design tokens, dark theme, responsive
- **Build pipeline** (`build.js`): 354 lines — Markdown-to-HTML for 100+ research articles
- **Research hub** (`/research/`): Generated HTML from Markdown with TOC, breadcrumbs, metadata
- **E2E tests**: 3 spec files (smoke, navigation, analysis)

---

## Issues Found (by severity)

### Critical
1. **Broken HTML syntax** in `index.html` — `</a>a>`, `</div>div>`, `</header>h` at lines 60, 63, 87, 90
2. **Waitlist form non-functional** — hardcoded `YOUR_FORM_ID` placeholder, shows alert instead of submitting

### High
3. **Missing `#main-content` ID** — skip-to-content link targets non-existent anchor
4. **Monolithic app.js** — 1,160 lines of modal content data mixed with logic
5. **No `.gitignore`** — `node_modules/`, generated HTML, etc. not excluded
6. **Duplicate CSS rules** — mobile menu btn, form inputs defined twice
7. **Unused CSS with no implementation** — scroll progress indicator and back-to-top button have CSS but no HTML/JS
8. **Research nav inconsistency** — research header links to `/#documentation`, `/#roadmap`, `/#waitlist` which don't resolve properly
9. **No event listener cleanup** in app.js
10. **Build.js lacks error handling** for file write failures
11. **Research library index** (`/research/library/`) is an empty shell — no searchable catalog

### Medium
12. **Inconsistent CSS breakpoints** — 5 different sizes (968px, 868px, 768px, 640px, 568px)
13. **Header/footer inconsistency** between landing page and research pages (different taglines, different nav links)
14. **Hardcoded base URL** in build.js
15. **Inline rgba() colors** used 20+ times instead of CSS variables
16. **Missing meta tags** — `theme-color`, `referrer`, `og:locale`
17. **console.warn left in production** code
18. **Migration/documentation files cluttering root** directory

### Low
19. **Color contrast** for secondary text is AA but not AAA
20. **No i18n readiness**
21. **Modal content not internationalized**

---

## Implementation Approach

### Phase 1: Project Setup
Pull the existing codebase from the GitHub remote into this worktree. Set up `.gitignore`, install dependencies, verify the build works.

### Phase 2: Critical HTML Fixes
Fix the broken HTML syntax errors that affect parsing. Add missing accessibility anchors. These are small, surgical fixes.

### Phase 3: CSS Cleanup
Remove duplicate rules, unused selectors, standardize breakpoints, replace inline colors with CSS variables. This reduces file size and improves maintainability.

### Phase 4: JavaScript Refactoring
Extract modal content data from app.js into a separate JSON file loaded on demand. Clean up event listeners, remove console.warn, consolidate DOMContentLoaded handlers. Fix or remove the non-functional waitlist form.

### Phase 5: Navigation & Header Consistency
Align the research page header/footer with the landing page. Fix broken anchor links. Ensure consistent branding across all pages.

### Phase 6: Build System Hardening
Add error handling to build.js. Make base URL configurable. Add generated file validation.

### Phase 7: Feature Completion
Implement the scroll progress indicator (CSS exists, needs JS). Implement or remove the back-to-top button. Consider building out the research library index page.

### Phase 8: Testing & Verification
Run existing E2E tests. Add test coverage for modals, mobile menu, and form behavior. Validate all internal links.

---

## Source Code Changes

### Files to Modify
| File | Changes |
|------|---------|
| `index.html` | Fix HTML syntax errors (lines 60, 63, 87, 90), add `id="main-content"`, add missing meta tags, fix waitlist form |
| `app.js` | Extract modal content to separate file, consolidate DOMContentLoaded handlers, add event cleanup, remove console.warn, fix form handling |
| `styles.css` | Remove duplicate rules, remove unused selectors (or implement features), standardize breakpoints, extract inline colors to variables |
| `build.js` | Add try/catch error handling, make base URL configurable |
| `templates/partials/header.html` | Align nav links with landing page, fix broken anchors |
| `templates/partials/footer.html` | Align with landing page footer |
| `research/index.html` | Fix nav consistency |

### Files to Create
| File | Purpose |
|------|---------|
| `.gitignore` | Exclude node_modules, generated files, OS artifacts |
| `data/modal-content.json` | Extracted modal content data (from app.js) |

### Files to Remove / Relocate
| File | Action |
|------|--------|
| `.cargo-features-migration.md` | Remove or move to `_rpi/archive/` |
| `.fcip-removal-summary.md` | Remove or move to `_rpi/archive/` |

---

## Data Model / API / Interface Changes

No data model changes. The waitlist form needs a backend decision:
- **Option A**: Wire to Formspree (free tier, no backend needed)
- **Option B**: Wire to Mailchimp/ConvertKit/Buttondown API
- **Option C**: Remove/hide the form until a backend is ready

This requires user input.

---

## Verification Approach

1. **Build validation**: `npm run build` must complete without errors
2. **HTML validation**: Check fixed syntax with W3C validator or manual review
3. **Visual regression**: Compare before/after screenshots of key pages
4. **E2E tests**: Run `npx playwright test` — all existing tests must pass
5. **Link validation**: Verify all internal anchors and cross-page links resolve
6. **Mobile check**: Verify responsive layout at key breakpoints (640px, 768px, 1024px)
7. **Accessibility check**: Verify skip link works, focus states visible, ARIA attributes correct
8. **Performance check**: Confirm CSS/JS file sizes reduced after cleanup
