'use client';

export type SortOption = 'date' | 'title' | 'category';
export type StatusFilter = '' | 'complete' | 'draft' | 'in-progress' | 'planned';

interface CategoryOption {
  slug: string;
  label: string;
}

interface FilterControlsProps {
  categories: CategoryOption[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStatus: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'complete', label: 'Complete' },
  { value: 'draft', label: 'Draft' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'planned', label: 'Planned' },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'date', label: 'Date' },
  { value: 'title', label: 'Title' },
  { value: 'category', label: 'Category' },
];

const selectClasses =
  'rounded-lg border border-charcoal-800 bg-charcoal-900 px-3 py-2 text-sm text-charcoal-200 focus:border-bronze-600/60 focus:outline-none focus:ring-1 focus:ring-bronze-600/30 transition-colors';

export function FilterControls({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
}: FilterControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Category filter */}
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className={selectClasses}
        aria-label="Filter by category"
      >
        <option value="">All categories</option>
        {categories.map((cat) => (
          <option key={cat.slug} value={cat.slug}>
            {cat.label}
          </option>
        ))}
      </select>

      {/* Status filter */}
      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
        className={selectClasses}
        aria-label="Filter by status"
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Sort control */}
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className={selectClasses}
        aria-label="Sort articles"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Sort by {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
