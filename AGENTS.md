# Repository Guidelines

## Project Structure & Module Organization
- This is a **Next.js 16** static site using the App Router with TypeScript and Tailwind CSS v4.
- `app/` contains all pages and layouts. The landing page is `app/page.tsx` with global styles in `app/globals.css`.
- `components/` holds reusable React components organized by feature: `layout/`, `landing/`, `research/`, `ui/`.
- `lib/` contains shared utilities: `content.ts` (static data), `research.ts` (markdown loading), `types.ts`, `utils.ts`, `rehype-md-links.ts`.
- Research content is Markdown under `research/`. Pages are generated at build time by Next.js from `app/research/[category]/[slug]/page.tsx`.
- `public/` contains static assets served at the site root (favicon, OG images).
- The build outputs to `out/` (static export). Do not edit files in `.next/` or `out/`.

## Build, Test, and Development Commands
- `npm run dev`: Start the Next.js development server.
- `npm run build`: Build the static site (runs `next build`, then `next-sitemap` via `postbuild`).
- `npm run start`: Serve the production build locally.
- `npm run lint`: Run ESLint via `next lint`.
- There is no separate test suite; use `npm run build` as the validation step.

## Coding Style & Naming Conventions
- Keep formatting consistent with existing files: 2-space indentation, single quotes in JS/TS.
- Use TypeScript for all new code. Interfaces live in `lib/types.ts`.
- Tailwind CSS v4 uses CSS-first configuration via `@theme` in `app/globals.css`. Do not create a `tailwind.config.ts`.
- Prefer descriptive component file names in kebab-case (e.g., `article-card.tsx`).

## Content & Template Workflow
- Every research article in `research/` must include YAML frontmatter with `title`, `description`, `category`, and `status`.
- Use `.md` links between research articles (a custom rehype plugin converts them to Next.js routes).
- Do not manually create HTML for research articles; add or edit the Markdown source files instead.
- Static data (SAM phases, CASCADE types, engines, roadmap) lives in `lib/content.ts`.

## Commit & Pull Request Guidelines
- Commit history uses Conventional Commits (`type: subject`). Example: `feat: add markdown build pipeline`.
- Keep subjects lowercase and under ~72 characters.
- PRs should include a concise summary, any commands run (`npm run build`), and screenshots for visible UI changes.
