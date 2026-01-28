import type { Metadata } from 'next';
import { getCategories, getAllArticles } from '@/lib/research';
import { CategoryCard } from '@/components/research/category-card';
import { Breadcrumbs } from '@/components/research/breadcrumbs';

export const metadata: Metadata = {
  title: 'Research Hub',
  description:
    'Open research spanning investigation methodologies, cognitive science, ethics, legal frameworks, and forensic analysis foundations.',
};

export default function ResearchHubPage() {
  const categories = getCategories();
  const articles = getAllArticles();

  return (
    <div className="mx-auto max-w-[var(--container-content)] px-6 py-16">
      <Breadcrumbs segments={[{ label: 'Research' }]} />

      <div className="max-w-2xl">
        <h1 className="font-serif text-3xl md:text-4xl">Research Hub</h1>
        <p className="mt-4 text-charcoal-400 leading-relaxed">
          {articles.length} articles across {categories.length} categories.
          Open methods, public standards, and the reasoning behind every
          analysis engine.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <CategoryCard key={cat.slug} category={cat} />
        ))}
      </div>
    </div>
  );
}
