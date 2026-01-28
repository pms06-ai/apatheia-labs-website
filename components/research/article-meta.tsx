import type { ArticleFrontmatter } from '@/lib/types';
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

interface ArticleMetaProps {
  frontmatter: ArticleFrontmatter;
  readingTime: number;
}

export function ArticleMeta({ frontmatter, readingTime }: ArticleMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <Badge variant={statusVariant[frontmatter.status] ?? 'default'}>
        {statusLabel[frontmatter.status] ?? frontmatter.status}
      </Badge>
      <Badge variant="bronze">{frontmatter.category}</Badge>
      {frontmatter.date && (
        <span className="text-charcoal-400">{formatDate(frontmatter.date)}</span>
      )}
      <span className="text-charcoal-500">{readingTime} min read</span>
    </div>
  );
}
