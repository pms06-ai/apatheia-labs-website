import Link from 'next/link';
import { getCategories, getAllArticles } from '@/lib/research';
import { Button } from '@/components/ui/button';

export function ResearchPreview() {
  const categories = getCategories();
  const totalArticles = getAllArticles().length;
  // Show top 6 categories by article count
  const topCategories = [...categories]
    .sort((a, b) => b.articleCount - a.articleCount)
    .slice(0, 6);

  return (
    <section id="research" className="py-20 md:py-28">
      <div className="mx-auto max-w-[var(--container-content)] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-bronze-500">
            Research Hub
          </p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">
            Open Methods, Public Standards
          </h2>
          <p className="mt-4 text-charcoal-400">
            {totalArticles} articles across {categories.length} categories.
            Phronesis is grounded in professional investigation frameworks,
            evidence standards, and quality control methods. The research hub is
            where the sources, comparisons, and reasoning behind every engine
            are published.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {topCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/research/${cat.slug}`}
              className="group rounded-xl border border-charcoal-800 bg-charcoal-850 p-6 transition-colors hover:border-bronze-600/40"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-charcoal-100 group-hover:text-bronze-400 transition-colors">
                  {cat.label}
                </h4>
                <span className="text-xs text-charcoal-500">
                  {cat.articleCount} {cat.articleCount === 1 ? 'article' : 'articles'}
                </span>
              </div>
              {cat.description && (
                <p className="mt-2 text-sm leading-relaxed text-charcoal-400">
                  {cat.description}
                </p>
              )}
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-center gap-4">
          <Button href="/research" variant="secondary">
            Browse All {totalArticles} Articles
          </Button>
        </div>
      </div>
    </section>
  );
}
