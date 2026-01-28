#!/usr/bin/env node
/**
 * Apatheia Labs - Static Site Build Script
 * Converts Markdown research articles to HTML with TOC generation
 */

import { glob } from 'glob';
import matter from 'gray-matter';
import { Marked, Renderer } from 'marked';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, basename, join, relative, posix } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuration
const CONFIG = {
  baseUrl: 'https://apatheialabs.com',
  sourceDir: join(__dirname, 'research'),
  templatesDir: join(__dirname, 'templates'),
  githubBase: 'https://github.com/apatheia-labs/phronesis/blob/main/website/research',
};

// Load templates
function loadTemplates() {
  const articleTemplate = readFileSync(join(CONFIG.templatesDir, 'article.html'), 'utf8');
  const headerPartial = readFileSync(join(CONFIG.templatesDir, 'partials', 'header.html'), 'utf8');
  const footerPartial = readFileSync(join(CONFIG.templatesDir, 'partials', 'footer.html'), 'utf8');
  return { articleTemplate, headerPartial, footerPartial };
}

// Consistent ID generation for headings
function generateId(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

// Get configured marked instance for a specific file
function getMarkedInstance(relativePath) {
  const renderer = new Renderer();

  // Override heading renderer to use consistent IDs
  renderer.heading = ({ text, depth }) => {
    const id = generateId(text);
    return `<h${depth} id="${id}">${text}</h${depth}>\n`;
  };

  // Convert .md links to directory paths (marked v15 API - receives object)
  renderer.link = ({ href, title, text }) => {
    // Skip if it's an external link
    if (href && (href.startsWith('http:') || href.startsWith('https:'))) {
      const titleAttr = title ? ` title="${title}"` : '';
      return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
    }

    if (href && typeof href === 'string' && href.endsWith('.md')) {
      // Convert ./03-legal-ediscovery.md to /research/methodologies/03-legal-ediscovery/
      let target = href.replace(/\.md$/, '/');
      
      // If it's a relative path, we need to resolve it relative to the current file
      // and then make it absolute from /research/
      const currentDir = dirname(relativePath).replace(/\\/g, '/');
      let absolutePath = posix.normalize(posix.join('/research', currentDir, target));
      
      // Strip /README/ from the end of canonical paths
      if (absolutePath.toLowerCase().endsWith('/readme/')) {
        absolutePath = absolutePath.slice(0, -7);
      } else if (absolutePath.toLowerCase().endsWith('/readme')) {
        absolutePath = absolutePath.slice(0, -6);
      }
      
      href = absolutePath.endsWith('/') ? absolutePath : absolutePath + '/';
    }
    const titleAttr = title ? ` title="${title}"` : '';
    const target = href && typeof href === 'string' && href.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${href}"${titleAttr}${target}>${text}</a>`;
  };

  return new Marked({
    renderer,
    gfm: true,
    breaks: false,
  });
}

// Extract headings for TOC
function extractHeadings(markdown) {
  const headings = [];
  const lines = markdown.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = generateId(text);
      headings.push({ level, text, id });
    }
  }

  return headings;
}

// Generate TOC HTML from headings
function generateTOC(headings) {
  if (headings.length === 0) return '';

  let html = '<ul>\n';
  let currentLevel = headings[0]?.level || 2;

  for (const heading of headings) {
    if (heading.level > currentLevel) {
      html += '<ul>\n';
    } else if (heading.level < currentLevel) {
      const diff = currentLevel - heading.level;
      for (let i = 0; i < diff; i++) {
        html += '</ul>\n';
      }
    }
    currentLevel = heading.level;
    html += `<li><a href="#${heading.id}">${heading.text}</a></li>\n`;
  }

  // Close remaining open lists
  while (currentLevel > (headings[0]?.level || 2)) {
    html += '</ul>\n';
    currentLevel--;
  }

  html += '</ul>';
  return html;
}

// Generate breadcrumbs from path
function generateBreadcrumbs(relativePath) {
  const parts = relativePath.split('/').filter(Boolean);
  parts.pop(); // Remove filename

  const crumbs = ['Research'];
  for (const part of parts) {
    // Convert path segment to title case
    const title = part
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    crumbs.push(title);
  }

  return crumbs.join(' / ');
}

// Generate meta tags HTML
function generateMetaTags(frontmatter) {
  const tags = [];

  if (frontmatter.category) {
    tags.push(`<span>${frontmatter.category}</span>`);
  }

  if (frontmatter.status) {
    const statusLabel = frontmatter.status === 'complete' ? 'Complete' :
                        frontmatter.status === 'draft' ? 'Draft' :
                        frontmatter.status;
    tags.push(`<span>${statusLabel}</span>`);
  }

  tags.push('<span>Open Source</span>');

  return tags.join('\n            ');
}

// Process a single markdown file
function processMarkdownFile(mdPath, templates) {
  const content = readFileSync(mdPath, 'utf8');
  const { data: frontmatter, content: markdown } = matter(content);

  // Skip files without frontmatter title
  if (!frontmatter.title) {
    console.log(`  Skipping ${mdPath} (no frontmatter)`);
    return null;
  }

  // Calculate paths (normalize to forward slashes for URLs)
  const relativePath = relative(CONFIG.sourceDir, mdPath).replace(/\\/g, '/');
  const dirName = dirname(relativePath);
  const baseName = basename(relativePath, '.md');
  const isReadme = baseName.toLowerCase() === 'readme';
  
  const outputDir = isReadme
    ? join(CONFIG.sourceDir, dirName)
    : join(CONFIG.sourceDir, dirName, baseName);
    
  const outputPath = join(outputDir, 'index.html');
  
  // Clean canonical path (no /./ and handle README)
  let canonicalPath;
  if (isReadme) {
    canonicalPath = dirName === '.' ? '/research/' : `/research/${dirName}/`;
  } else {
    canonicalPath = dirName === '.' 
      ? `/research/${baseName}/`
      : `/research/${dirName}/${baseName}/`;
  }

  // Generate components
  const markedInstance = getMarkedInstance(relativePath);
  const headings = extractHeadings(markdown);
  const toc = generateTOC(headings);
  const htmlContent = markedInstance.parse(markdown);
  const breadcrumbs = generateBreadcrumbs(relativePath);
  const metaTags = generateMetaTags(frontmatter);

  // Calculate source URL for GitHub
  const sourceUrl = `${CONFIG.githubBase}/${relativePath.replace(/\\/g, '/')}`;

  // Build final HTML
  let html = templates.articleTemplate
    .replace(/\{\{title\}\}/g, frontmatter.title)
    .replace(/\{\{description\}\}/g, frontmatter.description || '')
    .replace(/\{\{canonical\}\}/g, `${CONFIG.baseUrl}${canonicalPath}`)
    .replace(/\{\{breadcrumbs\}\}/g, breadcrumbs)
    .replace(/\{\{meta\}\}/g, metaTags)
    .replace(/\{\{toc\}\}/g, toc)
    .replace(/\{\{content\}\}/g, htmlContent)
    .replace(/\{\{sourceUrl\}\}/g, sourceUrl)
    .replace(/\{\{header\}\}/g, templates.headerPartial)
    .replace(/\{\{footer\}\}/g, templates.footerPartial);

  // Ensure output directory exists
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Write output file
  writeFileSync(outputPath, html);

  // Handle date - ensure it's a string in YYYY-MM-DD format
  let lastmod = new Date().toISOString().split('T')[0];
  if (frontmatter.date) {
    if (typeof frontmatter.date === 'string') {
      lastmod = frontmatter.date;
    } else if (frontmatter.date instanceof Date) {
      lastmod = frontmatter.date.toISOString().split('T')[0];
    }
  }

  return {
    path: canonicalPath,
    title: frontmatter.title,
    description: frontmatter.description || '',
    category: frontmatter.category || '',
    status: frontmatter.status || 'draft',
    lastmod,
  };
}

// Generate sitemap.xml
function generateSitemap(pages) {
  const staticPages = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/research/', priority: '0.9', changefreq: 'weekly' },
    { path: '/404.html', priority: '0.1', changefreq: 'yearly' },
  ];

  const allPages = [
    ...staticPages,
    ...pages.map(p => ({ ...p, priority: '0.7', changefreq: 'monthly' })),
  ];

  const today = new Date().toISOString().split('T')[0];
  const urlEntries = allPages.map(page => {
    const lastmod = page.lastmod || today;
    return `  <url>
    <loc>${CONFIG.baseUrl}${page.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  writeFileSync(join(__dirname, 'sitemap.xml'), sitemap);
  console.log(`Generated sitemap.xml with ${allPages.length} URLs`);
}

/**
 * Generate metadata.json for search and dynamic indices
 */
function generateMetadata(pages) {
  const metadata = {
    updated: new Date().toISOString(),
    pages: pages.filter(p => p.path.startsWith('/research/'))
  };
  
  writeFileSync(join(CONFIG.sourceDir, 'metadata.json'), JSON.stringify(metadata, null, 2));
  console.log(`Generated research/metadata.json with ${metadata.pages.length} entries`);
}

// Main build function
async function build() {
  console.log('Apatheia Labs - Building research articles...\n');

  const sitemapOnly = process.argv.includes('--sitemap-only');

  // Load templates
  const templates = loadTemplates();

  // Find all markdown files (exclude INDEX.md)
  const mdFiles = await glob('**/*.md', {
    cwd: CONFIG.sourceDir,
    ignore: ['**/INDEX.md', 'node_modules/**'],
  });

  console.log(`Found ${mdFiles.length} markdown files\n`);

  const generatedPages = [];

  if (!sitemapOnly) {
    for (const mdFile of mdFiles) {
      const fullPath = join(CONFIG.sourceDir, mdFile);
      console.log(`Processing: ${mdFile}`);

      const result = processMarkdownFile(fullPath, templates);
      if (result) {
        generatedPages.push(result);
        console.log(`  -> Generated: ${result.path}`);
      }
    }

    console.log(`\nGenerated ${generatedPages.length} HTML pages`);
  }

  // Generate sitemap
  generateSitemap(generatedPages);
  
  // Generate metadata
  if (!sitemapOnly) {
    generateMetadata(generatedPages);
  }

  console.log('\nBuild complete!');
}

// Run build
build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
