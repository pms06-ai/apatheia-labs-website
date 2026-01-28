'use client';

import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { GradientOrb } from '@/components/ui/gradient-orb';
import { MotionWrapper, StaggerContainer, MotionItem } from '@/components/ui/motion-wrapper';
import { staggerContainer, fadeInUp } from '@/lib/motion';
import { cn } from '@/lib/utils';

const problems = [
  {
    title: 'Claims Propagate Without Verification',
    description:
      'A single unverified statement can be adopted by multiple agencies, accumulating apparent authority through repetition rather than evidence. By the time it reaches a decision-maker, the original uncertainty has been laundered into certainty.',
    icon: 'propagate',
  },
  {
    title: 'Contradictions Hide in Volume',
    description:
      'When case files span hundreds of documents, internal contradictions become invisible. A date mismatch on page 47 that undermines a conclusion on page 312 will never be caught by human review alone.',
    icon: 'volume',
  },
  {
    title: 'Selective Citation Goes Undetected',
    description:
      'Reports that quote sources selectively—omitting context that contradicts their conclusions—appear authoritative. Without systematic source comparison, cherry-picking masquerades as thorough analysis.',
    icon: 'selective',
  },
];

const icons: Record<string, React.ReactNode> = {
  propagate: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  ),
  volume: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  selective: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
    </svg>
  ),
};

export function Problem() {
  return (
    <section className="relative py-32 lg:py-40">
      {/* Single gradient orb instead of pattern */}
      <GradientOrb position="center-left" size="xl" opacity={20} />

      <div className="relative mx-auto max-w-[var(--container-content)] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <MotionWrapper>
            <div className="inline-flex items-center gap-2 mb-4">
              <AlertTriangle size={16} className="text-status-critical" />
              <p className="text-sm font-medium uppercase tracking-wider text-bronze-500">
                The Problem
              </p>
            </div>
          </MotionWrapper>

          <MotionWrapper delay={0.1}>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
              Why Institutions Fail Without Accountability
            </h2>
          </MotionWrapper>

          <MotionWrapper delay={0.2}>
            <p className="mt-4 text-charcoal-400 text-lg leading-relaxed">
              Institutional dysfunction persists because the evidence is
              fragmented, the patterns are hidden, and manual analysis cannot
              scale to document volumes that matter.
            </p>
          </MotionWrapper>
        </div>

        <StaggerContainer
          variants={staggerContainer}
          className="mt-16 grid gap-6 md:grid-cols-3"
        >
          {problems.map((p) => (
            <MotionItem key={p.title} variants={fadeInUp}>
              <Card hover glow className="h-full group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-critical/10 text-status-critical transition-all group-hover:bg-status-critical/15">
                    {icons[p.icon]}
                  </div>
                </div>
                <CardTitle className="group-hover:text-bronze-400 transition-colors">
                  {p.title}
                </CardTitle>
                <CardDescription className="mt-3 leading-relaxed">
                  {p.description}
                </CardDescription>
              </Card>
            </MotionItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
