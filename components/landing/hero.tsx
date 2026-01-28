'use client';

import { Shield, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GradientOrb } from '@/components/ui/gradient-orb';
import { MotionWrapper, StaggerContainer, MotionItem } from '@/components/ui/motion-wrapper';
import { fadeInUp, staggerContainerSlow, scaleIn } from '@/lib/motion';
import { cn } from '@/lib/utils';

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 md:py-36 lg:py-44">
      {/* Gradient orbs */}
      <GradientOrb position="top-right" size="xl" bronze opacity={25} />
      <GradientOrb position="bottom-left" size="lg" opacity={15} />

      <div className="relative mx-auto max-w-[var(--container-content)] px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Text content with staggered animations */}
          <StaggerContainer variants={staggerContainerSlow} className="space-y-8">
            <MotionItem>
              <span className="inline-flex items-center gap-2 rounded-full border border-charcoal-700 bg-charcoal-850/80 px-3 py-1 text-xs font-medium text-charcoal-300">
                <Shield size={14} className="text-bronze-500" />
                Forensic Intelligence
              </span>
            </MotionItem>

            <MotionItem>
              <h1 className="font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl lg:text-6xl xl:text-7xl">
                Expose{' '}
                <span className="text-bronze-500">
                  institutional dysfunction
                </span>{' '}
                through evidence.
              </h1>
            </MotionItem>

            <MotionItem className="space-y-4">
              <p className="text-lg text-charcoal-300 leading-relaxed">
                Apatheia Labs builds tools for institutional accountability analysis.
                Systematic methodology. Full audit trails. No hallucination.
              </p>
              <p className="text-charcoal-400 leading-relaxed">
                Our flagship platform, <strong className="text-charcoal-200 font-medium">Phronesis</strong>,
                detects contradictions, constructs timelines, and maps bias patterns
                across complex document bundles &mdash; entirely on your machine.
              </p>
            </MotionItem>

            <MotionItem className="flex flex-wrap gap-4">
              <Button href="#waitlist" size="lg">
                Join Waitlist
                <Sparkles size={18} />
              </Button>
              <Button
                href="#methodology"
                variant="secondary"
                size="lg"
              >
                How It Works
                <ArrowRight size={18} />
              </Button>
            </MotionItem>
          </StaggerContainer>

          {/* Visual card */}
          <MotionWrapper variants={scaleIn} delay={0.3}>
            <div className="rounded-xl border border-charcoal-800 bg-charcoal-850/90 p-5 shadow-xl backdrop-blur-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-status-critical/15 text-status-critical">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-charcoal-100">
                    Analysis Findings
                  </div>
                  <div className="text-xs text-charcoal-400">
                    3 critical issues detected
                  </div>
                </div>
              </div>

              <StaggerContainer variants={staggerContainerSlow} className="space-y-2 md:space-y-3">
                <FindingRow
                  severity="critical"
                  title="Temporal Contradiction Detected"
                  description="Report claims assessment occurred on 15 March, but referenced document dated 22 March."
                  tags={['TEMPORAL', 'Doc 14 → Doc 23']}
                />
                <FindingRow
                  severity="critical"
                  title="Selective Omission Identified"
                  description="Expert report excludes 3 paragraphs from source that contradict conclusions."
                  tags={['SELECTIVE', 'Bias: +1.0']}
                />
                {/* Third finding hidden on mobile for compact hero */}
                <div className="hidden md:block">
                  <FindingRow
                    severity="high"
                    title="Unverified Claim Propagation"
                    description="Statement adopted by 4 subsequent reports without independent verification."
                    tags={['INHERIT', '4 agencies']}
                  />
                </div>
              </StaggerContainer>
            </div>
          </MotionWrapper>
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
  const dotColor =
    severity === 'critical' ? 'bg-status-critical' : 'bg-status-high';

  return (
    <MotionItem>
      <motion.div
        className={cn(
          'flex gap-3 rounded-lg border border-charcoal-800 bg-charcoal-900/60 p-3',
          'transition-colors hover:border-charcoal-700 hover:bg-charcoal-900/80'
        )}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className={cn('mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full', dotColor)} />
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
      </motion.div>
    </MotionItem>
  );
}
