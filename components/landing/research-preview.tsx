import Link from 'next/link';
import { researchCategories } from '@/lib/content';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const statusVariant: Record<string, 'success' | 'info' | 'medium'> = {
  complete: 'success',
  'in-progress': 'info',
  planned: 'medium',
};

export function ResearchPreview() {
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
            Phronesis is grounded in professional investigation frameworks,
            evidence standards, and quality control methods. The research hub is
            where the sources, comparisons, and reasoning behind every engine
            are published.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {researchCategories.map((cat) => (
            <div
              key={cat.name}
              className="rounded-xl border border-charcoal-800 bg-charcoal-850 p-6"
            >
              <div className="flex items-center justify-between">
                <Badge variant={statusVariant[cat.status] ?? 'medium'}>
                  {cat.status === 'complete'
                    ? 'Complete'
                    : cat.status === 'in-progress'
                      ? 'In Progress'
                      : 'Planned'}
                </Badge>
                <span className="text-xs text-charcoal-500">
                  {cat.articleCount} articles
                </span>
              </div>
              <h4 className="mt-4 font-medium text-charcoal-100">
                {cat.name}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-400">
                {cat.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center gap-4">
          <Button href="/research" variant="secondary">
            Browse Research Hub
          </Button>
        </div>
      </div>
    </section>
  );
}
