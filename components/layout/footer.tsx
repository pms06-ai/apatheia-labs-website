import Link from 'next/link';

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/engines', label: 'Engines' },
  { href: '/research', label: 'Research' },
];

export function Footer() {
  return (
    <footer className="border-t border-charcoal-800 bg-charcoal-900">
      <div className="mx-auto max-w-[var(--container-content)] px-6 py-12">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <Link href="/" className="font-serif text-lg text-bronze-500 hover:text-bronze-400 transition-colors">
              Phronesis
            </Link>
            <p className="text-sm text-charcoal-500">
              Built by{' '}
              <span className="text-charcoal-400">Apatheia Labs</span>
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-charcoal-400 hover:text-charcoal-200 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 border-t border-charcoal-800 pt-6 text-center">
          <p className="text-xs text-charcoal-600">
            &copy; {new Date().getFullYear()} Apatheia Labs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
