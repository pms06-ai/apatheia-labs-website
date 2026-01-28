import Link from 'next/link';
import { samPhases, cascadeTypes } from '@/lib/content';
import { Badge } from '@/components/ui/badge';

const phaseColors = [
  'border-status-critical/40 hover:border-status-critical/60',
  'border-status-high/40 hover:border-status-high/60',
  'border-status-medium/40 hover:border-status-medium/60',
  'border-status-info/40 hover:border-status-info/60',
];

const phaseGlows = [
  'hover:shadow-[0_0_20px_rgba(201,74,74,0.15)]',
  'hover:shadow-[0_0_20px_rgba(212,160,23,0.15)]',
  'hover:shadow-[0_0_20px_rgba(139,115,85,0.15)]',
  'hover:shadow-[0_0_20px_rgba(91,138,154,0.15)]',
];

export function Solution() {
  return (
    <section id="methodology" className="py-20 md:py-28 relative">
      {/* Gradient overlay */}
      <div className="absolute inset-0 gradient-radial-bronze opacity-40" />

      <div className="relative mx-auto max-w-[var(--container-content)] px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="animate-fade-in-up text-sm font-medium uppercase tracking-wider text-bronze-500">
            Methodology
          </p>
          <h2 className="animate-fade-in-up delay-100 mt-3 font-serif text-3xl md:text-4xl">
            Systematic Adversarial Methodology
          </h2>
          <p className="animate-fade-in-up delay-200 mt-4 text-charcoal-400">
            S.A.M. is the framework for reading institutional documents
            &ldquo;against the grain&rdquo;&mdash;treating every claim as
            requiring verification rather than acceptance.
          </p>
        </div>

        <p className="animate-fade-in-up delay-300 mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-charcoal-400">
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
              className={`animate-fade-in-up delay-${(i + 4) * 100} group rounded-xl border ${phaseColors[i]} bg-charcoal-850 p-5 transition-all hover-lift ${phaseGlows[i]} glass-subtle`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-charcoal-800 text-base font-bold text-bronze-500 transition-all group-hover:bg-bronze-600/20 group-hover:scale-110">
                  {i + 1}
                </span>
                <span className="text-sm font-semibold text-charcoal-100 group-hover:text-bronze-400 transition-colors">
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
            <h3 className="animate-fade-in-up font-serif text-2xl text-charcoal-100">
              CASCADE: Eight Contradiction Types
            </h3>
            <p className="animate-fade-in-up delay-100 mt-2 text-sm text-charcoal-400">
              A taxonomy for classifying inconsistencies detected across
              document corpora
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cascadeTypes.map((type, i) => (
              <Link
                key={type.id}
                href="/methodology/cascade"
                className={`animate-fade-in-up delay-${(i % 4 + 2) * 100} group rounded-lg border border-charcoal-800 bg-charcoal-850 p-4 transition-all hover:border-bronze-600/40 hover-lift hover-glow`}
              >
                <Badge variant="bronze" className="transition-all group-hover:bg-bronze-600/30">
                  {type.name}
                </Badge>
                <h4 className="mt-2 text-sm font-medium text-charcoal-100 group-hover:text-bronze-400 transition-colors">
                  {type.description.split('—')[0].trim() || type.name}
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
