import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products, categories, ProductCategory } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { cn } from '@/lib/utils';
import SEO, { SITE_URL } from '@/components/SEO';
import { breadcrumbLd } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';

const categoryMeta: Record<string, { title: string; description: string }> = {
  leggings: { title: 'Леггинсы для спорта и йоги', description: 'Премиальные женские леггинсы из итальянского нейлона. Высокая посадка, бесшовный крой, идеальная посадка.' },
  tops: { title: 'Спортивные топы и бра', description: 'Поддерживающие спортивные топы для йоги, фитнеса и тренировок. Премиальные ткани, эргономичный крой.' },
  tanks: { title: 'Спортивные майки', description: 'Лёгкие спортивные майки для тренировок. Дышащие ткани, свободный или приталенный силуэт.' },
  rashguards: { title: 'Рашгарды женские', description: 'Стильные рашгарды на молнии для йоги, серфинга и фитнеса. Защита от ультрафиолета и натирания.' },
  bags: { title: 'Спортивные сумки', description: 'Стильные сумки для спортзала и йога-студии. Вместительные, износостойкие, премиум-материалы.' },
  longsleeves: { title: 'Лонгсливы', description: 'Спортивные лонгсливы из мягких премиальных тканей для тренировок и повседневной носки.' },
};


const Catalog = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') as ProductCategory | null;

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(categoryParam);

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const filtered = useMemo(() => {
    if (!selectedCategory) return products;
    return products.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const meta = selectedCategory ? categoryMeta[selectedCategory] : null;
  const seoTitle = meta?.title || 'Каталог спортивной одежды';
  const seoDesc = meta?.description || 'Премиальная женская спортивная одежда: леггинсы, топы, рашгарды, лонгсливы и сумки. Итальянские ткани, бесшовные технологии.';
  const canonical = selectedCategory ? `${SITE_URL}/catalog?category=${selectedCategory}` : `${SITE_URL}/catalog`;
  const crumbs = [{ name: 'Главная', url: '/' }, { name: 'Каталог', url: '/catalog' }];
  if (selectedCategory) crumbs.push({ name: meta?.title || selectedCategory, url: `/catalog?category=${selectedCategory}` });

  return (
    <div className="container py-8">
      <SEO title={seoTitle} description={seoDesc} canonical={canonical} jsonLd={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} className="mb-4" />
      <h1 className="text-xl md:text-2xl font-serif mb-8 uppercase tracking-[0.02em]">{meta?.title || 'Каталог'}</h1>

      {/* Category tabs */}
      <div className="mb-10 border-b border-border">
        <nav className="flex flex-wrap gap-x-6 gap-y-2 -mb-px">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              'pb-3 text-sm uppercase tracking-wider transition-colors border-b-2',
              !selectedCategory
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            Все
          </button>
          {categories.map(c => (
            <button
              key={c.slug}
              onClick={() => setSelectedCategory(c.slug)}
              className={cn(
                'pb-3 text-sm uppercase tracking-wider transition-colors border-b-2',
                selectedCategory === c.slug
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {c.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Products grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-20">Товары не найдены</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default Catalog;
