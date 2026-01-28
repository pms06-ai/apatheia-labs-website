import Link from 'next/link';
import { analysisEngines } from '@/lib/content';
import { Badge } from '@/components/ui/badge';

const engineIcons: Record<string, string> = {
  'entity-resolution': 'E',
  'temporal-parser': 'T',
  argumentation: 'A',
  contradiction: 'K',
  bias: 'B',
  accountability: 'L',
};

export function EnginesGrid() {
  return (
    <section id="engines" className="py-20 md:py-28">
      <div className="mx-auto max-w-[var(--container-content)] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-bronze-500">
            Capabilities
          </p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">
            Analysis Engines
          </h2>
          <p className="mt-4 text-charcoal-400">
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
                <h3 className="text-base font-medium text-charcoal-100">
                  {engine.name}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-charcoal-400">
                {engine.overview}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {engine.capabilities.slice(0, 3).map((cap) => (
                  <Badge key={cap}>{cap}</Badge>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
