import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/research/breadcrumbs';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Why Phronesis exists: democratizing forensic document analysis for journalists, researchers, and legal professionals.',
};

const features = [
  {
    title: 'Local-First Architecture',
    description:
      'Your documents never leave your machine. Full SQLite database runs entirely on-device with zero cloud dependencies.',
  },
  {
    title: 'Privacy by Design',
    description:
      'Sensitive case materials stay under your control. Optional AI features use your own API keys with no data retention.',
  },
  {
    title: 'Multi-Provider AI',
    description:
      'Claude, Groq, Gemini, and Replicate supported. Choose the right model for each analysis task.',
  },
  {
    title: 'Regulatory Ready',
    description:
      'Generate complaint drafts for Ofcom, ICO, LGO, HCPC, and other UK regulatory bodies with full citations.',
  },
];

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-[var(--container-content)] px-6">
        <Breadcrumbs segments={[{ label: 'About' }]} />

        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-wider text-bronze-500">
            About
          </p>
          <h1 className="mt-3 font-serif text-3xl md:text-4xl">
            Why I Built This
          </h1>

          <div className="mt-8 space-y-5 text-charcoal-300 leading-relaxed">
            <p>
              I built Phronesis because I saw a critical gap in the tools
              available to individuals fighting institutional power. Complex
              investigations require rigorous document analysis, but the
              professional tools used by large firms are locked behind
              enterprise paywalls.
            </p>
            <p>
              <strong className="text-charcoal-100">Phronesis</strong>{' '}
              democratizes forensic intelligence. It applies systematic
              methodology to documentary analysis: detecting contradictions,
              constructing timelines, and mapping entity relationships that
              would otherwise take weeks to uncover.
            </p>
            <p>
              <strong className="text-charcoal-100">
                I am a solo developer committed to open source and privacy.
              </strong>{' '}
              There is no &ldquo;we.&rdquo; There is no corporate board. Just
              code, built to help you find the truth.
            </p>
            <p>
              Built for journalists, researchers, legal professionals, and
              anyone conducting evidence-based investigations who needs
              reliable, auditable document analysis.
            </p>
          </div>
        </div>

        {/* Feature cards */}
        <div className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <Card key={f.title}>
              <h3 className="text-base font-medium text-charcoal-100">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-400">
                {f.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Principles */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="font-serif text-2xl text-charcoal-100">
            Core Principles
          </h2>
          <ul className="mt-6 space-y-4 text-sm leading-relaxed text-charcoal-300">
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bronze-600/20 text-xs text-bronze-400">
                1
              </span>
              <span>
                <strong className="text-charcoal-100">Open Source</strong> &mdash; MIT
                licensed, available on GitHub. Transparency is non-negotiable.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bronze-600/20 text-xs text-bronze-400">
                2
              </span>
              <span>
                <strong className="text-charcoal-100">Privacy First</strong> &mdash;
                Documents never leave your machine. No cloud processing, no
                telemetry, no data retention.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bronze-600/20 text-xs text-bronze-400">
                3
              </span>
              <span>
                <strong className="text-charcoal-100">Built by Practitioners</strong>{' '}
                &mdash; Methodology tested on real cases, not theoretical
                exercises.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
