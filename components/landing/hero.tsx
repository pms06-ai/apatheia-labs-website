import { Shield, Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="mx-auto max-w-[var(--container-content)] px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Text */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-bronze-600/30 bg-bronze-600/10 px-3 py-1 text-xs font-medium text-bronze-400">
              <Shield size={14} />
              Free &amp; Local-First
            </div>

            <h1 className="font-serif text-4xl leading-tight md:text-5xl lg:text-6xl">
              Find the{' '}
              <span className="text-bronze-500">contradictions</span> they
              missed.
            </h1>

            <p className="text-lg text-charcoal-300">
              Phronesis &mdash; Free forensic document analysis for
              investigators who demand evidence.
            </p>
            <p className="text-charcoal-400">
              Professional-grade document analysis software&mdash;previously
              limited to large legal teams and enterprise budgets&mdash;now
              available as a free, open-source desktop application. Detect
              contradictions, construct timelines, and map entity relationships
              across hundreds of documents.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button href="#download" className="gap-2">
                Download for Windows
                <Download size={16} />
              </Button>
              <Button href="#methodology" variant="secondary" className="gap-2">
                How It Works
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>

          {/* Visual card */}
          <div className="rounded-xl border border-charcoal-800 bg-charcoal-850 p-5 shadow-2xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-status-critical/15 text-status-critical">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-charcoal-100">Analysis Findings</div>
                <div className="text-xs text-charcoal-400">3 critical issues detected</div>
              </div>
            </div>

            <div className="space-y-3">
              <FindingRow
                severity="critical"
                title="Temporal Contradiction Detected"
                description="Report claims assessment occurred on 15 March, but referenced document dated 22 March."
                tags={['TEMPORAL', 'Doc 14 \u2192 Doc 23']}
              />
              <FindingRow
                severity="critical"
                title="Selective Omission Identified"
                description="Expert report excludes 3 paragraphs from source that contradict conclusions."
                tags={['SELECTIVE', 'Bias: +1.0']}
              />
              <FindingRow
                severity="high"
                title="Unverified Claim Propagation"
                description="Statement adopted by 4 subsequent reports without independent verification."
                tags={['INHERIT', '4 agencies']}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FindingRow({
  severity,
  title,
  description,
  tags,
}: {
  severity: 'critical' | 'high';
  title: string;
  description: string;
  tags: string[];
}) {
  const dotColor = severity === 'critical' ? 'bg-status-critical' : 'bg-status-high';

  return (
    <div className="flex gap-3 rounded-lg border border-charcoal-800 bg-charcoal-900/60 p-3">
      <div className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dotColor}`} />
      <div className="min-w-0">
        <h4 className="text-sm font-medium text-charcoal-100">{title}</h4>
        <p className="mt-0.5 text-xs text-charcoal-400">{description}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-charcoal-800 px-2 py-0.5 text-[10px] font-medium text-charcoal-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
