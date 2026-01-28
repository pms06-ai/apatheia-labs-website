'use client';

import { Sparkles, Mail, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DownloadSection() {
  return (
    <section id="waitlist" className="py-20 md:py-28 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 gradient-radial-bronze opacity-50" />
      <div className="absolute inset-0 pattern-grid opacity-20" />

      <div className="relative mx-auto max-w-[var(--container-content)] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="animate-fade-in-up inline-flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-bronze-500" />
            <p className="text-sm font-medium uppercase tracking-wider text-bronze-500">
              Coming Soon
            </p>
          </div>
          <h2 className="animate-fade-in-up delay-100 mt-3 font-serif text-3xl md:text-4xl">
            Join the Waitlist
          </h2>
          <p className="animate-fade-in-up delay-200 mt-4 text-charcoal-400">
            Be the first to know when Phronesis launches. Get early access and
            exclusive updates.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-md">
          <div className="animate-fade-in-up delay-300 rounded-xl border border-bronze-600/30 bg-charcoal-850 p-8 glass animate-glow-pulse">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-bronze-600/20 to-bronze-600/10 text-bronze-400">
                <Bell size={28} />
              </div>
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
        </div>

        {/* Features preview */}
        <div className="animate-fade-in-up delay-500 mx-auto mt-10 max-w-lg">
          <div className="rounded-xl border border-charcoal-800 bg-charcoal-850 p-5 glass-subtle">
            <h4 className="text-sm font-medium text-charcoal-200 mb-4 text-center">
              What You&apos;ll Get
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-400">
              <li className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-bronze-600/20 text-bronze-500 text-[10px]">✓</span>
                Early access to Phronesis before public launch
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-bronze-600/20 text-bronze-500 text-[10px]">✓</span>
                Exclusive updates on development progress
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-bronze-600/20 text-bronze-500 text-[10px]">✓</span>
                Priority support and feedback opportunities
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-bronze-600/20 text-bronze-500 text-[10px]">✓</span>
                Local-first: Your documents never leave your machine
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
