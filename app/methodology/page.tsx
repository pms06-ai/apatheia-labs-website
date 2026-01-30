import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/research/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
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

        {/* Why Two Frameworks */}
        <section className="mt-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif text-2xl text-charcoal-100">
              Why Two Frameworks
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-charcoal-400">
              <p>
                <strong className="text-charcoal-200">S.A.M. is a process.</strong>{' '}
                It defines the sequence of analytical steps: identify where a
                claim originated, track how it propagated, measure how it
                accumulated authority, and map the outcomes it produced. S.A.M.
                answers &ldquo;how did this happen?&rdquo;
              </p>
              <p>
                <strong className="text-charcoal-200">CASCADE is a taxonomy.</strong>{' '}
                It classifies the inconsistencies you find along the way into
                eight distinct types&nbsp;&mdash; from internal contradictions to
                unexplained position changes. CASCADE answers &ldquo;what exactly
                went wrong?&rdquo;
              </p>
              <p>
                You need both. S.A.M. without CASCADE finds problems but
                can&rsquo;t classify them. CASCADE without S.A.M. classifies
                problems but can&rsquo;t trace their origins. The frameworks are
                designed to operate together, with S.A.M. directing the
                investigation and CASCADE structuring the findings.
              </p>
            </div>
          </div>
        </section>

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

        {/* From Methodology to Engines */}
        <section className="mt-24">
          <div className="text-center">
            <h2 className="font-serif text-2xl text-charcoal-100">
              From Methodology to Engines
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-charcoal-400">
              The frameworks produce findings. The{' '}
              <Link
                href="/engines"
                className="text-bronze-500 hover:text-bronze-400 transition-colors"
              >
                six engines
              </Link>{' '}
              operationalise them.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Card>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal-100">
                S.A.M. Phase &rarr; Primary Engines
              </h3>
              <div className="mt-4 space-y-3">
                {[
                  { phase: 'ANCHOR', engines: 'Entity Resolution identifies claim originators. Argumentation tests evidential basis.' },
                  { phase: 'INHERIT', engines: 'Contradiction detects cross-document conflicts. Bias Detection identifies selective adoption.' },
                  { phase: 'COMPOUND', engines: 'Bias Detection quantifies accumulation patterns. Accountability maps duty to verify.' },
                  { phase: 'ARRIVE', engines: 'Accountability packages findings for action. Temporal Parser establishes causation timeline.' },
                ].map((row) => (
                  <div key={row.phase} className="flex gap-3 text-sm">
                    <Badge variant="bronze">{row.phase}</Badge>
                    <span className="text-charcoal-400">{row.engines}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal-100">
                CASCADE Type &rarr; Primary Engine
              </h3>
              <div className="mt-4 space-y-3">
                {[
                  { types: 'SELF, INTER_DOC, UNEXPLAINED', engine: 'Contradiction' },
                  { types: 'TEMPORAL', engine: 'Temporal Parser + Contradiction' },
                  { types: 'EVIDENTIARY', engine: 'Argumentation' },
                  { types: 'SELECTIVE', engine: 'Bias Detection' },
                  { types: 'SCOPE, MODALITY', engine: 'Argumentation + Contradiction' },
                ].map((row) => (
                  <div key={row.types} className="flex gap-3 text-sm">
                    <span className="shrink-0 font-mono text-xs text-bronze-500">
                      {row.types}
                    </span>
                    <span className="text-charcoal-400">{row.engine}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/engines"
              className="text-sm font-medium text-bronze-500 hover:text-bronze-400 transition-colors"
            >
              See all engines &rarr;
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
