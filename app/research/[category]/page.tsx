import type { Metadata } from 'next';
import { getCategories, getArticlesByCategory } from '@/lib/research';
import { categorySlugToLabel } from '@/lib/utils';
import { ArticleCard } from '@/components/research/article-card';
import { Breadcrumbs } from '@/components/research/breadcrumbs';
import { generateCategoryParams } from '@/lib/research';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return generateCategoryParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const categories = getCategories();
  const cat = categories.find((c) => c.slug === category);
  const label = cat?.label || categorySlugToLabel(category);

  return {
    title: `${label} Research`,
    description: cat?.description || `Research articles in the ${label} category.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const categories = getCategories();
  const cat = categories.find((c) => c.slug === category);
  const label = cat?.label || categorySlugToLabel(category);
  const articles = getArticlesByCategory(category);

  return (
    <div className="mx-auto max-w-[var(--container-content)] px-6 py-16">
      <Breadcrumbs
        segments={[
          { label: 'Research', href: '/research' },
          { label },
        ]}
      />

      <div className="max-w-2xl">
        <h1 className="font-serif text-3xl md:text-4xl">{label}</h1>
        {cat?.description && (
          <p className="mt-4 text-charcoal-400 leading-relaxed">
            {cat.description}
          </p>
        )}
        <p className="mt-2 text-sm text-charcoal-500">
          {articles.length} {articles.length === 1 ? 'article' : 'articles'}
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
