'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { samPhases, cascadeTypes } from '@/lib/content';
import { Badge } from '@/components/ui/badge';
import { GradientOrb } from '@/components/ui/gradient-orb';
import { MotionWrapper, StaggerContainer, MotionItem } from '@/components/ui/motion-wrapper';
import { staggerContainer, staggerContainerFast, fadeInUp } from '@/lib/motion';
import { cn } from '@/lib/utils';

const phaseColors = [
  'border-status-critical/30 hover:border-status-critical/50',
  'border-status-high/30 hover:border-status-high/50',
  'border-status-medium/30 hover:border-status-medium/50',
  'border-status-info/30 hover:border-status-info/50',
];

export function Solution() {
  return (
    <section id="methodology" className="relative py-32 lg:py-40">
      {/* Gradient orb */}
      <GradientOrb position="top-center" size="xl" bronze opacity={20} />

      <div className="relative mx-auto max-w-[var(--container-content)] px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <MotionWrapper>
            <p className="text-sm font-medium uppercase tracking-wider text-bronze-500">
              Methodology
            </p>
          </MotionWrapper>

          <MotionWrapper delay={0.1}>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
              Systematic Adversarial Methodology
            </h2>
          </MotionWrapper>

          <MotionWrapper delay={0.2}>
            <p className="mt-4 text-charcoal-400 text-lg leading-relaxed">
              S.A.M. is the framework for reading institutional documents
              &ldquo;against the grain&rdquo;&mdash;treating every claim as
              requiring verification rather than acceptance.
            </p>
          </MotionWrapper>
        </div>

        <MotionWrapper delay={0.3}>
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-charcoal-400">
            Most document review assumes good faith: that claims are accurate,
            that sources are cited fairly, that timelines are consistent. S.A.M.
            inverts this assumption. It systematically tests every assertion,
            traces every claim to its origin, and maps how information flows
            between institutions.
          </p>
        </MotionWrapper>

        {/* SAM Phases */}
        <StaggerContainer
          variants={staggerContainer}
          className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {samPhases.map((phase, i) => (
            <MotionItem key={phase.id} variants={fadeInUp}>
              <Link
                href="/methodology/sam"
                className={cn(
                  'group block rounded-xl border bg-charcoal-850 p-5 transition-all',
                  phaseColors[i],
                  'hover:bg-charcoal-800/50'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-charcoal-800 text-base font-bold text-bronze-500 transition-all group-hover:bg-bronze-600/20">
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold text-charcoal-100 group-hover:text-bronze-400 transition-colors">
                    {phase.name}
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-charcoal-400">
                  {phase.overview.split('.').slice(0, 2).join('.') + '.'}
                </p>
              </Link>
            </MotionItem>
          ))}
        </StaggerContainer>

        {/* CASCADE */}
        <div className="mt-24">
          <div className="text-center">
            <MotionWrapper>
              <h3 className="font-serif text-2xl md:text-3xl text-charcoal-100 tracking-tight">
                CASCADE: Eight Contradiction Types
              </h3>
            </MotionWrapper>

            <MotionWrapper delay={0.1}>
              <p className="mt-2 text-sm text-charcoal-400">
                A taxonomy for classifying inconsistencies detected across
                document corpora
              </p>
            </MotionWrapper>
          </div>

          <StaggerContainer
            variants={staggerContainerFast}
            className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {cascadeTypes.map((type) => (
              <MotionItem key={type.id} variants={fadeInUp}>
                <Link
                  href="/methodology/cascade"
                  className="group block rounded-lg border border-charcoal-800 bg-charcoal-850 p-4 transition-all hover:border-charcoal-700 hover:bg-charcoal-800/50"
                >
                  <Badge variant="bronze" className="transition-all group-hover:bg-bronze-600/20">
                    {type.name}
                  </Badge>
                  <h4 className="mt-2 text-sm font-medium text-charcoal-100 group-hover:text-bronze-400 transition-colors">
                    {type.description.split('—')[0].trim() || type.name}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-charcoal-400">
                    {type.description}
                  </p>
                </Link>
              </MotionItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
