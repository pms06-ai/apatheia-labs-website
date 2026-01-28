import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/research/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { samPhases, cascadeTypes } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Methodology',
  description:
    'S.A.M. and CASCADE: the two analytical frameworks behind Phronesis forensic document analysis.',
};

const phaseColors = [
  'border-status-critical/40',
  'border-status-high/40',
  'border-status-medium/40',
  'border-status-info/40',
];

export default function MethodologyPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-[var(--container-content)] px-6">
        <Breadcrumbs segments={[{ label: 'Methodology' }]} />

        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-bronze-500">
            Methodology
          </p>
          <h1 className="mt-3 font-serif text-3xl md:text-4xl">
            Analytical Frameworks
          </h1>
          <p className="mt-4 text-charcoal-400 leading-relaxed">
            Phronesis is built on two complementary frameworks: the{' '}
            <strong className="text-charcoal-200">
              Systematic Adversarial Methodology (S.A.M.)
            </strong>{' '}
            for tracing claims to their origins, and{' '}
            <strong className="text-charcoal-200">CASCADE</strong> for
            classifying the contradictions you find along the way.
          </p>
        </div>

        {/* S.A.M. Section */}
        <section className="mt-20">
          <div className="text-center">
            <h2 className="font-serif text-2xl text-charcoal-100">
              S.A.M. &mdash; Systematic Adversarial Methodology
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-charcoal-400">
              S.A.M. reads institutional documents &ldquo;against the
              grain&rdquo;&mdash;treating every claim as requiring verification
              rather than acceptance. Four phases trace claims from origin to
              outcome.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {samPhases.map((phase, i) => (
              <Link
                key={phase.id}
                href="/methodology/sam"
                className={`group rounded-xl border ${phaseColors[i]} bg-charcoal-850 p-5 transition-colors hover:border-bronze-600/40`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-charcoal-800 text-sm font-bold text-bronze-500">
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold text-charcoal-100">
                    {phase.name}
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-charcoal-400">
                  {phase.subtitle}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/methodology/sam"
              className="text-sm font-medium text-bronze-500 hover:text-bronze-400 transition-colors"
            >
              Read the full S.A.M. methodology &rarr;
            </Link>
          </div>
        </section>

        {/* CASCADE Section */}
        <section className="mt-24">
          <div className="text-center">
            <h2 className="font-serif text-2xl text-charcoal-100">
              CASCADE &mdash; Eight Contradiction Types
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-charcoal-400">
              A taxonomy for classifying inconsistencies detected across
              document corpora. Every contradiction found by Phronesis is
              assigned a CASCADE type.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cascadeTypes.map((type) => (
              <Link
                key={type.id}
                href="/methodology/cascade"
                className="group rounded-lg border border-charcoal-800 bg-charcoal-850 p-4 transition-colors hover:border-bronze-600/40"
              >
                <Badge variant="bronze">{type.name}</Badge>
                <p className="mt-2 text-xs leading-relaxed text-charcoal-400">
                  {type.description}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/methodology/cascade"
              className="text-sm font-medium text-bronze-500 hover:text-bronze-400 transition-colors"
            >
              Explore all CASCADE types &rarr;
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
