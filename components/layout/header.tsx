'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { MobileNav } from './mobile-nav';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/philosophy', label: 'Philosophy' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/engines', label: 'Engines' },
  { href: '/research', label: 'Research' },
];

const ctaLink = { href: '/#waitlist', label: 'Join Waitlist' };

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled
          ? 'border-b border-charcoal-800 bg-charcoal-900/95 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-[var(--container-content)] items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2">
          <motion.span
            className="font-serif text-xl text-bronze-500 transition-colors group-hover:text-bronze-400"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            AL | Apatheia Labs
          </motion.span>
        </Link>

        <nav className="hidden md:block" aria-label="Main navigation">
          <ul className="flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-charcoal-300 hover:text-charcoal-100 hover:bg-charcoal-800/50 transition-all"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={ctaLink.href}
                className="ml-2 rounded-lg bg-gradient-to-r from-bronze-600 to-bronze-500 px-4 py-2 text-sm font-medium text-white hover:from-bronze-500 hover:to-bronze-400 transition-all"
              >
                {ctaLink.label}
              </Link>
            </li>
          </ul>
        </nav>

        <motion.button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 text-charcoal-400 hover:text-charcoal-100 hover:bg-charcoal-800 transition-all md:hidden"
          whileTap={{ scale: 0.95 }}
        >
          <Menu size={20} />
        </motion.button>
      </div>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
