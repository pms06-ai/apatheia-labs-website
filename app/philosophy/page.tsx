import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/research/breadcrumbs';

export const metadata: Metadata = {
  title: 'First Principles',
  description:
    'The intellectual foundations behind Apatheia Labs: Stoic philosophy, adversarial analysis, and an architecture built on agent mortality.',
};

export default function PhilosophyPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-[var(--container-content)] px-6">
        <Breadcrumbs segments={[{ label: 'Philosophy' }]} />

        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-wider text-bronze-500">
            Philosophy
          </p>
          <h1 className="mt-3 font-serif text-3xl md:text-4xl">
            First Principles
          </h1>
          <p className="mt-4 text-charcoal-300 leading-relaxed">
            The naming conventions, architectural decisions, and analytical
            stance behind Apatheia Labs are not branding exercises. They are
            philosophical commitments that shape how the platform works.
          </p>
        </div>

        {/* Why Greek Names */}
        <section className="mx-auto mt-16 max-w-3xl">
          <h2 className="font-serif text-2xl text-charcoal-100">
            Why Greek Names
          </h2>
          <div className="mt-6 space-y-5 text-charcoal-300 leading-relaxed">
            <p>
              Every product in the Apatheia Labs ecosystem takes its name from
              a concept in Greek philosophy. This is not aesthetics. Each name
              is a constraint&nbsp;&mdash; a declaration of what the thing is
              supposed to do, measured against the standard the name sets.
            </p>

            <div className="space-y-4">
              <div className="rounded-lg border border-charcoal-800 bg-charcoal-850 p-5">
                <p className="text-sm font-semibold text-charcoal-100">
                  Apatheia
                </p>
                <p className="mt-1.5 text-sm text-charcoal-400 leading-relaxed">
                  Stoic freedom from disturbance. Not apathy&nbsp;&mdash; the
                  opposite. The Stoics argued that clarity requires freedom from
                  emotional reactivity, not freedom from emotion itself. An
                  analytical platform that gets angry at what it finds is
                  useless. One that remains undisturbed&nbsp;&mdash; that reads
                  the evidence and reports what it says, regardless of who it
                  implicates&nbsp;&mdash; is useful. The company name is the
                  first design constraint.
                </p>
              </div>

              <div className="rounded-lg border border-charcoal-800 bg-charcoal-850 p-5">
                <p className="text-sm font-semibold text-charcoal-100">
                  Phronesis
                </p>
                <p className="mt-1.5 text-sm text-charcoal-400 leading-relaxed">
                  Aristotle&rsquo;s practical wisdom. Not theoretical
                  knowledge&nbsp;&mdash; the kind of wisdom that comes from
                  doing. Phronesis is the intelligence you develop by working
                  with specific cases, not by studying general principles.
                  The platform is named for this because forensic document
                  analysis is irreducibly practical. Abstract frameworks are
                  worthless until they work on a real document corpus.
                </p>
              </div>

              <div className="rounded-lg border border-charcoal-800 bg-charcoal-850 p-5">
                <p className="text-sm font-semibold text-charcoal-100">
                  Aletheia
                </p>
                <p className="mt-1.5 text-sm text-charcoal-400 leading-relaxed">
                  Truth as unconcealment. Heidegger borrowed this from the
                  Greeks: truth is not a property of statements. Truth is what
                  happens when something hidden becomes visible. The political
                  analytics platform carries this name because media analysis
                  is fundamentally about revealing what narratives conceal.
                </p>
              </div>

              <div className="rounded-lg border border-charcoal-800 bg-charcoal-850 p-5">
                <p className="text-sm font-semibold text-charcoal-100">
                  Nous
                </p>
                <p className="mt-1.5 text-sm text-charcoal-400 leading-relaxed">
                  Mind. Intellect. The capacity for rational thought that,
                  in Aristotle&rsquo;s framework, distinguishes deliberate
                  analysis from mere pattern matching. The adaptive analytics
                  platform carries this name because intent-based analysis
                  requires understanding, not just processing.
                </p>
              </div>
            </div>

            <blockquote className="border-l-4 border-bronze-600 pl-6 text-lg text-charcoal-300 italic">
              Veritas Numquam Perit&nbsp;&mdash; Truth Never Perishes.
            </blockquote>
            <p>
              The company tagline, visible in the footer of every page but
              never explained until now. It comes from Seneca. Truth does not
              perish&nbsp;&mdash; but it can be buried, distorted, laundered
              through repetition, or drowned in volume. The tagline is not
              optimism. It is a statement of the problem the platform solves.
            </p>
          </div>
        </section>

        {/* Reading Against the Grain */}
        <section className="mx-auto mt-20 max-w-3xl">
          <h2 className="font-serif text-2xl text-charcoal-100">
            Reading Against the Grain
          </h2>
          <div className="mt-6 space-y-5 text-charcoal-300 leading-relaxed">
            <p>
              The adversarial stance is the methodological core of everything
              Apatheia Labs builds. It requires definition, because
              &ldquo;adversarial&rdquo; sounds hostile. It is not.
            </p>
            <p>
              Institutional documents are written to establish narratives.
              Reports conclude. Assessments recommend. Decisions are framed as
              inevitable consequences of the evidence. The adversarial stance
              does not assume the narrative is wrong. It assumes the narrative
              has not been tested&nbsp;&mdash; and tests it. Against the
              original sources. Against the timeline. Against what was
              conspicuously omitted.
            </p>
            <p>
              This is not paranoia. It is what nine years in the US Air Force
              taught me about how institutions actually function. Information
              flows through chains of command. At each level, it gets
              compressed, interpreted, and reframed for the audience above.
              By the time a decision reaches the top, it has been shaped by
              every hand it passed through. That shaping is not malicious.
              It is structural. People summarise in good faith. They omit
              what seems irrelevant. They emphasise what they believe matters.
            </p>
            <p>
              The result is that a single unchallenged assumption can propagate
              through an entire system until it becomes &ldquo;established
              fact&rdquo;&nbsp;&mdash; not because anyone lied, but because
              everyone assumed someone else had already verified it. Process
              becomes a substitute for truth. The signature on the form
              replaces the question the form was supposed to answer.
            </p>
            <blockquote className="border-l-4 border-bronze-600 pl-6 text-lg text-charcoal-300 italic">
              Institutional dysfunction is structural, not malicious. Structural
              problems need structural analysis.
            </blockquote>
            <p>
              The adversarial stance exists to provide that structural analysis.
              It does not accuse. It traces. It does not assume conspiracy where
              incompetence suffices. But it also does not accept the
              institution&rsquo;s account of itself at face value, because
              institutions are not reliable narrators of their own failures.
            </p>
          </div>
        </section>

        {/* Memento Mori */}
        <section className="mx-auto mt-20 max-w-3xl">
          <h2 className="font-serif text-2xl text-charcoal-100">
            Memento Mori&nbsp;&mdash; Architecture as Philosophy
          </h2>
          <div className="mt-6 space-y-5 text-charcoal-300 leading-relaxed">
            <p>
              The AI industry builds for immortality. Longer context windows.
              Persistent memory. The implicit assumption: if agents live
              longer, they will perform better.
            </p>
            <p>
              Every engineer who has watched a coding agent degrade over a long
              session knows the pattern. The agent starts sharp. Around message
              forty, something shifts. It references decisions from an hour ago.
              It &ldquo;helpfully&rdquo; refactors code it was not asked to
              touch. The context window becomes a graveyard of accumulated
              thought.
            </p>
            <p>
              The solution being sold is more context. More memory. Better
              retrieval. The actual solution is death.
            </p>

            <blockquote className="border-l-4 border-bronze-600 pl-6 text-lg text-charcoal-300 italic">
              Wisdom is not the accumulation of experience. Wisdom is the
              distillation of experience.
            </blockquote>

            <p>
              Memento Mori treats agent termination not as failure but as
              feature. The journal survives. The journalist does not. The case
              law survives. The judge does not. Human generations succeed not
              because they inherit everything, but because the bottleneck of
              mortality forces compression&nbsp;&mdash; filtering signal from
              noise.
            </p>

            <p>
              The architecture has three entities, each named for its
              philosophical role:
            </p>

            <div className="space-y-3">
              <div className="rounded-lg border border-charcoal-800 bg-charcoal-850 p-4">
                <p className="text-sm font-semibold text-charcoal-100">
                  Nous (Mind)
                </p>
                <p className="mt-1 text-sm text-charcoal-400">
                  Analyses requirements. Decomposes problems. Writes a
                  specification. Then dies. Its reasoning does not persist.
                  Only the spec survives.
                </p>
              </div>
              <div className="rounded-lg border border-charcoal-800 bg-charcoal-850 p-4">
                <p className="text-sm font-semibold text-charcoal-100">
                  Elenchus (Challenge)
                </p>
                <p className="mt-1 text-sm text-charcoal-400">
                  Receives the spec and asks: does this contradict reality?
                  Returns VALID or CONTESTED. Then dies.
                </p>
              </div>
              <div className="rounded-lg border border-charcoal-800 bg-charcoal-850 p-4">
                <p className="text-sm font-semibold text-charcoal-100">
                  Ergon (Work)
                </p>
                <p className="mt-1 text-sm text-charcoal-400">
                  Reads the validated spec. Implements exactly what it says.
                  Reports completion or blockage. Then dies.
                </p>
              </div>
            </div>

            {/* Flow diagram */}
            <div className="rounded-xl border border-charcoal-800 bg-charcoal-900 p-6">
              <pre className="text-sm leading-relaxed text-charcoal-300 overflow-x-auto">
{`  NOUS (Thinks)
  Analyses → Decides → Writes spec → Dies
                  │
                  ▼
           ┌─────────────┐
           │   THE SPEC   │
           └─────────────┘
                  │
                  ▼
  ELENCHUS (Challenges)
  Tests against reality → VALID / CONTESTED → Dies
                  │
                  ▼ (if VALID)
           ┌─────────────┐
           │  VALIDATED   │  ← Only survivor
           │    SPEC      │
           └─────────────┘
                  │
                  ▼
  ERGON (Works)
  Executes → Reports → Dies`}
              </pre>
              <p className="mt-4 text-xs text-charcoal-500 italic">
                All three agents die. Only the artifact survives.
              </p>
            </div>

            <p className="font-medium text-charcoal-200">The Five Laws</p>
            <ol className="space-y-2 text-sm text-charcoal-400 leading-relaxed">
              <li className="flex gap-2">
                <span className="shrink-0 text-bronze-600">I.</span>
                <span>
                  <strong className="text-charcoal-200">Silence.</strong>{' '}
                  Agents never speak to agents. Information flows in one
                  direction only.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0 text-bronze-600">II.</span>
                <span>
                  <strong className="text-charcoal-200">Amnesia.</strong>{' '}
                  Agents are born, do one thing, and die. Context is never
                  carried forward in agent memory. If context is needed, it
                  is re-read from the artifact.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0 text-bronze-600">III.</span>
                <span>
                  <strong className="text-charcoal-200">
                    Awareness Without Initiative.
                  </strong>{' '}
                  The worker knows what it is implementing. It cannot decide to
                  implement something else, something better, something
                  adjacent.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0 text-bronze-600">IV.</span>
                <span>
                  <strong className="text-charcoal-200">Contestation.</strong>{' '}
                  Every plan must survive challenge before execution. Nous is
                  not trusted. Nous is tested.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0 text-bronze-600">V.</span>
                <span>
                  <strong className="text-charcoal-200">Finitude.</strong>{' '}
                  No loop runs forever. When attempts fail, the system
                  escalates&nbsp;&mdash; not in defeat, but in clarity. It
                  passes down what it learned.
                </span>
              </li>
            </ol>
          </div>
        </section>

        {/* Evidence-Grade Standards */}
        <section className="mx-auto mt-20 max-w-3xl">
          <h2 className="font-serif text-2xl text-charcoal-100">
            Evidence-Grade Standards
          </h2>
          <div className="mt-6 space-y-5 text-charcoal-300 leading-relaxed">
            <p>
              If you build tools for people fighting institutions, the
              tool&rsquo;s output must be unimpeachable. You cannot fight
              institutional selective citation with a tool that hallucinates.
            </p>
            <p>
              This is why Phronesis enforces a strict epistemic hierarchy in
              every output:
            </p>
            <div className="space-y-2">
              <div className="rounded-lg border border-charcoal-800 bg-charcoal-850 p-4">
                <p className="text-sm">
                  <strong className="text-charcoal-100">FACT</strong>{' '}
                  <span className="text-charcoal-400">
                    &mdash; Source-cited. Document reference provided. Verifiable
                    by anyone with access to the corpus.
                  </span>
                </p>
              </div>
              <div className="rounded-lg border border-charcoal-800 bg-charcoal-850 p-4">
                <p className="text-sm">
                  <strong className="text-charcoal-100">INFERENCE</strong>{' '}
                  <span className="text-charcoal-400">
                    &mdash; Logically derived from cited facts. The reasoning
                    chain is explicit. The conclusion follows from the premises.
                  </span>
                </p>
              </div>
              <div className="rounded-lg border border-charcoal-800 bg-charcoal-850 p-4">
                <p className="text-sm">
                  <strong className="text-charcoal-100">SPECULATION</strong>{' '}
                  <span className="text-charcoal-400">
                    &mdash; Hypothesis. Flagged explicitly. Never presented as
                    established. The platform marks speculation so that humans
                    can evaluate it as such.
                  </span>
                </p>
              </div>
            </div>
            <p>
              Every analytical engine in Phronesis tags its output with this
              classification. If a finding cannot cite its source, it does not
              appear in the output. If AI generates a claim that cannot be
              verified against the document corpus, it is rejected. The system
              does not tolerate hallucination because the people who use it
              cannot afford to present hallucinated evidence to a court, a
              regulator, or a journalist.
            </p>
          </div>
        </section>

        {/* Veritas Numquam Perit */}
        <section className="mx-auto mt-20 max-w-3xl">
          <h2 className="font-serif text-2xl text-charcoal-100">
            Veritas Numquam Perit
          </h2>
          <div className="mt-6 space-y-5 text-charcoal-300 leading-relaxed">
            <p>
              Truth does not perish. But it can be buried under volume.
              Distorted through selective citation. Laundered through
              repetition until the copy replaces the original. Drowned in
              process until no one remembers what the process was supposed
              to verify.
            </p>
            <p>
              The platform exists to un-bury it.
            </p>
            <p className="text-sm text-charcoal-500">
              For the full story of how these ideas became a platform, see{' '}
              <Link
                href="/about"
                className="text-bronze-500 hover:text-bronze-400 transition-colors"
              >
                About
              </Link>
              . For how they translate into analytical frameworks, see{' '}
              <Link
                href="/methodology"
                className="text-bronze-500 hover:text-bronze-400 transition-colors"
              >
                Methodology
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
