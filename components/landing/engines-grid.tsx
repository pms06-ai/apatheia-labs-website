'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { analysisEngines } from '@/lib/content';
import { Badge } from '@/components/ui/badge';
import { GradientOrb } from '@/components/ui/gradient-orb';
import { MotionWrapper, StaggerContainer, MotionItem } from '@/components/ui/motion-wrapper';
import { staggerContainer, fadeInUp } from '@/lib/motion';
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
    <section id="engines" className="relative py-32 lg:py-40">
      {/* Gradient orb */}
      <GradientOrb position="center-right" size="xl" opacity={18} />

      <div className="relative mx-auto max-w-[var(--container-content)] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <MotionWrapper>
            <p className="text-sm font-medium uppercase tracking-wider text-bronze-500">
              Capabilities
            </p>
          </MotionWrapper>

          <MotionWrapper delay={0.1}>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
              Analysis Engines
            </h2>
          </MotionWrapper>

          <MotionWrapper delay={0.2}>
            <p className="mt-4 text-charcoal-400 text-lg leading-relaxed">
              Six specialized engines work in concert to surface patterns that
              human review would miss. Each engine can run independently or as
              part of a comprehensive analysis pipeline.
            </p>
          </MotionWrapper>
        </div>

        <StaggerContainer
          variants={staggerContainer}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {analysisEngines.map((engine) => (
            <MotionItem key={engine.slug} variants={fadeInUp}>
              <Link
                href={`/engines/${engine.slug}`}
                className="group block rounded-xl border border-charcoal-800 bg-charcoal-850 p-6 transition-all hover:border-charcoal-700 hover:bg-charcoal-800/50"
              >
                <div className="flex items-center gap-3">
                  <motion.span
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-charcoal-800 text-bronze-500 transition-colors group-hover:bg-bronze-600/15 group-hover:text-bronze-400"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {engineIcons[engine.slug] ?? engine.name[0]}
                  </motion.span>
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
                      className="transition-colors group-hover:bg-charcoal-700"
                    >
                      {cap}
                    </Badge>
                  ))}
                </div>
              </Link>
            </MotionItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
