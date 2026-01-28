import { roadmapItems } from '@/lib/content';
import type { RoadmapItem } from '@/lib/content';
import { Badge } from '@/components/ui/badge';
import { Rocket, Lightbulb, Code, Sparkles } from 'lucide-react';

const statusConfig: Record<
  RoadmapItem['status'],
  { label: string; variant: 'success' | 'info' | 'bronze' | 'medium' | 'default'; icon: React.ReactNode }
> = {
  development: { label: 'In Development', variant: 'success', icon: <Code size={14} /> },
  next: { label: 'Next Up', variant: 'info', icon: <Rocket size={14} /> },
  concept: { label: 'Concept', variant: 'bronze', icon: <Lightbulb size={14} /> },
  planned: { label: 'Planned', variant: 'medium', icon: <Sparkles size={14} /> },
  research: { label: 'Research', variant: 'default', icon: <Lightbulb size={14} /> },
};

export function Roadmap() {
  const products = roadmapItems.filter((r) => r.isProduct);
  // Limit to 6 feature items (next 2 quarters) per improvement plan
  const features = roadmapItems.filter((r) => !r.isProduct).slice(0, 6);

  return (
    <section id="roadmap" className="py-20 md:py-28 relative overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 gradient-mesh opacity-40" />

      <div className="relative mx-auto max-w-[var(--container-content)] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="animate-fade-in-up inline-flex items-center gap-2 mb-4">
            <Rocket size={16} className="text-bronze-500" />
            <p className="text-sm font-medium uppercase tracking-wider text-bronze-500">
              The Future
            </p>
          </div>
          <h2 className="animate-fade-in-up delay-100 mt-3 font-serif text-3xl md:text-4xl">
            What I&rsquo;m Building
          </h2>
          <p className="animate-fade-in-up delay-200 mt-4 text-charcoal-400">
            Phronesis is just the beginning. A suite of forensic intelligence
            tools designed to make institutional accountability accessible to
            everyone.
          </p>
        </div>

        {/* Product concepts */}
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {products.map((item, i) => {
            const { label, variant, icon } = statusConfig[item.status];
            return (
              <div
                key={item.id}
                className={`animate-fade-in-up delay-${(i + 3) * 100} rounded-xl border border-bronze-600/20 bg-charcoal-850 p-6 transition-all hover:border-bronze-600/40 hover-lift glow-bronze-sm glass-subtle`}
              >
                <div className="flex items-center gap-2">
                  <Badge variant={variant} className="gap-1.5">
                    {icon}
                    {label}
                  </Badge>
                </div>
                <h3 className="mt-4 font-serif text-xl text-charcoal-100">
                  {item.name}
                </h3>
                <p className="text-sm text-bronze-500">{item.tagline}</p>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-400">
                  {item.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.features.map((f) => (
                    <span
                      key={f}
                      className="rounded-full bg-charcoal-800 px-2.5 py-0.5 text-xs text-charcoal-300 transition-colors hover:bg-charcoal-700"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature roadmap */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, i) => {
            const { label, variant, icon } = statusConfig[item.status];
            return (
              <div
                key={item.id}
                className={`animate-fade-in-up delay-${(i % 3 + 5) * 100} group rounded-xl border border-charcoal-800 bg-charcoal-850 p-5 transition-all hover:border-bronze-600/30 hover-lift`}
              >
                <Badge variant={variant} className="gap-1.5">
                  {icon}
                  {label}
                </Badge>
                <h4 className="mt-3 text-sm font-medium text-charcoal-100 group-hover:text-bronze-400 transition-colors">
                  {item.name}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-charcoal-400">
                  {item.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.features.map((f) => (
                    <span
                      key={f}
                      className="rounded-full bg-charcoal-800 px-2 py-0.5 text-[10px] text-charcoal-400 transition-colors group-hover:bg-charcoal-700"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
