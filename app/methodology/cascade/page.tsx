import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/research/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { cascadeTypes } from '@/lib/content';

export const metadata: Metadata = {
  title: 'CASCADE Contradiction Types',
  description:
    'Eight types of contradiction detected by Phronesis: SELF, INTER_DOC, TEMPORAL, EVIDENTIARY, MODALITY, SELECTIVE, SCOPE, and UNEXPLAINED.',
};

export default function CascadePage() {
  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-[var(--container-content)] px-6">
        <Breadcrumbs
          segments={[
            { label: 'Methodology', href: '/methodology' },
            { label: 'CASCADE' },
          ]}
        />

        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-wider text-bronze-500">
            Framework
          </p>
          <h1 className="mt-3 font-serif text-3xl md:text-4xl">
            CASCADE: Eight Contradiction Types
          </h1>
          <p className="mt-4 text-charcoal-400 leading-relaxed">
            CASCADE is Phronesis&rsquo;s taxonomy for classifying
            inconsistencies across document corpora. Every contradiction
            found by the analysis engines is assigned one of eight types,
            enabling systematic tracking and prioritization.
          </p>
        </div>

        {/* Type grid */}
        <div className="mt-16 space-y-10">
          {cascadeTypes.map((type, i) => (
            <section
              key={type.id}
              id={type.id}
              className="scroll-mt-24 rounded-xl border border-charcoal-800 bg-charcoal-850 p-6"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-charcoal-800 text-sm font-bold text-bronze-500">
                  {i + 1}
                </span>
                <Badge variant="bronze">{type.name}</Badge>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-charcoal-300">
                {type.description}
              </p>

              {/* Example */}
              <div className="mt-4 rounded-lg border border-charcoal-800 bg-charcoal-900 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-bronze-500">
                  Example
                </p>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-400">
                  {type.example}
                </p>
              </div>

              {/* Detection indicators */}
              <div className="mt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal-300">
                  Detection Methodology
                </h3>
                <ol className="mt-2 space-y-1.5">
                  {type.indicators.map((ind, j) => (
                    <li
                      key={j}
                      className="flex gap-2 text-sm text-charcoal-400"
                    >
                      <span className="shrink-0 text-bronze-600">
                        {j + 1}.
                      </span>
                      {ind}
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
