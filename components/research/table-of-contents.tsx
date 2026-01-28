'use client';

import { useEffect, useState } from 'react';

interface Heading {
  depth: number;
  text: string;
  id: string;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px' },
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of Contents" className="text-sm">
      <p className="mb-3 font-medium text-charcoal-200">On this page</p>
      <ul className="space-y-1.5">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.depth === 3 ? 'pl-3' : ''}
          >
            <a
              href={`#${heading.id}`}
              className={`block leading-snug transition-colors ${
                activeId === heading.id
                  ? 'text-bronze-400'
                  : 'text-charcoal-500 hover:text-charcoal-300'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
