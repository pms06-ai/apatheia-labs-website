import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx and tailwind-merge.
 * Handles conditional classes and resolves conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate estimated reading time in minutes.
 * Uses ~200 words per minute for technical content.
 */
export function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Convert a category directory name to a display label.
 * e.g. "cognitive-science" → "Cognitive Science"
 */
export function categorySlugToLabel(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Derive a URL-safe slug from a markdown filename.
 * Strips the .md extension and any leading directory path.
 */
export function filenameToSlug(filename: string): string {
  return filename.replace(/\.md$/, '').split('/').pop()!;
}

/**
 * Format an ISO date string for display.
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
