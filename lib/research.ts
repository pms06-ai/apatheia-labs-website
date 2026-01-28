import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Article, ArticleFrontmatter, Category } from './types';
import { calculateReadingTime, categorySlugToLabel } from './utils';

const RESEARCH_DIR = path.join(process.cwd(), 'research');

/**
 * Recursively find all .md files under a directory, excluding README.md.
 */
function findMarkdownFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip generated HTML directories (build artifacts)
      if (!entry.name.includes('.')) {
        results.push(...findMarkdownFiles(fullPath));
      }
    } else if (
      entry.name.endsWith('.md') &&
      entry.name !== 'README.md'
    ) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Determine category slug from a file path relative to research/.
 * Files directly in research/ get a category from their frontmatter's directory context.
 * Files in subdirectories use the first directory as category.
 * Files in nested subdirectories (e.g., methodologies/quickstart/) use the parent category.
 */
function getCategorySlug(filePath: string): string {
  const rel = path.relative(RESEARCH_DIR, filePath);
  const parts = rel.split(path.sep);
  if (parts.length === 1) {
    // Top-level files like METHODOLOGY-COMPARISON.md
    // Derive category from filename
    const name = parts[0].replace(/\.md$/, '').toLowerCase();
    if (name.includes('methodology')) return 'methodologies';
    if (name.includes('quality-control')) return 'methodologies';
    return 'foundations';
  }
  // Use first directory as category slug
  return parts[0];
}

/**
 * Parse a single markdown file into an Article object.
 */
function parseArticle(filePath: string): Article | null {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const fm = data as ArticleFrontmatter;

  if (!fm.title || !fm.category) return null;

  const categorySlug = getCategorySlug(filePath);
  const rel = path.relative(RESEARCH_DIR, filePath);
  const slug = path.basename(filePath, '.md');

  return {
    slug,
    category: categorySlug,
    categoryLabel: fm.category,
    frontmatter: {
      title: fm.title,
      description: fm.description || '',
      category: fm.category,
      status: fm.status || 'planned',
      date: fm.date ? String(fm.date) : undefined,
      tags: fm.tags,
    },
    content,
    readingTime: calculateReadingTime(content),
    filePath: rel,
  };
}

/**
 * Get all research articles sorted by date (newest first), then title.
 */
export function getAllArticles(): Article[] {
  const files = findMarkdownFiles(RESEARCH_DIR);
  const articles: Article[] = [];

  for (const file of files) {
    const article = parseArticle(file);
    if (article) articles.push(article);
  }

  return articles.sort((a, b) => {
    const dateA = a.frontmatter.date || '0000-00-00';
    const dateB = b.frontmatter.date || '0000-00-00';
    if (dateA !== dateB) return dateB.localeCompare(dateA);
    return a.frontmatter.title.localeCompare(b.frontmatter.title);
  });
}

/**
 * Get articles filtered by category slug.
 */
export function getArticlesByCategory(category: string): Article[] {
  return getAllArticles().filter((a) => a.category === category);
}

/**
 * Get a single article by category slug and article slug.
 */
export function getArticle(
  category: string,
  slug: string,
): Article | undefined {
  return getAllArticles().find(
    (a) => a.category === category && a.slug === slug,
  );
}

/**
 * Get all unique categories with labels, descriptions, and article counts.
 * Description comes from the category's README.md first paragraph if available.
 */
export function getCategories(): Category[] {
  const articles = getAllArticles();
  const categoryMap = new Map<string, { label: string; count: number }>();

  for (const article of articles) {
    const existing = categoryMap.get(article.category);
    if (existing) {
      existing.count++;
    } else {
      categoryMap.set(article.category, {
        label: article.categoryLabel,
        count: 1,
      });
    }
  }

  const categories: Category[] = [];
  for (const [slug, { label, count }] of categoryMap) {
    const description = getCategoryDescription(slug);
    // Use the label from the first article's frontmatter, fallback to slug conversion
    categories.push({
      slug,
      label: label || categorySlugToLabel(slug),
      description,
      articleCount: count,
    });
  }

  return categories.sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Read category description from its README.md first paragraph.
 */
function getCategoryDescription(categorySlug: string): string {
  const readmePath = path.join(RESEARCH_DIR, categorySlug, 'README.md');
  try {
    const raw = fs.readFileSync(readmePath, 'utf-8');
    const { data } = matter(raw);
    if (data.description) return data.description;
  } catch {
    // No README.md for this category
  }
  return '';
}

/**
 * Extract h2/h3 headings from markdown content for TOC generation.
 */
export function extractHeadings(
  markdown: string,
): { depth: number; text: string; id: string }[] {
  const headings: { depth: number; text: string; id: string }[] = [];
  const lines = markdown.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const depth = match[1].length;
      const text = match[2].replace(/\*\*/g, '').replace(/`/g, '').trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      headings.push({ depth, text, id });
    }
  }

  return headings;
}

/**
 * Generate static params for all article pages.
 */
export function generateArticleParams(): { category: string; slug: string }[] {
  return getAllArticles().map((a) => ({
    category: a.category,
    slug: a.slug,
  }));
}

/**
 * Generate static params for all category pages.
 */
export function generateCategoryParams(): { category: string }[] {
  return getCategories().map((c) => ({ category: c.slug }));
}
