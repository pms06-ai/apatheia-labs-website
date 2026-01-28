# Product Requirements Document: Site Rebuild

## Overview

Rebuild the Phronesis / Apatheia Labs website from vanilla HTML/CSS/JS to a Next.js application with Tailwind CSS, deployed on Vercel. The rebuild covers the landing page and research hub. The Tauri desktop app code (src/, src-tauri/) is removed from the project.

## Goals

1. **Modernize the stack** — Move from hand-rolled HTML/CSS/JS + custom Node.js build script to Next.js with Tailwind CSS and Vercel deployment.
2. **Simplify the codebase** — Replace 83 KB of monolithic HTML, 51 KB of CSS, and 62 KB of JS with componentized, maintainable code.
3. **Improve the landing page content** — Restructure and tighten copy for clearer narrative flow and stronger conversion.
4. **Improve the research hub** — Better navigation, search, filtering, and reading experience for 100+ articles across 12 domains.
5. **Preserve the brand** — Keep the metallic bronze/gold + charcoal visual identity.
6. **Remove desktop app code** — Strip Tauri/Rust/React desktop application source from the repo.

## Non-Goals

- Rewriting the research article markdown content itself (content preserved as-is)
- Building a CMS or admin interface
- Adding authentication or user accounts
- Rebuilding the Tauri desktop application in a different framework

---

## Scope

### In Scope

| Area | Current State | Target State |
|------|---------------|--------------|
| Framework | Vanilla HTML/JS | Next.js (App Router) |
| Styling | Hand-written CSS (51 KB) | Tailwind CSS with metallic theme config |
| Landing page | Single 1,442-line HTML file | Componentized Next.js pages with improved content |
| Research hub | Custom build.js pipeline | Next.js MDX/markdown pipeline with improved UX |
| Deployment | GitHub Pages | Vercel |
| Build system | Custom Node.js script (build.js) | Next.js built-in + MDX tooling |
| Desktop app | Tauri/Rust/React in src/, src-tauri/ | Removed |
| SEO | Manual meta tags, sitemap.xml | Next.js metadata API, auto-generated sitemap |

### Out of Scope

- Tauri desktop application
- E2E test suite (playwright config, e2e/ directory) — can be re-added later
- _rpi/ archive directory content
- Cargo/Rust configuration files

---

## Functional Requirements

### FR-1: Landing Page

#### FR-1.1: Page Structure

Restructure the landing page from the current 10+ sections into a tighter narrative:

| Section | Purpose | Notes |
|---------|---------|-------|
| **Hero** | Value proposition + primary CTA | Keep "Find the contradictions they missed." Simplify the example card. Two CTAs: primary action + learn more. |
| **Problem** | Why this tool exists | Consolidate current "about" and "problem" sections. Three concise pain points. |
| **Solution** | What Phronesis does | Overview of S.A.M. methodology and CASCADE framework. Currently spread across multiple verbose sections — unify into a single clear explanation. |
| **Engines** | Analysis capabilities | Six analysis engines presented as a grid. Click-through to detail pages instead of inline modals. |
| **Comparison** | Cost/value positioning | Keep the pricing comparison (enterprise tools vs. free). Make it scannable. |
| **Research** | Knowledge base preview | Highlight research hub with category cards and featured articles. Currently missing from landing page. |
| **Roadmap** | What's coming | Keep but simplify. Remove modal popups, use inline cards. |
| **CTA / Download** | Conversion | Clear download section with platform options. |

**Content improvements:**
- Current hero subtitle is generic ("Free forensic document analysis"). Replace with benefit-oriented copy.
- Current "about" section tells the creator's personal story at length. Move to a separate /about page; keep a brief version on landing.
- Current methodology sections use heavy jargon (ANCHOR, INHERIT, COMPOUND, ARRIVE). Add plain-language explanations alongside technical terms.
- Current cost comparison is effective — preserve but tighten formatting.
- Remove inline SVG icons from HTML. Use a proper icon solution (lucide-react or similar).

#### FR-1.2: Interactivity

- **No modal system on the landing page.** Replace all modals with dedicated detail pages (e.g., /methodology/sam, /engines/entity-resolution). This eliminates the 62 KB app.js modal controller.
- **Smooth scroll navigation** between landing page sections.
- **Mobile-responsive navigation** with proper Next.js patterns (no custom hamburger JS).
- **Scroll progress indicator** — preserve if lightweight, otherwise drop.

#### FR-1.3: Navigation

- Fixed header with logo + nav links.
- Links: About, Methodology, Engines, Research, Roadmap, Download.
- Mobile: collapsible menu.
- Active link highlighting.

### FR-2: Research Hub

#### FR-2.1: Hub Index Page (/research)

- **Category grid** — 12 research domains displayed as navigable cards with article counts.
- **Search** — Client-side full-text search across article titles, descriptions, and tags.
- **Filtering** — Filter by category, status (complete/draft/in-progress), and tags.
- **Sorting** — By date, title, or category.
- **Article cards** — Title, description, category badge, status indicator, date.

#### FR-2.2: Category Pages (/research/[category])

- List all articles in a category with descriptions.
- Breadcrumb navigation: Home > Research > Category.
- Category description/overview at the top.

#### FR-2.3: Article Pages (/research/[category]/[slug])

- Rendered from existing markdown files with frontmatter.
- **Table of contents** — Sticky sidebar TOC generated from headings (h2, h3).
- **Breadcrumbs** — Home > Research > Category > Article.
- **Meta badges** — Category, status, date, tags.
- **Cross-article links** — Markdown links between articles resolve correctly.
- **GitHub source link** — Link to source .md file on GitHub.
- **Prev/Next navigation** — Navigate between articles in same category.
- **Reading time estimate** — Based on word count.
- **Responsive layout** — TOC collapses to top on mobile, expands as sidebar on desktop.

#### FR-2.4: Content Pipeline

- Source markdown files remain in `research/` directory structure.
- Frontmatter schema: `title`, `description`, `category`, `status`, `date`, `tags`.
- Next.js processes markdown at build time (static generation).
- Cross-article `.md` links converted to Next.js routes.
- Generated metadata.json replaced by Next.js data layer.

### FR-3: Detail Pages (New)

Create standalone pages for content currently trapped in modals:

| Page | Content Source |
|------|---------------|
| /methodology | S.A.M. framework overview |
| /methodology/sam | Four phases: Anchor, Inherit, Compound, Arrive |
| /methodology/cascade | Eight contradiction types |
| /engines | Analysis engines overview |
| /engines/[engine-slug] | Individual engine detail (6 pages) |
| /about | Creator story, mission, team |

Content sourced from current `MODAL_CONTENT` object in app.js.

### FR-4: SEO

- **Next.js Metadata API** for all pages (title, description, OpenGraph, Twitter cards).
- **Auto-generated sitemap** via next-sitemap or built-in.
- **Schema.org structured data** for SoftwareApplication (landing page) and Article (research pages).
- **robots.txt** generated by Next.js.
- **Canonical URLs** on all pages.
- **OpenGraph images** — preserve existing og-image.png or generate dynamic OG images.

### FR-5: Performance

- **Static generation (SSG)** for all pages — no server-side rendering needed.
- **Image optimization** via Next.js Image component.
- **Font optimization** via next/font (Inter, Playfair Display, JetBrains Mono).
- **Code splitting** — automatic via Next.js App Router.
- **Target Core Web Vitals:** LCP < 2.5s, FID < 100ms, CLS < 0.1.

---

## Non-Functional Requirements

### NFR-1: Visual Identity (Metallic Theme)

Preserve the existing bronze/gold + charcoal palette in Tailwind config:

```
Bronze/Gold:
  bronze-400: #e3aa3f
  bronze-500: #d4a017
  bronze-600: #b8860b
  bronze-700: #9a6a0a
  bronze-900: #674514

Charcoal:
  charcoal-50:  #f5f5f5
  charcoal-100: #e8e8e8
  charcoal-200: #d1d1d1
  charcoal-300: #b0b0b0
  charcoal-400: #888888
  charcoal-500: #6d6d6d
  charcoal-600: #5d5d5d
  charcoal-700: #4f4f4f
  charcoal-800: #363636
  charcoal-850: #242424
  charcoal-900: #0f0f10

Status colors:
  critical: #c94a4a
  high:     #d4a017
  medium:   #8b7355
  info:     #5b8a9a
  success:  #4a9a6a
```

Typography:
- Headings: Playfair Display (serif)
- Body: Inter (sans-serif)
- Code: JetBrains Mono (monospace)

Visual character:
- Dark backgrounds with bronze/gold accents
- Subtle gradients and metallic effects on cards/buttons
- Professional, forensic tool aesthetic — not flashy startup

### NFR-2: Accessibility

- WCAG 2.1 AA compliance.
- Semantic HTML throughout.
- Keyboard navigation for all interactive elements.
- Skip-to-content link.
- ARIA labels where semantic HTML is insufficient.
- Color contrast ratios meeting AA standards.
- Focus-visible styles.

### NFR-3: Responsive Design

- Mobile-first approach.
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px).
- Navigation collapses on mobile.
- Research TOC repositions on mobile.
- Cards reflow to single column on small screens.

### NFR-4: Deployment

- **Platform:** Vercel.
- **Build command:** `next build`.
- **Output:** Static export where possible; Vercel edge functions if needed.
- **Domain:** apatheialabs.com (DNS updated to point to Vercel).
- **Preview deployments:** Automatic per branch/PR.
- **Analytics:** Vercel Analytics or Plausible (privacy-focused).

---

## Technical Constraints

1. **Markdown compatibility** — Existing research .md files must work without modification. Frontmatter schema stays the same.
2. **URL structure** — Research article URLs should follow `/research/[category]/[slug]` pattern. Redirects from old URLs if structure changes.
3. **No runtime database** — All content is static, processed at build time.
4. **Minimal dependencies** — Prefer Next.js built-in features over third-party libraries. Only add dependencies that provide clear value.

---

## Files to Remove

The following are removed as part of this rebuild:

| Path | Reason |
|------|--------|
| `src/` | Tauri React frontend — desktop app removed |
| `src-tauri/` | Tauri Rust backend — desktop app removed |
| `e2e/` | Playwright E2E tests tied to old app — rebuild later |
| `scripts/` | Old utility scripts |
| `playwright.config.ts` | E2E config for old app |
| `FEATURES.md` | Cargo feature documentation |
| `.cargo-features-migration.md` | Rust migration notes |
| `build.js` | Replaced by Next.js build pipeline |
| `templates/` | Replaced by Next.js components |
| `research/metadata.json` | Replaced by Next.js data layer |
| `research/**/index.html` | Generated files replaced by Next.js |
| `research/article.css` | Replaced by Tailwind |
| `research/hub.css` | Replaced by Tailwind |
| `sitemap.xml` | Auto-generated by Next.js |
| `404.html` | Replaced by Next.js not-found page |

## Files to Preserve

| Path | Reason |
|------|--------|
| `research/**/*.md` | Source content — untouched |
| `public/favicon.ico` | Brand asset (moved to public/) |
| `public/og-image.png` | Social preview image (moved to public/) |
| `public/og-image.svg` | Social preview source (moved to public/) |
| `robots.txt` | Migrated to Next.js config |
| `AGENTS.md` | Repo guidelines — updated for new structure |
| `.gitignore` | Updated for Next.js |

---

## Assumptions

1. The Vercel free tier or Pro plan is available for deployment.
2. The domain apatheialabs.com can be pointed to Vercel.
3. Google Fonts (Inter, Playfair Display, JetBrains Mono) remain the typography choice — loaded via next/font.
4. The current modal content in app.js is the canonical source for methodology/engine detail pages.
5. Research article markdown files require no content changes — only the rendering pipeline changes.
6. Plausible Analytics (or Vercel Analytics) replaces any existing analytics.

---

## Success Criteria

1. All existing research articles render correctly at their new URLs.
2. Landing page loads with LCP < 2.5s on mobile 4G.
3. Lighthouse scores: Performance > 90, Accessibility > 95, SEO > 95.
4. Site deploys to Vercel with automatic preview deployments on PRs.
5. Codebase is componentized — no file exceeds ~300 lines.
6. Total custom CSS near zero (Tailwind handles styling).
7. All landing page content is preserved or improved — nothing lost.
8. Mobile experience is polished — not just responsive but designed for touch.
