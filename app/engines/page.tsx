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

        {/* Workflow Pipelines */}
        <section className="mt-20">
          <h2 className="font-serif text-2xl text-charcoal-100">
            Common Workflows
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal-400">
            Engines combine into preset workflows for common analysis patterns.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                name: 'Full Analysis',
                pipeline: 'E \u2192 T \u2192 A \u2192 K \u2192 B \u2192 L',
                description:
                  'Run all six engines in sequence. Entity Resolution and Temporal Parser establish the foundation. Argumentation and Contradiction analyse the substance. Bias Detection quantifies patterns. Accountability packages everything for action.',
              },
              {
                name: 'Quick Contradiction Scan',
                pipeline: 'E \u2192 K',
                description:
                  'Resolve identities, then scan for inconsistencies. Fastest path to surfacing conflicts in a document set. Use when you need a rapid assessment of corpus integrity.',
              },
              {
                name: 'Bias Assessment',
                pipeline: 'E \u2192 B \u2192 L',
                description:
                  'Resolve identities, calculate directional bias, and route findings to the relevant regulatory body. Use when the question is specifically about impartiality.',
              },
            ].map((workflow) => (
              <div
                key={workflow.name}
                className="rounded-xl border border-charcoal-800 bg-charcoal-850 p-5"
              >
                <h3 className="text-sm font-semibold text-charcoal-100">
                  {workflow.name}
                </h3>
                <p className="mt-2 font-mono text-xs text-bronze-500">
                  {workflow.pipeline}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-charcoal-400">
                  {workflow.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Common Features */}
        <section className="mt-20">
          <h2 className="font-serif text-2xl text-charcoal-100">
            Every Engine Shares
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: 'Source Citation',
                description:
                  'Every finding traces back to a specific document, page, and paragraph. No black boxes.',
              },
              {
                title: 'Confidence Scoring',
                description:
                  'Each output carries a confidence metric so you can prioritise findings and identify where human review is needed.',
              },
              {
                title: 'Audit Trail',
                description:
                  'Full provenance chain from raw document to final finding. Every analytical step is logged and reproducible.',
              },
              {
                title: 'Export',
                description:
                  'Findings export to structured formats for regulatory submissions, legal proceedings, or further analysis.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex gap-3 rounded-lg border border-charcoal-800 bg-charcoal-850 p-4"
              >
                <span className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-bronze-500" />
                <div>
                  <p className="text-sm font-medium text-charcoal-100">
                    {feature.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-charcoal-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
