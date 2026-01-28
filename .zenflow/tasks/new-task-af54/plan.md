# Full SDD workflow

## Configuration
- **Artifacts Path**: {@artifacts_path} → `.zenflow/tasks/{task_id}`

---

## Workflow Steps

### [x] Step: Requirements
<!-- chat-id: 51ae43bb-7547-47de-87dd-16e4cd9c4d6b -->

Create a Product Requirements Document (PRD) based on the feature description.

1. Review existing codebase to understand current architecture and patterns
2. Analyze the feature definition and identify unclear aspects
3. Ask the user for clarifications on aspects that significantly impact scope or user experience
4. Make reasonable decisions for minor details based on context and conventions
5. If user can't clarify, make a decision, state the assumption, and continue

Save the PRD to `{@artifacts_path}/requirements.md`.

### [x] Step: Technical Specification
<!-- chat-id: 9f6b581a-1dc4-4758-84b5-33879dbca817 -->

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
<!-- chat-id: 05812f8b-7fb6-4dfa-baef-6c8c203d874c -->

Create a detailed implementation plan based on `{@artifacts_path}/spec.md`.

1. Break down the work into concrete tasks
2. Each task should reference relevant contracts and include verification steps
3. Replace the Implementation step below with the planned tasks

Save to `{@artifacts_path}/plan.md`.

### [x] Step: Project scaffold and Tailwind theme
<!-- chat-id: 85c8f339-f634-4a6c-a013-3d55bbc49886 -->

Initialize Next.js 15 project with TypeScript and configure Tailwind CSS with the bronze/charcoal theme.

**Tasks:**
- [x] Ensure `.gitignore` includes `node_modules/`, `.next/`, `out/`, `dist/`, `*.log`, `.env*`
- [x] Initialize Next.js 16 project with TypeScript (App Router) in the repo root
- [x] Install dependencies: `tailwindcss` v4, `@tailwindcss/postcss`, `gray-matter`, `lucide-react`, `next-mdx-remote`, `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, `next-sitemap`, `eslint`, `eslint-config-next`
- [x] Configure Tailwind v4 CSS-first theme via `@theme` directive in `app/globals.css` with bronze/charcoal color palette, font families (Inter, Playfair Display, JetBrains Mono via `next/font`), and container-content: 1200px
- [x] Configure `postcss.config.mjs` with `@tailwindcss/postcss` plugin
- [x] Configure `next.config.ts` with `output: 'export'` for static generation
- [x] Create `app/globals.css` with Tailwind directives and minimal base styles (dark background, font smoothing)
- [x] Create `app/layout.tsx` with root metadata (title template `'%s | Phronesis'`, description, OG defaults), font loading via `next/font/google`, and CSS variable application
- [x] Create placeholder `app/page.tsx` that renders "Phronesis" heading
- [x] Create `app/not-found.tsx` with branded 404 page
- [x] Create `lib/types.ts` with shared TypeScript interfaces: `ArticleFrontmatter`, `Article`, `Category`, `SAMPhase`, `CASCADEType`, `AnalysisEngine` per spec data model
- [x] Copy static assets (favicon.ico, og-image.png, og-image.svg) to `public/`
- [x] Configure `tsconfig.json` with scoped includes (app/, components/, lib/) to avoid conflicts with legacy files

**Verification:**
- [x] `npm run build` succeeds
- [x] `npx tsc --noEmit` passes
- Dev server renders placeholder page with correct fonts and charcoal background

**Notes:**
- Installed Next.js 16.1.6 (latest stable, fully App Router compatible) instead of 15 as originally spec'd
- Tailwind v4 uses CSS-first configuration (`@theme` directive in globals.css + `@tailwindcss/postcss`) instead of `tailwind.config.ts`
- Renamed old `src/` to `_src_old/` to avoid `pages` directory conflict with App Router — will be fully removed in cleanup step
- `tsconfig.json` `include` scoped to new project dirs only to prevent old `.ts/.tsx` files from failing the build

### [x] Step: Layout components (header, footer, mobile nav)
<!-- chat-id: 91119f98-b3d6-4402-bff7-408a49a97b29 -->

Build the site-wide layout shell: fixed header with navigation, footer, and mobile-responsive menu.

**Tasks:**
- [x] Create `components/layout/header.tsx` — fixed header with logo text ("Phronesis" in Playfair Display), nav links (About, Methodology, Engines, Research, Roadmap, Download), and skip-to-content link
- [x] Create `components/layout/mobile-nav.tsx` — client component with hamburger toggle, slide-out menu, close on Escape/link click, focus trapping
- [x] Create `components/layout/footer.tsx` — site footer with copyright, nav links, Apatheia Labs branding
- [x] Wire header and footer into `app/layout.tsx`
- [x] Create `components/ui/button.tsx` — button component with primary (bronze gradient), secondary (outline), and ghost variants using Tailwind classes
- [x] Create `components/ui/badge.tsx` — status/category badge component with color variants matching status palette
- [x] Create `components/ui/card.tsx` — card wrapper with charcoal background, bronze border hover effect

**Verification:**
- [x] `npm run build` succeeds
- [x] `npx tsc --noEmit` passes
- Header renders with all nav links, footer renders
- Mobile nav opens/closes at `md` breakpoint
- Skip-to-content link present for accessibility

### [x] Step: Landing page sections
<!-- chat-id: c3a80549-dbea-4557-822b-535f191dafba -->

Build all landing page section components and wire them into the home page. Extract modal content from `app.js` to typed TypeScript data.

**Tasks:**
- [ ] Extract `MODAL_CONTENT` from existing `app.js` into `lib/content.ts` as typed TypeScript objects — SAM phases (4), CASCADE types (8), analysis engines (6), roadmap items (15+), use case data. Each export follows the interfaces from `lib/types.ts`
- [ ] Create `components/landing/hero.tsx` — headline "Find the contradictions they missed", benefit-oriented subtitle, two CTAs (primary action + learn more), simplified example card
- [ ] Create `components/landing/problem.tsx` — consolidated "why this exists" section with three concise pain point cards. Condense current about+problem sections
- [ ] Create `components/landing/solution.tsx` — S.A.M. methodology overview with four phase cards linking to `/methodology/sam`, CASCADE framework summary linking to `/methodology/cascade`
- [ ] Create `components/landing/engines-grid.tsx` — six analysis engine cards in responsive grid, each linking to `/engines/[slug]`. Data sourced from `lib/content.ts`
- [ ] Create `components/landing/comparison.tsx` — cost/value comparison table (enterprise tools vs free). Preserve existing data, format as scannable table/grid
- [ ] Create `components/landing/research-preview.tsx` — research hub teaser showing category cards with article counts (reads from `lib/research.ts` once implemented, hardcode counts temporarily)
- [ ] Create `components/landing/roadmap.tsx` — roadmap items as inline cards (no modals). Data from `lib/content.ts`
- [ ] Create `components/landing/download.tsx` — download CTA section with platform options
- [ ] Wire all sections into `app/page.tsx` in order: Hero → Problem → Solution → Engines → Comparison → Research Preview → Roadmap → Download
- [ ] Implement smooth-scroll navigation for section anchor links in header

**Verification:**
- `npm run build` succeeds
- Landing page renders all 8 sections with no content missing vs current site
- All section links from header scroll to correct targets
- Responsive layout works at mobile (375px), tablet (768px), desktop (1440px)
- No modals on landing page — all detail links point to `/methodology/*`, `/engines/*`, `/about`

### [ ] Step: Detail pages (methodology, engines, about)

Create standalone pages for content currently in modals: methodology, engine details, and about page.

**Tasks:**
- [ ] Create `app/about/page.tsx` — creator story and mission (extracted from current about section). Export metadata with title/description
- [ ] Create `app/methodology/page.tsx` — S.A.M. framework overview page with links to sub-pages. Export metadata
- [ ] Create `app/methodology/sam/page.tsx` — four S.A.M. phases in detail (ANCHOR, INHERIT, COMPOUND, ARRIVE). Content from `lib/content.ts` SAM phases data
- [ ] Create `app/methodology/cascade/page.tsx` — eight CASCADE contradiction types. Content from `lib/content.ts` CASCADE types data
- [ ] Create `app/engines/page.tsx` — analysis engines overview with grid linking to individual engine pages. Export metadata
- [ ] Create `app/engines/[slug]/page.tsx` — individual engine detail page with `generateStaticParams()` returning 6 engine slugs: entity-resolution, temporal-parser, argumentation, contradiction, bias, accountability. Content from `lib/content.ts`
- [ ] Create `components/research/breadcrumbs.tsx` — breadcrumb navigation component accepting path segments
- [ ] Add breadcrumbs to all detail pages (About, Methodology/*, Engines/*)
- [ ] Ensure all detail pages export `generateMetadata()` for SEO

**Verification:**
- `npm run build` succeeds with all detail pages statically generated
- All 10 detail page routes render: `/about`, `/methodology`, `/methodology/sam`, `/methodology/cascade`, `/engines`, `/engines/entity-resolution` (and 5 others)
- Content matches existing `MODAL_CONTENT` from `app.js` — no information lost
- Breadcrumbs display correctly on all detail pages

### [ ] Step: Research content pipeline

Implement the markdown reading pipeline and build research hub pages (index, category listing, article rendering).

**Tasks:**
- [ ] Create `lib/research.ts` implementing all key functions from spec:
  - `getAllArticles()` — glob `research/**/*.md` (exclude README.md), parse with `gray-matter`, compute reading time, return sorted `Article[]`
  - `getArticlesByCategory(category)` — filter articles by category slug
  - `getArticle(category, slug)` — get single article by category + slug
  - `getCategories()` — aggregate unique categories with labels, descriptions (from category README.md first paragraph), and article counts
  - `extractHeadings(markdown)` — parse h2/h3 for TOC generation
  - `generateArticleParams()` / `generateCategoryParams()` — for `generateStaticParams()`
- [ ] Create `lib/utils.ts` — reading time calculator (words / 200 wpm), slug utilities
- [ ] Create custom rehype plugin in `lib/rehype-md-links.ts` to transform `.md` cross-article links (e.g., `../methodologies/05-intelligence-analysis.md`) to Next.js routes (`/research/methodologies/05-intelligence-analysis`)
- [ ] Create `components/research/article-card.tsx` — card with title, description, category badge, status indicator, date, reading time
- [ ] Create `components/research/category-card.tsx` — card with category name, description, article count
- [ ] Create `components/research/article-meta.tsx` — status/category/date/reading-time badge row
- [ ] Create `app/research/page.tsx` — research hub index with category grid showing all 17 categories with article counts. Export metadata
- [ ] Create `app/research/[category]/page.tsx` — category listing with all articles for that category, category description at top, breadcrumbs. `generateStaticParams()` from `generateCategoryParams()`
- [ ] Create `app/research/[category]/[slug]/page.tsx` — individual article page:
  - Render markdown body via `next-mdx-remote` with `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, custom md-link transformer
  - Breadcrumbs (Home > Research > Category > Article)
  - Article meta badges (category, status, date, reading time)
  - GitHub source link to `.md` file
  - Prev/next navigation within same category
  - `generateStaticParams()` from `generateArticleParams()`
  - `generateMetadata()` with article title and description
- [ ] Create `components/research/table-of-contents.tsx` — sticky sidebar TOC generated from headings, collapses to top on mobile. Client component for scroll-tracking active heading highlight

**Verification:**
- `npm run build` succeeds — all ~61 articles generate as static pages
- Each article renders correctly with markdown formatting (tables, code blocks, lists)
- Cross-article `.md` links resolve to correct Next.js routes (no 404s)
- TOC generates from headings and displays as sticky sidebar
- Category pages list correct articles
- Hub index shows all 17 categories with accurate article counts
- Breadcrumbs display correctly at all levels

### [ ] Step: Research hub interactivity

Add client-side search, filtering, and sorting to the research hub.

**Tasks:**
- [ ] Create `components/research/search-bar.tsx` — client component with text input, searches across article titles, descriptions, and tags. Debounced input updates results
- [ ] Create `components/research/filter-controls.tsx` — client component with category dropdown (17 categories), status filter (complete/draft/in-progress/planned), tag filter. URL search params for shareable filter state
- [ ] Add sorting controls to hub page — sort by date, title, or category
- [ ] Update `app/research/page.tsx` to pass all article metadata as serialized JSON to client components for filtering/searching (data loaded at build time, interactivity client-side)
- [ ] Wire scroll-tracking into `table-of-contents.tsx` — IntersectionObserver on headings, highlight active heading in TOC

**Verification:**
- `npm run build` succeeds
- Search returns relevant results when typing article titles or keywords
- Category filter narrows to selected category
- Status filter shows only articles with matching status
- Sorting reorders articles correctly
- TOC highlights current section while scrolling through articles
- All interactivity works with JS enabled; content still visible without JS (SSG)

### [ ] Step: SEO, performance, and cleanup

Add metadata, sitemap, structured data. Remove old files. Update project configuration.

**Tasks:**
- [ ] Ensure all pages export `metadata` or `generateMetadata()` with title, description, OpenGraph, and Twitter card properties
- [ ] Configure `next-sitemap` in `next-sitemap.config.js` — base URL `https://apatheialabs.com`, auto-discover all static pages
- [ ] Add JSON-LD structured data: `SoftwareApplication` schema on landing page, `Article` schema on research article pages
- [ ] Add `robots.txt` generation via Next.js config or `next-sitemap`
- [ ] Replace any `<img>` with `next/image` for optimization where applicable
- [ ] Update the research-preview section on landing page to use real data from `lib/research.ts` (replace any hardcoded counts from step 3)
- [ ] Remove old files from repo:
  - `index.html`, `styles.css`, `app.js` — replaced by Next.js
  - `build.js`, `templates/` — replaced by Next.js build
  - `404.html` — replaced by `app/not-found.tsx`
  - `sitemap.xml`, `robots.txt` — auto-generated
  - `research/metadata.json`, `research/**/index.html`, `research/article.css`, `research/hub.css`, `research/index.html` — generated files
  - `src/`, `src-tauri/` — Tauri desktop app (removed per requirements)
  - `e2e/`, `playwright.config.ts` — E2E tests (rebuild later)
  - `scripts/` — old utility scripts
  - `FEATURES.md`, `.cargo-features-migration.md` — Rust-specific docs
- [ ] Update `AGENTS.md` to reflect new Next.js project structure, build commands (`npm run build` → `next build`), and file conventions
- [ ] Update `package.json` — ensure scripts include `dev`, `build`, `start`, `lint`, `postbuild` (for next-sitemap)
- [ ] Verify `.gitignore` covers `.next/`, `out/`, `node_modules/`

**Verification:**
- `npm run build` succeeds with zero errors
- `npx tsc --noEmit` passes with no type errors
- `npx next lint` passes
- Sitemap generated at `out/sitemap.xml` with all pages
- `robots.txt` generated
- No old files remain in working tree (index.html, styles.css, app.js, build.js, templates/, src/, src-tauri/, etc.)
- All research articles still render correctly after cleanup
- Landing page content is complete — no sections lost
