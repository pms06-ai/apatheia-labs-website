import { Card } from '@/components/ui/card';

const problems = [
  {
    title: 'Claims Propagate Without Verification',
    description:
      'A single unverified statement can be adopted by multiple agencies, accumulating apparent authority through repetition rather than evidence. By the time it reaches a decision-maker, the original uncertainty has been laundered into certainty.',
  },
  {
    title: 'Contradictions Hide in Volume',
    description:
      'When case files span hundreds of documents, internal contradictions become invisible. A date mismatch on page 47 that undermines a conclusion on page 312 will never be caught by human review alone.',
  },
  {
    title: 'Selective Citation Goes Undetected',
    description:
      'Reports that quote sources selectively\u2014omitting context that contradicts their conclusions\u2014appear authoritative. Without systematic source comparison, cherry-picking masquerades as thorough analysis.',
  },
];

export function Problem() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-[var(--container-content)] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-bronze-500">
            The Problem
          </p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">
            Why Institutions Fail Without Accountability
          </h2>
          <p className="mt-4 text-charcoal-400">
            Institutional dysfunction persists because the evidence is
            fragmented, the patterns are hidden, and manual analysis cannot
            scale to document volumes that matter.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {problems.map((p) => (
            <Card key={p.title}>
              <h3 className="text-lg font-medium text-charcoal-100">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal-400">
                {p.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
