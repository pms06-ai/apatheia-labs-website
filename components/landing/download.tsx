import { Download as DownloadIcon, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DownloadSection() {
  return (
    <section id="download" className="py-20 md:py-28">
      <div className="mx-auto max-w-[var(--container-content)] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-bronze-500">
            Get Started
          </p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">
            Download Phronesis
          </h2>
          <p className="mt-4 text-charcoal-400">
            Desktop application. Runs entirely on your machine.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-2xl gap-6 md:grid-cols-2">
          {/* Windows */}
          <div className="rounded-xl border border-bronze-600/30 bg-charcoal-850 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-charcoal-800 text-charcoal-300">
              <DownloadIcon size={24} />
            </div>
            <h3 className="mt-4 text-lg font-medium text-charcoal-100">
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
          <div className="rounded-xl border border-charcoal-800 bg-charcoal-850 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-charcoal-800 text-charcoal-300">
              <Code size={24} />
            </div>
            <h3 className="mt-4 text-lg font-medium text-charcoal-100">
              Build from Source
            </h3>
            <p className="mt-1 text-sm text-charcoal-400">
              Clone, build, contribute
            </p>
            <div className="mt-5">
              <Button
                href="https://github.com/apatheia-labs/phronesis"
                variant="secondary"
                className="w-full"
              >
                View on GitHub
              </Button>
            </div>
            <p className="mt-3 text-xs text-charcoal-500">
              Requires Node.js 18+ and Rust
            </p>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-lg rounded-lg border border-charcoal-800 bg-charcoal-850 p-5">
          <h4 className="text-sm font-medium text-charcoal-200">
            System Requirements
          </h4>
          <ul className="mt-3 space-y-1.5 text-xs text-charcoal-400">
            <li>Windows 10 version 1903 or later (64-bit)</li>
            <li>4 GB RAM minimum, 8 GB recommended</li>
            <li>500 MB disk space</li>
            <li>Optional: API keys for AI features (Claude, Groq, Gemini)</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
