import type { Metadata } from 'next';
import Link from 'next/link';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import {
  getArticle,
  getArticlesByCategory,
  extractHeadings,
  generateArticleParams,
} from '@/lib/research';
import { rehypeMdLinks } from '@/lib/rehype-md-links';
import { categorySlugToLabel } from '@/lib/utils';
import { Breadcrumbs } from '@/components/research/breadcrumbs';
import { ArticleMeta } from '@/components/research/article-meta';
import { TableOfContents } from '@/components/research/table-of-contents';

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  return generateArticleParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  if (!article) {
    return { title: 'Article Not Found' };
  }
  return {
    title: article.frontmatter.title,
    description: article.frontmatter.description,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { category, slug } = await params;
  const article = getArticle(category, slug);

  if (!article) {
    return (
      <div className="mx-auto max-w-[var(--container-content)] px-6 py-16">
        <h1 className="font-serif text-3xl">Article not found</h1>
        <p className="mt-4 text-charcoal-400">
          The requested article could not be found.
        </p>
      </div>
    );
  }

  const headings = extractHeadings(article.content);
  const categoryLabel = article.categoryLabel || categorySlugToLabel(category);

  const { content: renderedContent } = await compileMDX({
    source: article.content,
    options: {
      mdxOptions: {
        format: 'md',
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          [rehypeMdLinks, { category }],
        ],
      },
    },
  });

  // Find prev/next articles in same category
  const categoryArticles = getArticlesByCategory(category);
  const currentIndex = categoryArticles.findIndex((a) => a.slug === slug);
  const prev = currentIndex > 0 ? categoryArticles[currentIndex - 1] : null;
  const next =
    currentIndex < categoryArticles.length - 1
      ? categoryArticles[currentIndex + 1]
      : null;

  const githubUrl = `https://github.com/ApatheiaLabs/phronesis/blob/main/research/${article.filePath}`;

  return (
    <div className="mx-auto max-w-[var(--container-content)] px-6 py-16">
      <Breadcrumbs
        segments={[
          { label: 'Research', href: '/research' },
          { label: categoryLabel, href: `/research/${category}` },
          { label: article.frontmatter.title },
        ]}
      />

      <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-12">
        {/* Article content */}
        <article>
          <header className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl leading-tight">
              {article.frontmatter.title}
            </h1>
            {article.frontmatter.description && (
              <p className="mt-4 text-lg text-charcoal-400 leading-relaxed">
                {article.frontmatter.description}
              </p>
            )}
            <div className="mt-4">
              <ArticleMeta
                frontmatter={article.frontmatter}
                readingTime={article.readingTime}
              />
            </div>
          </header>

          <div className="prose prose-invert max-w-none">
            {renderedContent}
          </div>

          <footer className="mt-12 border-t border-charcoal-800 pt-6">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-charcoal-500 hover:text-charcoal-300 transition-colors"
            >
              View source on GitHub
            </a>

            {/* Prev/Next navigation */}
            {(prev || next) && (
              <nav className="mt-8 grid gap-4 sm:grid-cols-2">
                {prev ? (
                  <Link
                    href={`/research/${category}/${prev.slug}`}
                    className="group rounded-lg border border-charcoal-800 p-4 transition-colors hover:border-bronze-600/40"
                  >
                    <span className="text-xs text-charcoal-500">Previous</span>
                    <p className="mt-1 text-sm font-medium text-charcoal-200 group-hover:text-bronze-400 transition-colors">
                      {prev.frontmatter.title}
                    </p>
                  </Link>
                ) : (
                  <div />
                )}
                {next && (
                  <Link
                    href={`/research/${category}/${next.slug}`}
                    className="group rounded-lg border border-charcoal-800 p-4 text-right transition-colors hover:border-bronze-600/40"
                  >
                    <span className="text-xs text-charcoal-500">Next</span>
                    <p className="mt-1 text-sm font-medium text-charcoal-200 group-hover:text-bronze-400 transition-colors">
                      {next.frontmatter.title}
                    </p>
                  </Link>
                )}
              </nav>
            )}
          </footer>
        </article>

        {/* Sticky sidebar TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      </div>
    </div>
  );
}
