'use client';

import { motion } from 'framer-motion';
import { Shield, FileCheck, Scale, AlertTriangle, Target, BarChart3, Clock, Search } from 'lucide-react';
import { GradientOrb } from '@/components/ui/gradient-orb';
import { MotionWrapper, StaggerContainer, MotionItem } from '@/components/ui/motion-wrapper';
import { staggerContainer, fadeInUp } from '@/lib/motion';

const trustFeatures = [
  {
    icon: <FileCheck size={20} />,
    title: 'Source Citation Required',
    description: 'Every claim traced to [Doc:Page:Para] references',
  },
  {
    icon: <Scale size={20} />,
    title: 'Confidence Scoring',
    description: 'FACT vs INFERENCE vs SPECULATION distinction',
  },
  {
    icon: <Shield size={20} />,
    title: 'Verification Layer',
    description: 'NLI-based claim validation',
  },
  {
    icon: <AlertTriangle size={20} />,
    title: 'No Hallucination Risk',
    description: 'Rejects unsupported assertions',
  },
];

const capabilities = [
  {
    icon: <Target size={20} />,
    title: 'Directional Bias Scoring',
    description: '+1.0 to -1.0 scale measuring systematic imbalance',
  },
  {
    icon: <BarChart3 size={20} />,
    title: 'Framing Ratio Detection',
    description: 'Statistical significance testing with p-value calculations',
  },
  {
    icon: <Clock size={20} />,
    title: 'Timeline Reconstruction',
    description: 'Multi-year analysis across 1,000+ page bundles',
  },
  {
    icon: <Search size={20} />,
    title: 'Omission Pattern Analysis',
    description: 'Gap detection with bias direction calculation',
  },
];

export function Credibility() {
  return (
    <section className="relative py-32 lg:py-40 overflow-hidden">
      {/* Gradient orb */}
      <GradientOrb position="bottom-center" size="xl" bronze opacity={15} />

      <div className="relative mx-auto max-w-[var(--container-content)] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <MotionWrapper>
            <p className="text-sm font-medium uppercase tracking-wider text-bronze-500">
              Built for Trust
            </p>
          </MotionWrapper>

          <MotionWrapper delay={0.1}>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
              Evidence-Grade Analysis
            </h2>
          </MotionWrapper>

          <MotionWrapper delay={0.2}>
            <p className="mt-4 text-charcoal-400 text-lg leading-relaxed">
              Systematic methodology with full audit trails. Every finding traceable to source.
            </p>
          </MotionWrapper>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Trust Architecture */}
          <MotionWrapper delay={0.3}>
            <div className="rounded-xl border border-charcoal-700 bg-charcoal-850 p-6 h-full">
              <h3 className="flex items-center gap-2 text-lg font-medium text-charcoal-100">
                <Shield size={20} className="text-bronze-500" />
                Trust Architecture
              </h3>
              <p className="mt-2 text-sm text-charcoal-500">
                Built-in safeguards against AI hallucination and unsupported claims
              </p>
              <ul className="mt-6 space-y-4">
                {trustFeatures.map((feature) => (
                  <motion.li
                    key={feature.title}
                    className="group flex items-start gap-3 rounded-lg p-2 transition-all hover:bg-charcoal-800/50"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bronze-600/10 text-bronze-500 transition-all group-hover:bg-bronze-600/15">
                      {feature.icon}
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-charcoal-200 group-hover:text-bronze-400 transition-colors">
                        {feature.title}
                      </span>
                      <p className="text-xs text-charcoal-500 mt-0.5">
                        {feature.description}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </MotionWrapper>

          {/* Proven Capabilities */}
          <MotionWrapper delay={0.4}>
            <div className="rounded-xl border border-charcoal-700 bg-charcoal-850 p-6 h-full">
              <h3 className="flex items-center gap-2 text-lg font-medium text-charcoal-100">
                <BarChart3 size={20} className="text-bronze-500" />
                Proven Capabilities
              </h3>
              <p className="mt-2 text-sm text-charcoal-500">
                Tested on real investigations with 1,000+ page document bundles
              </p>
              <ul className="mt-6 space-y-4">
                {capabilities.map((cap) => (
                  <motion.li
                    key={cap.title}
                    className="group flex items-start gap-3 rounded-lg p-2 transition-all hover:bg-charcoal-800/50"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bronze-600/10 text-bronze-500 transition-all group-hover:bg-bronze-600/15">
                      {cap.icon}
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-charcoal-200 group-hover:text-bronze-400 transition-colors">
                        {cap.title}
                      </span>
                      <p className="text-xs text-charcoal-500 mt-0.5">
                        {cap.description}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
}
