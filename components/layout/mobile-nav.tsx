'use client';

import { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/philosophy', label: 'Philosophy' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/engines', label: 'Engines' },
  { href: '/research', label: 'Research' },
  { href: 'https://github.com/apatheia-labs/phronesis', label: 'GitHub', external: true },
];

const ctaLink = { href: '/#waitlist', label: 'Join Waitlist' };

export function MobileNav({ open, onClose }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab' || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="absolute inset-0 bg-charcoal-900/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <nav
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className="absolute right-0 top-0 h-full w-72 bg-charcoal-850 border-l border-charcoal-800 p-6 shadow-xl"
      >
        <div className="flex justify-end mb-8">
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-2 text-charcoal-400 hover:text-charcoal-100 hover:bg-charcoal-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <ul className="flex flex-col gap-1">
          {navLinks.map(({ href, label, external }) => (
            <li key={href}>
              {external ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="block rounded-lg px-4 py-3 text-base font-medium text-charcoal-200 hover:bg-charcoal-800 hover:text-bronze-400 transition-colors"
                >
                  {label}
                </a>
              ) : (
                <Link
                  href={href}
                  onClick={onClose}
                  className="block rounded-lg px-4 py-3 text-base font-medium text-charcoal-200 hover:bg-charcoal-800 hover:text-bronze-400 transition-colors"
                >
                  {label}
                </Link>
              )}
            </li>
          ))}
          <li className="mt-4">
            <Link
              href={ctaLink.href}
              onClick={onClose}
              className="block rounded-lg bg-bronze-600 px-4 py-3 text-center text-base font-medium text-charcoal-900 hover:bg-bronze-500 transition-colors"
            >
              {ctaLink.label}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
