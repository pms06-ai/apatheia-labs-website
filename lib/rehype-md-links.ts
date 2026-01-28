import type { Root, Element } from 'hast';
import { visit } from 'unist-util-visit';

/**
 * Rehype plugin that transforms relative .md links to Next.js routes.
 *
 * Examples:
 *   ../methodologies/05-intelligence-analysis.md
 *     → /research/methodologies/05-intelligence-analysis
 *
 *   ../methodologies/05-intelligence-analysis.md#section
 *     → /research/methodologies/05-intelligence-analysis#section
 *
 *   01-cognitive-biases.md
 *     → /research/{current-category}/01-cognitive-biases
 *
 *   ../library/README.md
 *     → /research/library
 */
export function rehypeMdLinks(options?: { category?: string }) {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (
        node.tagName === 'a' &&
        node.properties &&
        typeof node.properties.href === 'string'
      ) {
        const href = node.properties.href;
        // Only transform relative .md links (not external or already-absolute)
        if (href.includes('.md') && !href.startsWith('http') && !href.startsWith('/')) {
          node.properties.href = transformMdLink(href, options?.category);
        }
      }
    });
  };
}

function transformMdLink(href: string, currentCategory?: string): string {
  // Separate hash fragment
  const [pathPart, hash] = href.split('#');
  const fragment = hash ? `#${hash}` : '';

  // Normalize path: remove ./ prefix, resolve ../ segments
  const cleaned = pathPart.replace(/^\.\//, '');

  // Handle README.md links → category index
  if (cleaned.endsWith('README.md')) {
    const dir = cleaned.replace(/\/?README\.md$/, '').replace(/^\.\.\//, '');
    if (dir) {
      return `/research/${dir}${fragment}`;
    }
    return `/research${fragment}`;
  }

  // Remove .md extension
  const withoutExt = cleaned.replace(/\.md$/, '');

  // Handle relative paths with ../
  if (withoutExt.startsWith('../')) {
    const resolved = withoutExt.replace(/^\.\.\//, '');
    return `/research/${resolved}${fragment}`;
  }

  // Same-directory reference (e.g., 01-cognitive-biases.md within cognitive-science/)
  if (currentCategory) {
    return `/research/${currentCategory}/${withoutExt}${fragment}`;
  }

  return `/research/${withoutExt}${fragment}`;
}
