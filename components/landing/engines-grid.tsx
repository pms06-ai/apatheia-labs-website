import Link from 'next/link';
import { analysisEngines } from '@/lib/content';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Clock,
  MessageSquare,
  GitCompare,
  Scale,
  Shield,
} from 'lucide-react';

const engineIcons: Record<string, React.ReactNode> = {
  'entity-resolution': <Users size={20} />,
  'temporal-parser': <Clock size={20} />,
  argumentation: <MessageSquare size={20} />,
  contradiction: <GitCompare size={20} />,
  bias: <Scale size={20} />,
  accountability: <Shield size={20} />,
};

export function EnginesGrid() {
  return (
    <section id="engines" className="py-20 md:py-28 relative">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 pattern-dots opacity-20" />

      <div className="relative mx-auto max-w-[var(--container-content)] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="animate-fade-in-up text-sm font-medium uppercase tracking-wider text-bronze-500">
            Capabilities
          </p>
          <h2 className="animate-fade-in-up delay-100 mt-3 font-serif text-3xl md:text-4xl">
            Analysis Engines
          </h2>
          <p className="animate-fade-in-up delay-200 mt-4 text-charcoal-400">
            Six specialized engines work in concert to surface patterns that
            human review would miss. Each engine can run independently or as
            part of a comprehensive analysis pipeline.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {analysisEngines.map((engine, i) => (
            <Link
              key={engine.slug}
              href={`/engines/${engine.slug}`}
              className={`animate-fade-in-up delay-${(i % 3 + 3) * 100} group rounded-xl border border-charcoal-800 bg-charcoal-850 p-6 transition-all hover:border-bronze-600/40 hover-lift hover-glow glass-subtle`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-charcoal-800 to-charcoal-850 text-bronze-500 transition-all group-hover:from-bronze-600/20 group-hover:to-bronze-600/10 group-hover:scale-110 group-hover:text-bronze-400 shadow-lg">
                  {engineIcons[engine.slug] ?? engine.name[0]}
                </span>
                <h3 className="text-base font-medium text-charcoal-100 group-hover:text-bronze-400 transition-colors">
                  {engine.name}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-charcoal-400">
                {engine.overview}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {engine.capabilities.slice(0, 3).map((cap) => (
                  <Badge
                    key={cap}
                    className="transition-all group-hover:bg-charcoal-700"
                  >
                    {cap}
                  </Badge>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
