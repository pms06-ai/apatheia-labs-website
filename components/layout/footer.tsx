'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Mail } from 'lucide-react';

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/engines', label: 'Engines' },
  { href: '/research', label: 'Research' },
];

const socialLinks = [
  {
    href: 'https://github.com/apatheia-labs',
    label: 'GitHub',
    icon: <Github size={18} />,
  },
  {
    href: 'mailto:contact@apatheialabs.com',
    label: 'Email',
    icon: <Mail size={18} />,
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-charcoal-800 bg-charcoal-900">
      {/* Subtle gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bronze-600/30 to-transparent" />

      <div className="relative mx-auto max-w-[var(--container-content)] px-6 py-12">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <Link href="/" className="group">
              <motion.span
                className="font-serif text-lg text-bronze-500 hover:text-bronze-400 transition-colors"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                Apatheia Labs
              </motion.span>
            </Link>
            <p className="text-sm text-charcoal-500 italic">
              Veritas Numquam Perit
            </p>
            <p className="text-xs text-charcoal-600 mt-1">
              Clarity without distortion
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-2">
              {socialLinks.map(({ href, label, icon }) => (
                <motion.a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-charcoal-800 text-charcoal-400 transition-all hover:bg-charcoal-700 hover:text-bronze-400"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-charcoal-400 hover:text-charcoal-200 transition-colors relative group"
                  >
                    {label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-bronze-500 transition-all group-hover:w-full" />
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
