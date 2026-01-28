'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchBar } from './search-bar';
import { FilterControls, type SortOption, type StatusFilter } from './filter-controls';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

/**
 * Serializable article metadata passed from the server component.
 * Excludes `content` (raw markdown) to keep the payload small.
 */
export interface ArticleSummary {
  slug: string;
  category: string;
  categoryLabel: string;
  title: string;
  description: string;
  status: string;
  date?: string;
  tags?: string[];
  readingTime: number;
}

interface CategoryOption {
  slug: string;
  label: string;
}

interface ResearchHubInteractiveProps {
  articles: ArticleSummary[];
  categories: CategoryOption[];
}

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

export function ResearchHubInteractive({
  articles,
  categories,
}: ResearchHubInteractiveProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial state from URL search params
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') ?? '',
  );
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>(
    (searchParams.get('status') as StatusFilter) ?? '',
  );
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get('sort') as SortOption) ?? 'date',
  );

  // Sync state to URL search params
  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      const str = params.toString();
      router.replace(str ? `?${str}` : '/research', { scroll: false });
    },
    [router, searchParams],
  );

  function handleQueryChange(q: string) {
    setQuery(q);
    updateParams({ q });
  }

  function handleCategoryChange(cat: string) {
    setSelectedCategory(cat);
    updateParams({ category: cat });
  }

  function handleStatusChange(status: StatusFilter) {
    setSelectedStatus(status);
    updateParams({ status });
  }

  function handleSortChange(sort: SortOption) {
    setSortBy(sort);
    updateParams({ sort: sort === 'date' ? '' : sort });
  }

  // Filter and sort articles
  const filtered = useMemo(() => {
    let result = articles;

    // Text search across title, description, tags
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.tags?.some((t) => t.toLowerCase().includes(q)),
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter((a) => a.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus) {
      result = result.filter((a) => a.status === selectedStatus);
    }

    // Sort
    const sorted = [...result];
    if (sortBy === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'category') {
      sorted.sort((a, b) => {
        const catCmp = a.categoryLabel.localeCompare(b.categoryLabel);
        if (catCmp !== 0) return catCmp;
        return a.title.localeCompare(b.title);
      });
    }
    // 'date' is the default sort from the server, keep as-is

    return sorted;
  }, [articles, query, selectedCategory, selectedStatus, sortBy]);

  const hasFilters = query || selectedCategory || selectedStatus;

  return (
    <div className="mt-10">
      {/* Search and filters */}
      <div className="space-y-4">
        <SearchBar value={query} onChange={handleQueryChange} />
        <FilterControls
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />
      </div>

      {/* Results summary */}
      <p className="mt-6 text-sm text-charcoal-500">
        {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
        {hasFilters ? ' matching filters' : ''}
      </p>

      {/* Article list */}
      {filtered.length > 0 ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          {filtered.map((a) => (
            <Link
              key={`${a.category}/${a.slug}`}
              href={`/research/${a.category}/${a.slug}`}
              className="group block rounded-xl border border-charcoal-800 bg-charcoal-850 p-6 transition-colors hover:border-bronze-600/40"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={statusVariant[a.status] ?? 'default'}>
                  {statusLabel[a.status] ?? a.status}
                </Badge>
                <Badge variant="bronze">{a.categoryLabel}</Badge>
                <span className="text-xs text-charcoal-500">
                  {a.readingTime} min read
                </span>
              </div>
              <h3 className="mt-3 font-medium text-charcoal-100 group-hover:text-bronze-400 transition-colors">
                {a.title}
              </h3>
              {a.description && (
                <p className="mt-2 text-sm leading-relaxed text-charcoal-400 line-clamp-2">
                  {a.description}
                </p>
              )}
              {a.date && (
                <p className="mt-3 text-xs text-charcoal-500">
                  {formatDate(a.date)}
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-8 text-center">
          <p className="text-charcoal-400">
            No articles match your filters.
          </p>
          {hasFilters && (
            <button
              onClick={() => {
                setQuery('');
                setSelectedCategory('');
                setSelectedStatus('');
                setSortBy('date');
                router.replace('/research', { scroll: false });
              }}
              className="mt-3 text-sm text-bronze-400 hover:text-bronze-300 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
