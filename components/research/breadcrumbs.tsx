import Link from 'next/link';

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  segments: BreadcrumbSegment[];
}

export function Breadcrumbs({ segments }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8 text-sm text-charcoal-400">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-charcoal-200 transition-colors">
            Home
          </Link>
        </li>
        {segments.map((seg, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <span aria-hidden="true" className="text-charcoal-600">/</span>
            {seg.href ? (
              <Link href={seg.href} className="hover:text-charcoal-200 transition-colors">
                {seg.label}
              </Link>
            ) : (
              <span className="text-charcoal-300">{seg.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
