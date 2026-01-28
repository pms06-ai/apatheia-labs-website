import Link from 'next/link';
import type { Category } from '@/lib/types';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/research/${category.slug}`}
      className="group block rounded-xl border border-charcoal-800 bg-charcoal-850 p-6 transition-colors hover:border-bronze-600/40"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-charcoal-100 group-hover:text-bronze-400 transition-colors">
          {category.label}
        </h3>
        <span className="text-xs text-charcoal-500">
          {category.articleCount} {category.articleCount === 1 ? 'article' : 'articles'}
        </span>
      </div>
      {category.description && (
        <p className="mt-3 text-sm leading-relaxed text-charcoal-400">
          {category.description}
        </p>
      )}
    </Link>
  );
}
