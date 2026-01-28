import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/research/breadcrumbs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { samPhases } from '@/lib/content';

export const metadata: Metadata = {
  title: 'S.A.M. Methodology',
  description:
    'Systematic Adversarial Methodology: four phases for tracing institutional claims from origin to outcome.',
};

const phaseVariants: Array<'critical' | 'high' | 'medium' | 'info'> = [
  'critical',
  'high',
  'medium',
  'info',
];

export default function SAMPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-[var(--container-content)] px-6">
        <Breadcrumbs
          segments={[
            { label: 'Methodology', href: '/methodology' },
            { label: 'S.A.M.' },
          ]}
        />

        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-wider text-bronze-500">
            Framework
          </p>
          <h1 className="mt-3 font-serif text-3xl md:text-4xl">
            Systematic Adversarial Methodology
          </h1>
          <p className="mt-4 text-charcoal-400 leading-relaxed">
            Most document review assumes good faith: that claims are accurate,
            that sources are cited fairly, that timelines are consistent.
            S.A.M. inverts this assumption. It systematically tests every
            assertion, traces every claim to its origin, and maps how
            information flows between institutions.
          </p>
        </div>

        {/* Phases */}
        <div className="mt-16 space-y-12">
          {samPhases.map((phase, i) => (
            <section
              key={phase.id}
              id={phase.id}
              className="scroll-mt-24"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-charcoal-800 text-base font-bold text-bronze-500">
                  {i + 1}
                </span>
                <div>
                  <Badge variant={phaseVariants[i]}>{phase.name}</Badge>
                  <h2 className="mt-1 font-serif text-xl text-charcoal-100">
                    {phase.subtitle}
                  </h2>
                </div>
              </div>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-charcoal-300">
                {phase.overview}
              </p>

              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {/* Methodology */}
                <Card className="md:col-span-2">
                  <h3 className="text-sm font-semibold text-charcoal-100">
                    Methodology
                  </h3>
                  <ol className="mt-3 space-y-2">
                    {phase.methodology.map((step, j) => (
                      <li
                        key={j}
                        className="flex gap-2 text-sm text-charcoal-400"
                      >
                        <span className="shrink-0 text-bronze-600">
                          {j + 1}.
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </Card>

                {/* I/O */}
                <Card>
                  <h3 className="text-sm font-semibold text-charcoal-100">
                    Inputs
                  </h3>
                  <ul className="mt-2 space-y-1">
                    {phase.inputs.map((input) => (
                      <li
                        key={input}
                        className="text-sm text-charcoal-400"
                      >
                        &bull; {input}
                      </li>
                    ))}
                  </ul>
                  <h3 className="mt-5 text-sm font-semibold text-charcoal-100">
                    Outputs
                  </h3>
                  <ul className="mt-2 space-y-1">
                    {phase.outputs.map((output) => (
                      <li
                        key={output}
                        className="text-sm text-charcoal-400"
                      >
                        &bull; {output}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* Case Example */}
              <div className="mt-4 rounded-lg border border-charcoal-800 bg-charcoal-900 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-bronze-500">
                  Case Example &mdash; {phase.caseExample.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-300">
                  {phase.caseExample.text}
                </p>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
