'use client';

import { motion } from 'framer-motion';
import { Sparkles, Mail, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GradientOrb } from '@/components/ui/gradient-orb';
import { MotionWrapper, StaggerContainer, MotionItem } from '@/components/ui/motion-wrapper';
import { staggerContainerFast, fadeInUp } from '@/lib/motion';

const benefits = [
  'Early access to Phronesis before public launch',
  'Exclusive updates on development progress',
  'Priority support and feedback opportunities',
  'Local-first: Your documents never leave your machine',
];

export function DownloadSection() {
  return (
    <section id="waitlist" className="relative py-32 lg:py-40 overflow-hidden">
      {/* Gradient orbs */}
      <GradientOrb position="top-center" size="xl" bronze opacity={25} />
      <GradientOrb position="bottom-left" size="lg" opacity={15} />

      <div className="relative mx-auto max-w-[var(--container-content)] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <MotionWrapper>
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-bronze-500" />
              <p className="text-sm font-medium uppercase tracking-wider text-bronze-500">
                Coming Soon
              </p>
            </div>
          </MotionWrapper>

          <MotionWrapper delay={0.1}>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight">
              Join the Waitlist
            </h2>
          </MotionWrapper>

          <MotionWrapper delay={0.2}>
            <p className="mt-4 text-charcoal-400 text-lg leading-relaxed">
              Be the first to know when Phronesis launches. Get early access and
              exclusive updates.
            </p>
          </MotionWrapper>
        </div>

        <div className="mx-auto mt-16 max-w-md">
          <MotionWrapper delay={0.3}>
            <div className="rounded-xl border border-charcoal-700 bg-charcoal-850 p-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <motion.div
                  className="flex h-14 w-14 items-center justify-center rounded-xl bg-charcoal-800 text-bronze-400"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Bell size={28} />
                </motion.div>
              </div>

              <h3 className="text-center text-lg font-medium text-charcoal-100 mb-2">
                Get Notified at Launch
              </h3>
              <p className="text-center text-sm text-charcoal-400 mb-6">
                Professional-grade forensic document analysis, running entirely on your machine.
              </p>

              {/* Email signup form */}
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-500" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-charcoal-700 bg-charcoal-900 py-3 pl-12 pr-4 text-sm text-charcoal-100 placeholder:text-charcoal-500 focus:border-bronze-600 focus:outline-none focus:ring-1 focus:ring-bronze-600/50 transition-all"
                  />
                </div>
                <Button className="w-full gap-2">
                  Join Waitlist
                  <Sparkles size={16} />
                </Button>
              </form>

              <p className="mt-4 text-center text-xs text-charcoal-500">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </MotionWrapper>
        </div>

        {/* Features preview */}
        <MotionWrapper delay={0.5} className="mx-auto mt-10 max-w-lg">
          <div className="rounded-xl border border-charcoal-800 bg-charcoal-850 p-5">
            <h4 className="text-sm font-medium text-charcoal-200 mb-4 text-center">
              What You&apos;ll Get
            </h4>
            <StaggerContainer
              variants={staggerContainerFast}
              as="ul"
              className="space-y-2"
            >
              {benefits.map((benefit) => (
                <MotionItem
                  key={benefit}
                  variants={fadeInUp}
                  as="li"
                  className="flex items-center gap-3 text-xs text-charcoal-400"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-bronze-600/15 text-bronze-500 text-[10px]">
                    ✓
                  </span>
                  {benefit}
                </MotionItem>
              ))}
            </StaggerContainer>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
