import { Shield, FileCheck, Scale, AlertTriangle, Target, BarChart3, Clock, Search } from 'lucide-react';

const trustFeatures = [
  {
    icon: <FileCheck size={20} />,
    title: 'Source Citation Required',
    description: 'Every claim traced to [Doc:Page:Para] references',
  },
  {
    icon: <Scale size={20} />,
    title: 'Confidence Scoring',
    description: 'FACT vs INFERENCE vs SPECULATION distinction',
  },
  {
    icon: <Shield size={20} />,
    title: 'Verification Layer',
    description: 'NLI-based claim validation',
  },
  {
    icon: <AlertTriangle size={20} />,
    title: 'No Hallucination Risk',
    description: 'Rejects unsupported assertions',
  },
];

const capabilities = [
  {
    icon: <Target size={20} />,
    title: 'Directional Bias Scoring',
    description: '+1.0 to -1.0 scale measuring systematic imbalance',
  },
  {
    icon: <BarChart3 size={20} />,
    title: 'Framing Ratio Detection',
    description: 'Statistical significance testing with p-value calculations',
  },
  {
    icon: <Clock size={20} />,
    title: 'Timeline Reconstruction',
    description: 'Multi-year analysis across 1,000+ page bundles',
  },
  {
    icon: <Search size={20} />,
    title: 'Omission Pattern Analysis',
    description: 'Gap detection with bias direction calculation',
  },
];

export function Credibility() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 pattern-grid opacity-5" />

      <div className="relative mx-auto max-w-[var(--container-content)] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="animate-fade-in-up text-sm font-medium uppercase tracking-wider text-bronze-500">
            Built for Trust
          </p>
          <h2 className="animate-fade-in-up delay-100 mt-3 font-serif text-3xl md:text-4xl">
            Evidence-Grade Analysis
          </h2>
          <p className="animate-fade-in-up delay-200 mt-4 text-charcoal-400">
            Systematic methodology with full audit trails. Every finding traceable to source.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {/* Trust Architecture */}
          <div className="animate-fade-in-up delay-300 rounded-xl border border-charcoal-700 bg-charcoal-850 p-6">
            <h3 className="flex items-center gap-2 text-lg font-medium text-charcoal-100">
              <Shield size={20} className="text-bronze-500" />
              Trust Architecture
            </h3>
            <p className="mt-2 text-sm text-charcoal-500">
              Built-in safeguards against AI hallucination and unsupported claims
            </p>
            <ul className="mt-6 space-y-4">
              {trustFeatures.map((feature) => (
                <li
                  key={feature.title}
                  className="group flex items-start gap-3 rounded-lg p-2 transition-all hover:bg-charcoal-800/50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bronze-600/10 text-bronze-500 transition-all group-hover:bg-bronze-600/20">
                    {feature.icon}
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-charcoal-200 group-hover:text-bronze-400 transition-colors">
                      {feature.title}
                    </span>
                    <p className="text-xs text-charcoal-500 mt-0.5">
                      {feature.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Proven Capabilities */}
          <div className="animate-fade-in-up delay-400 rounded-xl border border-bronze-600/30 bg-charcoal-850 p-6">
            <h3 className="flex items-center gap-2 text-lg font-medium text-charcoal-100">
              <BarChart3 size={20} className="text-bronze-500" />
              Proven Capabilities
            </h3>
            <p className="mt-2 text-sm text-charcoal-500">
              Tested on real investigations with 1,000+ page document bundles
            </p>
            <ul className="mt-6 space-y-4">
              {capabilities.map((cap) => (
                <li
                  key={cap.title}
                  className="group flex items-start gap-3 rounded-lg p-2 transition-all hover:bg-charcoal-800/50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bronze-600/10 text-bronze-500 transition-all group-hover:bg-bronze-600/20">
                    {cap.icon}
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-charcoal-200 group-hover:text-bronze-400 transition-colors">
                      {cap.title}
                    </span>
                    <p className="text-xs text-charcoal-500 mt-0.5">
                      {cap.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
