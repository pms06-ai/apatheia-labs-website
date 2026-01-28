import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/research/breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { analysisEngines } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Analysis Engines',
  description:
    'Six specialized analysis engines: Entity Resolution, Temporal Parser, Argumentation, Contradiction, Bias Detection, and Accountability.',
};

const engineIcons: Record<string, string> = {
  'entity-resolution': 'E',
  'temporal-parser': 'T',
  argumentation: 'A',
  contradiction: 'K',
  bias: 'B',
  accountability: 'L',
};

export default function EnginesPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-[var(--container-content)] px-6">
        <Breadcrumbs segments={[{ label: 'Engines' }]} />

        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-bronze-500">
            Capabilities
          </p>
          <h1 className="mt-3 font-serif text-3xl md:text-4xl">
            Analysis Engines
          </h1>
          <p className="mt-4 text-charcoal-400 leading-relaxed">
            Six specialized engines work in concert to surface patterns that
            human review would miss. Each engine can run independently or as
            part of a comprehensive analysis pipeline.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {analysisEngines.map((engine) => (
            <Link
              key={engine.slug}
              href={`/engines/${engine.slug}`}
              className="group rounded-xl border border-charcoal-800 bg-charcoal-850 p-6 transition-colors hover:border-bronze-600/40"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-charcoal-800 font-mono text-lg font-bold text-bronze-500">
                  {engineIcons[engine.slug] ?? engine.name[0]}
                </span>
                <div>
                  <h2 className="text-base font-medium text-charcoal-100">
                    {engine.name}
                  </h2>
                  <p className="text-xs text-charcoal-500">{engine.subtitle}</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-charcoal-400">
                {engine.overview}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {engine.capabilities.map((cap) => (
                  <Badge key={cap}>{cap}</Badge>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
