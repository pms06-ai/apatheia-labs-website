'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { GradientOrb } from '@/components/ui/gradient-orb';
import { MotionWrapper, StaggerContainer, MotionItem } from '@/components/ui/motion-wrapper';
import { staggerContainerFast, fadeInUp } from '@/lib/motion';

const capabilities = [
  { name: 'Contradiction Detection', description: 'Find logical inconsistencies across documents' },
  { name: 'Timeline Construction', description: 'Automatically build chronologies from dates' },
  { name: 'Entity Mapping', description: 'Track people, organizations, and relationships' },
  { name: 'Professional Exports', description: 'Generate court-ready reports and summaries' },
  { name: 'Bias Detection', description: 'Identify selective citation and framing' },
  { name: 'Argumentation Analysis', description: 'Map claim structures and evidence chains' },
  { name: 'Regulatory Pathways', description: 'Pre-configured complaint generation for Ofcom, ICO, LGO, HCPC, GMC, SRA' },
];

export function Comparison() {
  return (
    <section className="relative py-32 lg:py-40 overflow-hidden">
      {/* Gradient orb */}
      <GradientOrb position="top-left" size="xl" bronze opacity={20} />

      <div className="relative mx-auto max-w-[var(--container-content)] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <MotionWrapper>
            <p className="text-sm font-medium uppercase tracking-wider text-bronze-500">
              Capabilities
            </p>
          </MotionWrapper>

          <MotionWrapper delay={0.1}>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
              What Phronesis Delivers
            </h2>
          </MotionWrapper>

          <MotionWrapper delay={0.2}>
            <p className="mt-4 text-charcoal-400 text-lg leading-relaxed">
              Professional-grade forensic analysis, running entirely on your
              machine.
            </p>
          </MotionWrapper>
        </div>

        <div className="mx-auto mt-16 max-w-lg">
          <MotionWrapper delay={0.3}>
            <div className="rounded-xl border border-charcoal-700 bg-charcoal-850 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bronze-600/15">
                  <Sparkles size={20} className="text-bronze-400" />
                </div>
                <h3 className="text-lg font-medium text-charcoal-100">
                  Included in Phronesis
                </h3>
              </div>

              <StaggerContainer
                variants={staggerContainerFast}
                as="ul"
                className="mt-6 divide-y divide-charcoal-800"
              >
                {capabilities.map((cap) => (
                  <MotionItem
                    key={cap.name}
                    variants={fadeInUp}
                    as="li"
                    className="group flex items-start gap-3 py-4 transition-all hover:bg-charcoal-800/30 hover:px-3 hover:-mx-3 rounded-lg"
                  >
                    <motion.div
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bronze-600/15 text-bronze-500 transition-all group-hover:bg-bronze-600/20"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Check size={14} />
                    </motion.div>
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-charcoal-200 group-hover:text-bronze-400 transition-colors">
                        {cap.name}
                      </span>
                      <p className="text-xs text-charcoal-500 mt-0.5">
                        {cap.description}
                      </p>
                    </div>
                  </MotionItem>
                ))}
              </StaggerContainer>

              <div className="mt-6 flex items-center gap-2 rounded-lg bg-charcoal-900/60 px-4 py-3">
                <div className="h-2 w-2 rounded-full bg-status-success" />
                <p className="text-xs text-charcoal-400">
                  Desktop application. Local-first. Your documents never leave
                  your machine.
                </p>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
}
