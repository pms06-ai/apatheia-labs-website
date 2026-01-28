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
