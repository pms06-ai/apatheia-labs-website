'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { MobileNav } from './mobile-nav';

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/engines', label: 'Engines' },
  { href: '/research', label: 'Research' },
  { href: '/#roadmap', label: 'Roadmap' },
  { href: '/#download', label: 'Download' },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-charcoal-800 bg-charcoal-900/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[var(--container-content)] items-center justify-between px-6">
        <Link href="/" className="font-serif text-xl text-bronze-500 hover:text-bronze-400 transition-colors">
          AL | Apatheia Labs
        </Link>

        <nav className="hidden md:block" aria-label="Main navigation">
          <ul className="flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-charcoal-300 hover:text-charcoal-100 hover:bg-charcoal-800/50 transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 text-charcoal-400 hover:text-charcoal-100 hover:bg-charcoal-800 transition-colors md:hidden"
        >
          <Menu size={20} />
        </button>
      </div>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
