import { Download as DownloadIcon, Code, Monitor, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DownloadSection() {
  return (
    <section id="download" className="py-20 md:py-28 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 gradient-radial-bronze opacity-50" />
      <div className="absolute inset-0 pattern-grid opacity-20" />

      <div className="relative mx-auto max-w-[var(--container-content)] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="animate-fade-in-up inline-flex items-center gap-2 mb-4">
            <DownloadIcon size={16} className="text-bronze-500" />
            <p className="text-sm font-medium uppercase tracking-wider text-bronze-500">
              Get Started
            </p>
          </div>
          <h2 className="animate-fade-in-up delay-100 mt-3 font-serif text-3xl md:text-4xl">
            Download Phronesis
          </h2>
          <p className="animate-fade-in-up delay-200 mt-4 text-charcoal-400">
            Desktop application. Runs entirely on your machine.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-2xl gap-6 md:grid-cols-2">
          {/* Windows */}
          <div className="animate-fade-in-up delay-300 group rounded-xl border border-bronze-600/30 bg-charcoal-850 p-6 text-center transition-all hover:border-bronze-600/50 hover-lift glass animate-glow-pulse">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-bronze-600/20 to-bronze-600/10 text-bronze-400 transition-all group-hover:scale-110">
              <Monitor size={28} />
            </div>
            <h3 className="mt-5 text-lg font-medium text-charcoal-100">
              Windows
            </h3>
            <p className="mt-1 text-sm text-charcoal-400">
              Windows 10/11 (64-bit)
            </p>
            <div className="mt-5">
              <Button
                href="https://github.com/apatheia-labs/phronesis/releases/latest"
                className="w-full gap-2"
              >
                Download Latest
                <DownloadIcon size={16} />
              </Button>
            </div>
            <p className="mt-3 text-xs text-charcoal-500">
              Portable, no installer required
            </p>
          </div>

          {/* Source */}
          <div className="animate-fade-in-up delay-400 group rounded-xl border border-charcoal-800 bg-charcoal-850 p-6 text-center transition-all hover:border-bronze-600/30 hover-lift glass-subtle">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-charcoal-800 to-charcoal-850 text-charcoal-300 transition-all group-hover:from-bronze-600/20 group-hover:to-bronze-600/10 group-hover:text-bronze-400 group-hover:scale-110">
              <Code size={28} />
            </div>
            <h3 className="mt-5 text-lg font-medium text-charcoal-100">
              Build from Source
            </h3>
            <p className="mt-1 text-sm text-charcoal-400">
              Clone, build, contribute
            </p>
            <div className="mt-5">
              <Button
                href="https://github.com/apatheia-labs/phronesis"
                variant="secondary"
                className="w-full hover-glow"
              >
                View on GitHub
              </Button>
            </div>
            <p className="mt-3 text-xs text-charcoal-500">
              Requires Node.js 18+ and Rust
            </p>
          </div>
        </div>

        <div className="animate-fade-in-up delay-500 mx-auto mt-10 max-w-lg rounded-xl border border-charcoal-800 bg-charcoal-850 p-5 glass-subtle">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-charcoal-800">
              <Shield size={16} className="text-status-success" />
            </div>
            <h4 className="text-sm font-medium text-charcoal-200">
              System Requirements
            </h4>
          </div>
          <ul className="space-y-2 text-xs text-charcoal-400">
            <li className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-charcoal-500" />
              Windows 10 version 1903 or later (64-bit)
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-charcoal-500" />
              4 GB RAM minimum, 8 GB recommended
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-charcoal-500" />
              500 MB disk space
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-charcoal-500" />
              Optional: API keys for AI features (Claude, Groq, Gemini)
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
