import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/research/breadcrumbs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { analysisEngines } from '@/lib/content';

const engineIcons: Record<string, string> = {
  'entity-resolution': 'E',
  'temporal-parser': 'T',
  argumentation: 'A',
  contradiction: 'K',
  bias: 'B',
  accountability: 'L',
};

export function generateStaticParams() {
  return analysisEngines.map((engine) => ({ slug: engine.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const engine = analysisEngines.find((e) => e.slug === slug);
  if (!engine) return {};
  return {
    title: `${engine.name} Engine`,
    description: engine.overview,
  };
}

export default async function EngineDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const engine = analysisEngines.find((e) => e.slug === slug);
  if (!engine) notFound();

  const icon = engineIcons[engine.slug] ?? engine.name[0];

  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-[var(--container-content)] px-6">
        <Breadcrumbs
          segments={[
            { label: 'Engines', href: '/engines' },
            { label: engine.name },
          ]}
        />

        {/* Header */}
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-charcoal-800 font-mono text-2xl font-bold text-bronze-500">
            {icon}
          </span>
          <div>
            <h1 className="font-serif text-3xl md:text-4xl">
              {engine.name}
            </h1>
            <p className="mt-1 text-sm text-charcoal-400">
              {engine.subtitle}
            </p>
          </div>
        </div>

        <p className="mt-6 max-w-3xl text-charcoal-300 leading-relaxed">
          {engine.overview}
        </p>

        {/* Capabilities */}
        <div className="mt-6 flex flex-wrap gap-2">
          {engine.capabilities.map((cap) => (
            <Badge key={cap} variant="bronze">
              {cap}
            </Badge>
          ))}
        </div>

        {/* Content grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {/* Methodology */}
          <Card className="md:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-charcoal-100">
              How It Works
            </h2>
            <ol className="mt-4 space-y-3">
              {engine.methodology.map((step, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm text-charcoal-400"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-charcoal-800 text-xs font-medium text-bronze-500">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </Card>

          {/* I/O */}
          <Card>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-charcoal-100">
              Inputs
            </h2>
            <ul className="mt-3 space-y-1.5">
              {engine.inputs.map((input) => (
                <li
                  key={input}
                  className="text-sm text-charcoal-400"
                >
                  &bull; {input}
                </li>
              ))}
            </ul>
            <h2 className="mt-6 text-sm font-semibold uppercase tracking-wider text-charcoal-100">
              Outputs
            </h2>
            <ul className="mt-3 space-y-1.5">
              {engine.outputs.map((output) => (
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
      </div>
    </div>
  );
}
