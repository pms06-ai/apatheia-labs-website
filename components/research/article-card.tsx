import Link from 'next/link';
import type { Article } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

const statusVariant: Record<string, 'success' | 'info' | 'medium' | 'default'> = {
  complete: 'success',
  draft: 'medium',
  'in-progress': 'info',
  planned: 'default',
};

const statusLabel: Record<string, string> = {
  complete: 'Complete',
  draft: 'Draft',
  'in-progress': 'In Progress',
  planned: 'Planned',
};

interface ArticleCardProps {
  article: Article;
  showCategory?: boolean;
}

export function ArticleCard({ article, showCategory = false }: ArticleCardProps) {
  const { frontmatter, category, slug, readingTime } = article;

  return (
    <Link
      href={`/research/${category}/${slug}`}
      className="group block rounded-xl border border-charcoal-800 bg-charcoal-850 p-6 transition-colors hover:border-bronze-600/40"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={statusVariant[frontmatter.status] ?? 'default'}>
          {statusLabel[frontmatter.status] ?? frontmatter.status}
        </Badge>
        {showCategory && (
          <Badge variant="bronze">{frontmatter.category}</Badge>
        )}
        <span className="text-xs text-charcoal-500">
          {readingTime} min read
        </span>
      </div>
      <h3 className="mt-3 font-medium text-charcoal-100 group-hover:text-bronze-400 transition-colors">
        {frontmatter.title}
      </h3>
      {frontmatter.description && (
        <p className="mt-2 text-sm leading-relaxed text-charcoal-400 line-clamp-2">
          {frontmatter.description}
        </p>
      )}
      {frontmatter.date && (
        <p className="mt-3 text-xs text-charcoal-500">
          {formatDate(frontmatter.date)}
        </p>
      )}
    </Link>
  );
}
