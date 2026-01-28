import { Check } from 'lucide-react';

const capabilities = [
  'Contradiction Detection',
  'Timeline Construction',
  'Entity Mapping',
  'Professional Exports',
  'Bias Detection',
  'Argumentation Analysis',
];

export function Comparison() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-[var(--container-content)] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-bronze-500">
            Capabilities
          </p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">
            What Phronesis Delivers
          </h2>
          <p className="mt-4 text-charcoal-400">
            Professional-grade forensic analysis, running entirely on your
            machine.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-lg">
          <div className="rounded-xl border border-bronze-600/30 bg-charcoal-850 p-6">
            <h3 className="text-lg font-medium text-charcoal-100">
              Included in Phronesis
            </h3>
            <ul className="mt-6 divide-y divide-charcoal-800">
              {capabilities.map((cap) => (
                <li
                  key={cap}
                  className="flex items-center gap-3 py-3 text-sm"
                >
                  <Check size={16} className="shrink-0 text-bronze-500" />
                  <span className="text-charcoal-200">{cap}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-charcoal-400">
              Desktop application. Local-first. Your documents never leave
              your machine.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
