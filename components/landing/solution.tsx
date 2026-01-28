import Link from 'next/link';
import { samPhases, cascadeTypes } from '@/lib/content';
import { Badge } from '@/components/ui/badge';

const phaseColors = [
  'border-status-critical/40',
  'border-status-high/40',
  'border-status-medium/40',
  'border-status-info/40',
];

export function Solution() {
  return (
    <section id="methodology" className="py-20 md:py-28">
      <div className="mx-auto max-w-[var(--container-content)] px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-bronze-500">
            Methodology
          </p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">
            Systematic Adversarial Methodology
          </h2>
          <p className="mt-4 text-charcoal-400">
            S.A.M. is the framework for reading institutional documents
            &ldquo;against the grain&rdquo;&mdash;treating every claim as
            requiring verification rather than acceptance.
          </p>
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-charcoal-400">
          Most document review assumes good faith: that claims are accurate,
          that sources are cited fairly, that timelines are consistent. S.A.M.
          inverts this assumption. It systematically tests every assertion,
          traces every claim to its origin, and maps how information flows
          between institutions.
        </p>

        {/* SAM Phases */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                {phase.overview.split('.').slice(0, 2).join('.') + '.'}
              </p>
            </Link>
          ))}
        </div>

        {/* CASCADE */}
        <div className="mt-20">
          <div className="text-center">
            <h3 className="font-serif text-2xl text-charcoal-100">
              CASCADE: Eight Contradiction Types
            </h3>
            <p className="mt-2 text-sm text-charcoal-400">
              A taxonomy for classifying inconsistencies detected across
              document corpora
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
                <h4 className="mt-2 text-sm font-medium text-charcoal-100">
                  {type.description.split('\u2014')[0].trim() ||
                    type.name}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-charcoal-400">
                  {type.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
