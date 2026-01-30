import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/research/breadcrumbs';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Why Phronesis exists: democratising forensic document analysis for journalists, researchers, and legal professionals.',
};

const architectureCards = [
  {
    title: 'Local-First Architecture',
    description:
      'Your documents never leave your machine. Full SQLite database runs entirely on-device. No cloud dependencies, no telemetry, no phone-home. Your disk, your data. The application runs offline after installation — network access is only needed for optional AI features, and those use your own API keys.',
  },
  {
    title: 'Privacy by Design',
    description:
      'Sensitive case materials stay under your control. AI features are optional and use your own API keys with no data retention on provider servers. No usage analytics. No document fingerprinting. No metadata collection. The platform knows nothing about you or your cases beyond what\u2019s on your local machine.',
  },
  {
    title: 'Multi-Provider AI',
    description:
      'Claude for deep reasoning and document analysis. Groq for speed-critical operations. Gemini for multimodal processing. Replicate for specialist models. Choose the right provider for each task, or run entirely without AI using the rule-based analysis engines.',
  },
  {
    title: 'Regulatory Ready',
    description:
      'Pre-configured complaint templates for UK regulatory bodies: Ofcom (Broadcasting Code), ICO (UK GDPR), LGO (maladministration), HCPC (health and care professions), GMC (medical practitioners), SRA (solicitors). Each template structures evidence to the body\u2019s requirements with proper citation formatting.',
  },
];

const builtForUsers = [
  {
    role: 'Journalists',
    description:
      'Investigating institutional failure \u2014 surface contradictions, trace claim origins, quantify bias in source materials across multi-year investigations.',
  },
  {
    role: 'Legal Professionals',
    description:
      'Handling complex multi-document cases \u2014 construct timelines, map entity relationships, and identify evidential gaps across hundreds of documents.',
  },
  {
    role: 'Self-Represented Litigants',
    description:
      'Facing institutional opponents \u2014 level the analytical playing field with systematic methodology that produces court-ready, fully cited findings.',
  },
  {
    role: 'Researchers',
    description:
      'Studying institutional behaviour \u2014 analyse how claims propagate across agencies, how authority accumulates through repetition, and how selective citation distorts conclusions.',
  },
  {
    role: 'Regulatory Complainants',
    description:
      'Building evidence packages \u2014 generate structured complaints for Ofcom, ICO, LGO, HCPC, GMC, SRA with proper citation formatting and evidence packaging.',
  },
];

const designPrinciples = [
  {
    title: 'Evidence-Grade Output',
    description:
      'Every finding cites [Doc:Page:Para] references. No claim exists without a traceable source. If the engine can\u2019t cite it, it doesn\u2019t output it.',
  },
  {
    title: 'No Hallucination Tolerance',
    description:
      'AI-generated content is validated against source documents. Claims without source citations are rejected. The system distinguishes FACT (source-cited), INFERENCE (logically derived), and SPECULATION (hypothesis) explicitly.',
  },
  {
    title: 'Full Audit Trail',
    description:
      'Every analytical step is logged and reproducible. From raw document to final finding, the entire chain of reasoning is preserved. Any finding can be traced backward to its source in seconds.',
  },
  {
    title: 'Human-in-the-Loop',
    description:
      'Automation surfaces findings. Humans make decisions. The platform never generates conclusions \u2014 it generates evidence for humans to evaluate. Ambiguous results are flagged for review, not silently resolved.',
  },
];

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-[var(--container-content)] px-6">
        <Breadcrumbs segments={[{ label: 'About' }]} />

        {/* Origin */}
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-wider text-bronze-500">
            About
          </p>
          <h1 className="mt-3 font-serif text-3xl md:text-4xl">
            Why I Built This
          </h1>
          <blockquote className="mt-6 border-l-4 border-bronze-600 pl-6 text-lg text-charcoal-300 italic">
            Evidence should never be ignored because the person holding it
            can&rsquo;t afford the tools to prove what it shows.
          </blockquote>

          <div className="mt-8 space-y-5 text-charcoal-300 leading-relaxed">
            <p>
              Institutional accountability analysis has always required two
              things: rigorous methodology and the ability to process large
              document volumes systematically. The tools that do this
              well&nbsp;&mdash; eDiscovery platforms, forensic analysis suites,
              litigation support software&nbsp;&mdash; sit behind enterprise
              paywalls. The people who need them most&nbsp;&mdash; individuals
              challenging institutional decisions, journalists investigating
              systemic failure, self-represented litigants facing organisations
              with unlimited legal budgets&nbsp;&mdash; are exactly the people
              who can&rsquo;t access them.
            </p>
            <p>
              That gap isn&rsquo;t academic. Nine years in the US Air Force
              taught me how institutions actually work: how information flows
              through chains of command, how process becomes a substitute for
              truth, how a single unchallenged assumption can propagate through
              an entire system until it becomes &ldquo;established fact&rdquo;
              that no one questions because everyone assumes someone else already
              verified it. Institutional dysfunction isn&rsquo;t usually
              malicious. It&rsquo;s structural. And structural problems need
              structural analysis.
            </p>
            <p>
              Phronesis started as a personal tool built for a real
              investigation. I needed to analyse a 1,400+ page document corpus,
              trace claims back to their origins, and prove that a conclusion
              accepted by multiple agencies rested on a premise no one had ever
              verified. Manual analysis couldn&rsquo;t scale. Existing tools were
              either too expensive, too generic, or too focused on keyword search
              rather than structural analysis. So I built what I needed. When it
              worked&nbsp;&mdash; when the methodology surfaced patterns that
              hundreds of hours of manual review had missed&nbsp;&mdash; it
              became clear this needed to be available to everyone facing the
              same problem.
            </p>
          </div>

          <div className="mt-8 rounded-xl border border-charcoal-800 bg-charcoal-850 p-6">
            <p className="text-sm font-medium text-charcoal-100">
              Built by Paul Stephen
            </p>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-400">
              Founder, Apatheia Labs. Former US Air Force Staff Sergeant (9
              years active duty). After encountering institutional failures
              firsthand, I developed Phronesis to ensure evidence never gets
              ignored because the person holding it lacks the tools to prove what
              it shows. No corporate board. No investors. Just code,
              methodology, and a refusal to accept &ldquo;that&rsquo;s just how
              institutions work.&rdquo;
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="mx-auto mt-20 max-w-3xl">
          <h2 className="font-serif text-2xl text-charcoal-100">Mission</h2>
          <ul className="mt-6 space-y-4">
            {[
              {
                bold: 'Democratize forensic intelligence.',
                text: 'The same analytical rigour available to large firms should be available to anyone with documents and a question.',
              },
              {
                bold: 'Make institutional accountability accessible to individuals.',
                text: 'One person with the right methodology should be able to hold any institution to account.',
              },
              {
                bold: 'Prove systematic failure with statistical rigour, not anecdote.',
                text: 'Patterns need numbers. Bias needs p-values. Conclusions need source citations. Opinion isn\u2019t enough.',
              },
            ].map((item) => (
              <li
                key={item.bold}
                className="flex gap-3 text-sm leading-relaxed text-charcoal-300"
              >
                <span className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-bronze-500" />
                <span>
                  <strong className="text-charcoal-100">{item.bold}</strong>{' '}
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Built For */}
        <div className="mx-auto mt-20 max-w-4xl">
          <h2 className="font-serif text-2xl text-charcoal-100">Built For</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {builtForUsers.map((user) => (
              <Card key={user.role}>
                <h3 className="text-sm font-semibold text-charcoal-100">
                  {user.role}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-400">
                  {user.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Architecture */}
        <div className="mx-auto mt-20 max-w-4xl">
          <h2 className="font-serif text-2xl text-charcoal-100">
            Architecture
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {architectureCards.map((f) => (
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
        </div>

        {/* Design Philosophy */}
        <div className="mx-auto mt-20 max-w-4xl">
          <h2 className="font-serif text-2xl text-charcoal-100">
            Design Philosophy
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {designPrinciples.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border border-charcoal-800 bg-charcoal-850 p-5"
              >
                <h3 className="text-sm font-semibold text-charcoal-100">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-400">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Core Principles */}
        <div className="mx-auto mt-20 max-w-3xl">
          <h2 className="font-serif text-2xl text-charcoal-100">
            Core Principles
          </h2>
          <ul className="mt-6 space-y-6 text-sm leading-relaxed text-charcoal-300">
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bronze-600/20 text-xs text-bronze-400">
                1
              </span>
              <span>
                <strong className="text-charcoal-100">Open Source</strong>{' '}
                &mdash; MIT licensed. Full source available on GitHub. Every
                methodology is published. Every algorithm is inspectable. No
                black boxes, no proprietary methods, no &ldquo;trust our
                process.&rdquo; If you want to know how a finding was generated,
                read the code.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bronze-600/20 text-xs text-bronze-400">
                2
              </span>
              <span>
                <strong className="text-charcoal-100">Privacy First</strong>{' '}
                &mdash; Documents never leave your machine. No cloud processing.
                No telemetry. No data collection. No analytics. Your analysis is
                yours&nbsp;&mdash; not training data, not a product metric, not
                monetizable. Privacy isn&rsquo;t a feature. It&rsquo;s the
                architecture.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bronze-600/20 text-xs text-bronze-400">
                3
              </span>
              <span>
                <strong className="text-charcoal-100">
                  Built by Practitioners
                </strong>{' '}
                &mdash; Every engine tested on real investigations with 1,000+
                page document bundles. Methodology refined through actual case
                analysis, not theoretical exercises. S.A.M. and CASCADE were
                developed because existing approaches failed on real
                problems&nbsp;&mdash; and validated because they succeeded where
                those approaches didn&rsquo;t.
              </span>
            </li>
          </ul>
        </div>

        {/* Open Source & Transparency */}
        <div className="mx-auto mt-20 max-w-3xl">
          <h2 className="font-serif text-2xl text-charcoal-100">
            Open Source &amp; Transparency
          </h2>
          <ul className="mt-6 space-y-3 text-sm leading-relaxed text-charcoal-300">
            <li className="flex gap-3">
              <span className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-bronze-500" />
              <span>
                <strong className="text-charcoal-100">License:</strong> MIT
                &mdash; use it, fork it, modify it, contribute to it
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-bronze-500" />
              <span>
                <strong className="text-charcoal-100">Source:</strong> Available
                on GitHub
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-bronze-500" />
              <span>
                <strong className="text-charcoal-100">Methodology:</strong>{' '}
                Published and peer-reviewable &mdash; see{' '}
                <Link
                  href="/methodology"
                  className="text-bronze-500 hover:text-bronze-400 transition-colors"
                >
                  Methodology
                </Link>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-bronze-500" />
              <span>
                <strong className="text-charcoal-100">Research:</strong> 47
                articles across 13 categories &mdash; see{' '}
                <Link
                  href="/research"
                  className="text-bronze-500 hover:text-bronze-400 transition-colors"
                >
                  Research Hub
                </Link>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-bronze-500" />
              <span>
                <strong className="text-charcoal-100">Standards:</strong> Every
                analytical method documented with academic foundations and
                validation studies
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
