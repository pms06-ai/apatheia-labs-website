# Technical Specification: Site Rebuild

## Technical Context

### Current Stack
- **Language**: Vanilla JavaScript (ES modules), HTML5, CSS3
- **Build**: Custom Node.js script (`build.js`) using `glob`, `gray-matter`, `marked`
- **Content**: ~61 markdown files across 15 research categories with YAML frontmatter
- **Landing page**: Single 1,442-line HTML file, 2,914-line CSS file, 1,417-line JS file
- **Modals**: 40+ content definitions in `MODAL_CONTENT` object (app.js) — methodology, engines, use cases, roadmap
- **Templates**: Handlebars-style `{{placeholder}}` substitution (article.html + partials)
- **Deployment**: GitHub Pages (static files)

### Target Stack
- **Framework**: Next.js 15 (App Router, static export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom theme
- **Content**: MDX/markdown pipeline via `next-mdx-remote` or `@next/mdx`
- **Fonts**: `next/font` (Inter, Playfair Display, JetBrains Mono)
- **Deployment**: Vercel (static export with `output: 'export'`)
- **Package manager**: npm

### Key Dependencies
| Package | Purpose |
|---------|---------|
| `next` (15.x) | Framework |
| `react`, `react-dom` (19.x) | UI runtime |
| `typescript` | Type safety |
| `tailwindcss` (v4) | Utility-first CSS |
| `gray-matter` | Frontmatter parsing (keep existing dep) |
| `next-mdx-remote` | Render markdown at build time with RSC support |
| `remark-gfm` | GitHub-flavored markdown tables, task lists |
| `rehype-slug` | Auto-generate heading IDs for TOC |
| `rehype-autolink-headings` | Clickable heading anchors |
| `lucide-react` | Icon library (replaces inline SVGs) |
| `next-sitemap` | Auto-generated sitemap.xml + robots.txt |

No other UI libraries. No state management library. No CSS-in-JS.

---

## Implementation Approach

### Guiding Principles

1. **Static-first**: Every page is statically generated at build time (`output: 'export'`). No server-side runtime.
2. **Component-per-section**: Each landing page section becomes its own React component. No component exceeds ~300 lines.
3. **Content as data**: Research markdown stays in `research/` and is read at build time via `fs` + `gray-matter`. Modal content (methodology, engines, use cases, roadmap) is extracted to structured TypeScript data files.
4. **Tailwind-only styling**: Zero custom CSS files. All styling via Tailwind utility classes + theme config.
5. **Progressive enhancement**: Core content works without JS. Interactive elements (search, mobile menu) enhance via client components.

### Architecture Overview

```
app/                          # Next.js App Router
  layout.tsx                  # Root layout (fonts, metadata, header, footer)
  page.tsx                    # Landing page (imports section components)
  not-found.tsx               # 404 page
  globals.css                 # Tailwind directives + minimal base styles
  about/
    page.tsx                  # About page (extracted from landing)
  methodology/
    page.tsx                  # S.A.M. overview
    sam/page.tsx              # S.A.M. four phases detail
    cascade/page.tsx          # CASCADE eight types detail
  engines/
    page.tsx                  # Engines overview
    [slug]/page.tsx           # Individual engine detail (6 pages)
  research/
    page.tsx                  # Research hub index (search, filter, browse)
    [category]/
      page.tsx                # Category listing
      [slug]/
        page.tsx              # Individual article

components/
  layout/
    header.tsx                # Fixed header with nav
    footer.tsx                # Site footer
    mobile-nav.tsx            # Mobile menu (client component)
  landing/
    hero.tsx                  # Hero section
    problem.tsx               # Problem section
    solution.tsx              # S.A.M. + CASCADE overview
    engines-grid.tsx          # Engines grid
    comparison.tsx            # Cost comparison
    research-preview.tsx      # Research hub teaser
    roadmap.tsx               # Roadmap section
    download.tsx              # Download CTA
  research/
    article-card.tsx          # Article card component
    category-card.tsx         # Category card component
    search-bar.tsx            # Client-side search (client component)
    filter-controls.tsx       # Category/status filters (client component)
    table-of-contents.tsx     # Sticky TOC sidebar (client component for scroll tracking)
    breadcrumbs.tsx           # Breadcrumb navigation
    article-meta.tsx          # Status/category/date badges
  ui/
    button.tsx                # Button variants
    badge.tsx                 # Status badges
    card.tsx                  # Card wrapper

lib/
  research.ts                 # Read/parse research markdown, build metadata
  content.ts                  # Static content data (methodology, engines, use cases, roadmap)
  types.ts                    # Shared TypeScript interfaces
  utils.ts                    # Utility functions (reading time, slug generation)

research/                     # Existing markdown files (unchanged)
  cognitive-science/
  communication/
  ...

public/
  favicon.ico                 # Existing asset
  og-image.png                # Existing asset
  og-image.svg                # Existing asset
```

---

## Source Code Structure Changes

### Files Removed (from repo)
All items listed in the requirements "Files to Remove" section:
- `src/`, `src-tauri/` — Tauri desktop app
- `e2e/`, `playwright.config.ts` — E2E tests
- `scripts/` — Old utility scripts
- `build.js` — Replaced by Next.js
- `templates/` — Replaced by React components
- `index.html` — Replaced by `app/page.tsx`
- `styles.css` — Replaced by Tailwind
- `app.js` — Content extracted to `lib/content.ts`, interactivity to React components
- `404.html` — Replaced by `app/not-found.tsx`
- `sitemap.xml` — Auto-generated by `next-sitemap`
- `robots.txt` — Generated by Next.js config
- `research/metadata.json` — Built by `lib/research.ts` at build time
- `research/**/index.html` — Generated by Next.js
- `research/article.css`, `research/hub.css` — Replaced by Tailwind
- `research/index.html` — Replaced by `app/research/page.tsx`
- `FEATURES.md`, `.cargo-features-migration.md` — Rust-specific docs

### Files Preserved (unchanged)
- `research/**/*.md` — All source markdown files
- `AGENTS.md` — Updated for new structure

### Files Created
- `package.json` — New with Next.js dependencies
- `tsconfig.json` — TypeScript configuration
- `next.config.ts` — Next.js configuration (static export, MDX, redirects)
- `tailwind.config.ts` — Theme with bronze/charcoal palette, typography
- `postcss.config.mjs` — PostCSS for Tailwind
- All files in `app/`, `components/`, `lib/`, `public/`

---

## Data Model

### Research Article (TypeScript Interface)

```typescript
interface ArticleFrontmatter {
  title: string;
  description: string;
  category: string;
  status: 'complete' | 'draft' | 'in-progress' | 'planned';
  date?: string;         // ISO date string
  tags?: string[];
}

interface Article {
  slug: string;          // e.g., '01-cognitive-biases'
  category: string;      // e.g., 'cognitive-science'
  categoryLabel: string; // e.g., 'Cognitive Science'
  frontmatter: ArticleFrontmatter;
  content: string;       // Raw markdown body
  readingTime: number;   // Estimated minutes
  filePath: string;      // Relative path to source .md
}

interface Category {
  slug: string;          // e.g., 'cognitive-science'
  label: string;         // e.g., 'Cognitive Science'
  description: string;   // From README.md frontmatter or first paragraph
  articleCount: number;
}
```

### Static Content Data (lib/content.ts)

Modal content from `app.js` `MODAL_CONTENT` is restructured into typed TypeScript objects:

```typescript
interface SAMPhase {
  id: string;
  name: string;
  subtitle: string;
  overview: string;
  methodology: string[];
  caseExample: { label: string; text: string };
  inputs: string[];
  outputs: string[];
}

interface CASCADEType {
  id: string;
  name: string;
  description: string;
  example: string;
  indicators: string[];
}

interface AnalysisEngine {
  slug: string;
  name: string;
  subtitle: string;
  overview: string;
  capabilities: string[];
  methodology: string[];
  inputs: string[];
  outputs: string[];
}

// Similar types for use cases, roadmap items
```

---

## Routing & URL Structure

| URL Pattern | Page | Data Source |
|-------------|------|-------------|
| `/` | Landing page | Static content |
| `/about` | About page | `lib/content.ts` |
| `/methodology` | S.A.M. overview | `lib/content.ts` |
| `/methodology/sam` | S.A.M. phases detail | `lib/content.ts` |
| `/methodology/cascade` | CASCADE types detail | `lib/content.ts` |
| `/engines` | Engines overview | `lib/content.ts` |
| `/engines/[slug]` | Engine detail | `lib/content.ts` |
| `/research` | Research hub index | `lib/research.ts` |
| `/research/[category]` | Category listing | `lib/research.ts` |
| `/research/[category]/[slug]` | Article page | Markdown file |

### Redirects (in next.config.ts)

Old GitHub Pages URLs used trailing slashes and generated `index.html` inside directories. Next.js static export produces the same structure, so URLs remain compatible. Add explicit redirects only if path structure changes (e.g., if an article filename changes).

Cross-article markdown links (e.g., `../methodologies/05-intelligence-analysis.md`) are transformed during markdown rendering to Next.js routes (`/research/methodologies/05-intelligence-analysis`).

---

## Content Pipeline (lib/research.ts)

### Build-Time Data Flow

```
research/**/*.md
    ↓ glob + fs.readFileSync
    ↓ gray-matter (parse frontmatter)
    ↓ Build article index (all metadata)
    ↓ Group by category
    ↓ Sort by filename (preserves numeric ordering)
    → Used by generateStaticParams() for SSG
    → Used by page components for listing/filtering
```

### Markdown Rendering Pipeline

```
Article markdown body
    ↓ next-mdx-remote (serialize → MDXRemote)
    ↓ remark-gfm (tables, task lists, strikethrough)
    ↓ rehype-slug (heading IDs)
    ↓ rehype-autolink-headings (clickable anchors)
    ↓ Custom rehype plugin: transform .md links to Next.js routes
    → React component tree
```

### Key Functions

```typescript
// lib/research.ts

/** Get all articles with parsed frontmatter (cached per build) */
function getAllArticles(): Article[]

/** Get articles filtered by category slug */
function getArticlesByCategory(category: string): Article[]

/** Get a single article by category + slug */
function getArticle(category: string, slug: string): Article | null

/** Get all categories with metadata and counts */
function getCategories(): Category[]

/** Extract headings from markdown for TOC generation */
function extractHeadings(markdown: string): Heading[]

/** Generate static params for dynamic routes */
function generateArticleParams(): { category: string; slug: string }[]
function generateCategoryParams(): { category: string }[]
```

---

## Tailwind Theme Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bronze: {
          400: '#e3aa3f',
          500: '#d4a017',
          600: '#b8860b',
          700: '#9a6a0a',
          900: '#674514',
        },
        charcoal: {
          50:  '#f5f5f5',
          100: '#e8e8e8',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#363636',
          850: '#242424',
          900: '#0f0f10',
        },
        status: {
          critical: '#c94a4a',
          high:     '#d4a017',
          medium:   '#8b7355',
          info:     '#5b8a9a',
          success:  '#4a9a6a',
        },
      },
      fontFamily: {
        sans:  ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        mono:  ['var(--font-jetbrains)', 'monospace'],
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
};
```

Fonts loaded via `next/font/google` in `app/layout.tsx` and applied as CSS variables.

---

## Component Specifications

### Server vs Client Components

| Component | Type | Reason |
|-----------|------|--------|
| `layout.tsx` | Server | Static shell |
| `header.tsx` | Server | Static content |
| `mobile-nav.tsx` | Client | Toggle state, event listeners |
| `footer.tsx` | Server | Static content |
| All landing sections | Server | Static content, no interactivity |
| `search-bar.tsx` | Client | User input, filtering |
| `filter-controls.tsx` | Client | User interaction |
| `table-of-contents.tsx` | Client | Scroll position tracking, active heading |
| `article-card.tsx` | Server | Static rendering |
| `breadcrumbs.tsx` | Server | Static from route params |

### Landing Page Sections → Components Mapping

| Current HTML Section | Component File | Content Source |
|---------------------|----------------|----------------|
| Hero | `components/landing/hero.tsx` | Inline JSX |
| About | `components/landing/problem.tsx` | Inline JSX (condensed) |
| Problem | `components/landing/problem.tsx` | Inline JSX |
| Comparison | `components/landing/comparison.tsx` | Inline JSX |
| S.A.M. Methodology | `components/landing/solution.tsx` | Links to `/methodology` |
| CASCADE Types | `components/landing/solution.tsx` | Links to `/methodology/cascade` |
| Analysis Engines | `components/landing/engines-grid.tsx` | `lib/content.ts` → links to `/engines/[slug]` |
| Use Cases | Removed from landing, content in `/about` | — |
| Roadmap | `components/landing/roadmap.tsx` | `lib/content.ts` |
| Stats | Merged into hero or problem | — |
| Research | `components/landing/research-preview.tsx` | `lib/research.ts` → category counts |
| Documentation | Merged into research preview | — |
| Download / CTA | `components/landing/download.tsx` | Inline JSX |
| Waitlist | Removed (merged into download) | — |

---

## SEO Implementation

### Next.js Metadata API

Each page exports a `metadata` or `generateMetadata()` function:

```typescript
// app/layout.tsx — default metadata
export const metadata: Metadata = {
  title: {
    default: 'Phronesis — Forensic Document Analysis',
    template: '%s | Phronesis',
  },
  description: 'Free forensic document analysis...',
  openGraph: { ... },
  twitter: { card: 'summary_large_image' },
};

// app/research/[category]/[slug]/page.tsx — dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const article = getArticle(params.category, params.slug);
  return {
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    openGraph: { ... },
  };
}
```

### Sitemap & Robots

`next-sitemap` configured in `next-sitemap.config.js`:
- Base URL: `https://apatheialabs.com`
- Auto-discovers all static pages
- Generates `sitemap.xml` and `robots.txt` in post-build step

### Structured Data

JSON-LD injected via `<script type="application/ld+json">` in layout or per-page:
- Landing page: `SoftwareApplication` schema
- Research articles: `Article` schema with author, datePublished, description

---

## Delivery Phases

### Phase 1: Project Scaffold & Theme
- Initialize Next.js project with TypeScript
- Configure Tailwind with bronze/charcoal theme
- Set up fonts via `next/font`
- Create root layout with header/footer components
- Create 404 page
- Configure static export in `next.config.ts`
- Set up `.gitignore` for Next.js
- **Verification**: `npm run build` succeeds, site renders with correct fonts and colors

### Phase 2: Landing Page
- Build all landing page section components
- Extract modal content to `lib/content.ts` typed data
- Implement responsive mobile navigation
- Wire up smooth scroll and section navigation
- **Verification**: Landing page renders all sections, mobile nav works, no content lost

### Phase 3: Detail Pages (Methodology, Engines, About)
- Create `/about`, `/methodology/*`, `/engines/*` pages
- Source content from `lib/content.ts`
- Implement consistent layout with breadcrumbs
- **Verification**: All detail pages render with correct content from old modals

### Phase 4: Research Pipeline
- Implement `lib/research.ts` (markdown reading, frontmatter parsing, article indexing)
- Build research hub index with category cards
- Build category listing pages
- Build article pages with MDX rendering, TOC, breadcrumbs, prev/next nav
- Implement markdown link transformation (`.md` → Next.js routes)
- **Verification**: All ~61 articles render correctly, cross-links work, TOC generates from headings

### Phase 5: Research Interactivity
- Client-side search across article titles, descriptions, tags
- Category and status filtering
- Sorting (date, title, category)
- Scroll-tracking TOC with active heading highlight
- **Verification**: Search returns relevant results, filters narrow correctly, TOC tracks scroll

### Phase 6: SEO, Performance & Cleanup
- Add metadata to all pages (title, description, OG, Twitter)
- Configure `next-sitemap` for sitemap + robots
- Add JSON-LD structured data
- Optimize images via `next/image`
- Remove old files (src/, src-tauri/, build.js, templates/, etc.)
- Update `AGENTS.md` for new project structure
- Update `package.json` name/scripts
- **Verification**: `npm run build` succeeds, Lighthouse scores meet targets (Performance >90, Accessibility >95, SEO >95)

---

## Verification Approach

### Per-Phase Checks
- `npm run build` must succeed with zero errors after each phase
- `npx tsc --noEmit` for type checking
- Manual visual review of rendered pages
- Cross-link verification for research articles

### Final Validation
1. **Build**: `npm run build` produces static export with no errors
2. **Type safety**: `npx tsc --noEmit` passes
3. **Lint**: `npx next lint` passes
4. **Content parity**: All research articles render, all landing page content preserved
5. **Responsive**: Test at 375px, 768px, 1024px, 1440px widths
6. **Links**: No broken internal links (all markdown cross-references resolve)
7. **Performance**: Lighthouse audit on built output
