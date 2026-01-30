import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getCategories, getAllArticles } from '@/lib/research';
import { CategoryCard } from '@/components/research/category-card';
import { Breadcrumbs } from '@/components/research/breadcrumbs';
import {
  ResearchHubInteractive,
  type ArticleSummary,
} from '@/components/research/research-hub-interactive';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Research Hub',
  description:
    'Open research spanning investigation methodologies, cognitive science, ethics, legal frameworks, and forensic analysis foundations.',
};

export default function ResearchHubPage() {
  const categories = getCategories();
  const articles = getAllArticles();

  // Serialize articles for the client — exclude raw markdown content
  const articleSummaries: ArticleSummary[] = articles.map((a) => ({
    slug: a.slug,
    category: a.category,
    categoryLabel: a.categoryLabel,
    title: a.frontmatter.title,
    description: a.frontmatter.description,
    status: a.frontmatter.status,
    date: a.frontmatter.date,
    tags: a.frontmatter.tags,
    readingTime: a.readingTime,
  }));

  const categoryOptions = categories.map((c) => ({
    slug: c.slug,
    label: c.label,
  }));

  return (
    <div className="relative">
      {/* Hero section */}
      <div className="relative py-24 overflow-hidden">
        {/* Gradient orb */}
        <div className="pointer-events-none absolute -top-1/4 -right-1/4 w-[48rem] h-[48rem] rounded-full bg-gradient-radial from-bronze-600/20 via-bronze-600/5 to-transparent blur-3xl opacity-30" />

        <div className="relative mx-auto max-w-[var(--container-content)] px-6">
          <Breadcrumbs segments={[{ label: 'Research' }]} />

          <div className="mt-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-4">
              <BookOpen size={16} className="text-bronze-500" />
              <p className="text-sm font-medium uppercase tracking-wider text-bronze-500">
                Knowledge Base
              </p>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl tracking-tight">Research Hub</h1>
            <p className="mt-4 text-charcoal-400 text-lg leading-relaxed">
              <span className="text-bronze-400 font-medium">{articles.length} articles</span> across{' '}
              <span className="text-bronze-400 font-medium">{categories.length} categories</span>.
              Open methods, public standards, and the reasoning behind every
              analysis engine.
            </p>
          </div>
        </div>
      </div>

      {/* Start Here */}
      <div className="mx-auto max-w-[var(--container-content)] px-6 pb-8">
        <section>
          <h2 className="font-serif text-2xl md:text-3xl tracking-tight">
            Start Here
          </h2>
          <p className="mt-2 text-sm text-charcoal-400">
            New to Phronesis? These five articles cover the core foundations.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'S.A.M. \u2014 A Framework for Forensic Analysis',
                category: 'Foundations',
                time: '9 min',
                href: '/research/foundations/methodology-paper',
                description: 'The core methodology paper \u2014 how S.A.M. reads documents "against the grain"',
              },
              {
                title: 'Cascade Theory',
                category: 'Foundations',
                time: '23 min',
                href: '/research/foundations/cascade-theory',
                description: 'How false premises propagate through institutional systems and accumulate authority',
              },
              {
                title: 'Contradiction Taxonomy',
                category: 'Foundations',
                time: '25 min',
                href: '/research/foundations/contradiction-taxonomy',
                description: 'The eight CASCADE contradiction types and how they\u2019re detected',
              },
              {
                title: 'Methodology Comparison Matrix',
                category: 'Methodologies',
                time: '44 min',
                href: '/research/methodologies/METHODOLOGY-COMPARISON',
                description: 'How S.A.M. compares to eDiscovery, intelligence analysis, and investigative journalism methods',
              },
              {
                title: 'Interdisciplinary Contradiction Detection',
                category: 'Interdisciplinary',
                time: '55 min',
                href: '/research/interdisciplinary/01-contradiction-detection-synthesis',
                description: 'Cross-domain synthesis of contradiction detection methods from 7 disciplines',
              },
            ].map((article) => (
              <a
                key={article.href}
                href={article.href}
                className="group rounded-xl border border-charcoal-800 bg-charcoal-850 p-5 transition-colors hover:border-bronze-600/40"
              >
                <div className="flex items-center gap-2 text-xs text-charcoal-500">
                  <span>{article.category}</span>
                  <span>&middot;</span>
                  <span>{article.time}</span>
                </div>
                <h3 className="mt-2 text-sm font-medium text-charcoal-100 group-hover:text-bronze-400 transition-colors">
                  {article.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-charcoal-400">
                  {article.description}
                </p>
              </a>
            ))}
          </div>
        </section>
      </div>

      {/* Category grid */}
      <div className="mx-auto max-w-[var(--container-content)] px-6 pb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>

        {/* Interactive search/filter section */}
        <section className="mt-20 border-t border-charcoal-800 pt-12">
          <h2 className="font-serif text-2xl md:text-3xl tracking-tight">All Articles</h2>
          <Suspense>
            <ResearchHubInteractive
              articles={articleSummaries}
              categories={categoryOptions}
            />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
