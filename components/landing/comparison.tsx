import { Check, Sparkles } from 'lucide-react';

const capabilities = [
  { name: 'Contradiction Detection', description: 'Find logical inconsistencies across documents' },
  { name: 'Timeline Construction', description: 'Automatically build chronologies from dates' },
  { name: 'Entity Mapping', description: 'Track people, organizations, and relationships' },
  { name: 'Professional Exports', description: 'Generate court-ready reports and summaries' },
  { name: 'Bias Detection', description: 'Identify selective citation and framing' },
  { name: 'Argumentation Analysis', description: 'Map claim structures and evidence chains' },
];

export function Comparison() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 gradient-radial-bronze opacity-30" />

      <div className="relative mx-auto max-w-[var(--container-content)] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="animate-fade-in-up text-sm font-medium uppercase tracking-wider text-bronze-500">
            Capabilities
          </p>
          <h2 className="animate-fade-in-up delay-100 mt-3 font-serif text-3xl md:text-4xl">
            What Phronesis Delivers
          </h2>
          <p className="animate-fade-in-up delay-200 mt-4 text-charcoal-400">
            Professional-grade forensic analysis, running entirely on your
            machine.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-lg">
          <div className="animate-fade-in-up delay-300 rounded-xl border border-bronze-600/30 bg-charcoal-850 p-6 glass animate-glow-pulse">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bronze-600/20">
                <Sparkles size={20} className="text-bronze-400" />
              </div>
              <h3 className="text-lg font-medium text-charcoal-100">
                Included in Phronesis
              </h3>
            </div>
            <ul className="mt-6 divide-y divide-charcoal-800">
              {capabilities.map((cap, i) => (
                <li
                  key={cap.name}
                  className={`animate-fade-in-up delay-${(i % 3 + 4) * 100} group flex items-start gap-3 py-4 transition-all hover:bg-charcoal-800/30 hover:px-3 hover:-mx-3 rounded-lg`}
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bronze-600/20 text-bronze-500 transition-all group-hover:bg-bronze-600/30 group-hover:scale-110">
                    <Check size={14} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-charcoal-200 group-hover:text-bronze-400 transition-colors">
                      {cap.name}
                    </span>
                    <p className="text-xs text-charcoal-500 mt-0.5">
                      {cap.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center gap-2 rounded-lg bg-charcoal-900/60 px-4 py-3">
              <div className="h-2 w-2 rounded-full bg-status-success animate-pulse" />
              <p className="text-xs text-charcoal-400">
                Desktop application. Local-first. Your documents never leave
                your machine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
