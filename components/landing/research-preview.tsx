import Link from 'next/link';
import { getCategories, getAllArticles } from '@/lib/research';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight } from 'lucide-react';

export function ResearchPreview() {
  const categories = getCategories();
  const totalArticles = getAllArticles().length;
  // Show top 6 categories by article count
  const topCategories = [...categories]
    .sort((a, b) => b.articleCount - a.articleCount)
    .slice(0, 6);

  return (
    <section id="research" className="relative py-32 lg:py-40 overflow-hidden">
      {/* Gradient orb effect via CSS */}
      <div className="pointer-events-none absolute -top-1/4 -right-1/4 w-[48rem] h-[48rem] rounded-full bg-gradient-radial from-charcoal-600/20 via-charcoal-700/10 to-transparent blur-3xl opacity-20" />

      <div className="relative mx-auto max-w-[var(--container-content)] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <BookOpen size={16} className="text-bronze-500" />
            <p className="text-sm font-medium uppercase tracking-wider text-bronze-500">
              Research Hub
            </p>
          </div>

          <h2 className="mt-3 font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
            Open Methods, Public Standards
          </h2>

          <p className="mt-4 text-charcoal-400 text-lg leading-relaxed">
            <span className="text-bronze-400 font-medium">{totalArticles} articles</span> across{' '}
            <span className="text-bronze-400 font-medium">{categories.length} categories</span>.
            Phronesis is grounded in professional investigation frameworks,
            evidence standards, and quality control methods. The research hub is
            where the sources, comparisons, and reasoning behind every engine
            are published.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {topCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/research/${cat.slug}`}
              className="group block rounded-xl border border-charcoal-800 bg-charcoal-850 p-6 transition-all hover:border-charcoal-700 hover:bg-charcoal-800/50"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-charcoal-100 group-hover:text-bronze-400 transition-colors">
                  {cat.label}
                </h4>
                <span className="flex items-center gap-1 text-xs text-charcoal-500 group-hover:text-bronze-500 transition-colors">
                  {cat.articleCount}
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
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

        <div className="mt-10 flex justify-center">
          <Button href="/research" variant="secondary">
            Browse All {totalArticles} Articles
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
