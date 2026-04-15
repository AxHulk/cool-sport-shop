import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products, categories, ProductCategory } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const sizes = ['XS', 'S', 'M', 'L'] as const;
const sortOptions = [
  { value: 'popular', label: 'По популярности' },
  { value: 'price-asc', label: 'Цена ↑' },
  { value: 'price-desc', label: 'Цена ↓' },
  { value: 'new', label: 'Новинки' },
];

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') as ProductCategory | null;

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(categoryParam);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sort, setSort] = useState('popular');

  const toggleSize = (s: string) => {
    setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory) result = result.filter(p => p.category === selectedCategory);
    if (selectedSizes.length) result = result.filter(p => p.sizes.some(s => selectedSizes.includes(s)));

    switch (sort) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'new': result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
    }
    return result;
  }, [selectedCategory, selectedSizes, sort]);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-serif mb-8">Каталог</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <aside className="lg:w-60 shrink-0 space-y-6">
          <div>
            <h3 className="font-sans text-sm font-semibold mb-3">Категория</h3>
            <div className="space-y-1">
              <Button
                variant={!selectedCategory ? 'secondary' : 'ghost'}
                size="sm"
                className="w-full justify-start"
                onClick={() => setSelectedCategory(null)}
              >
                Все товары
              </Button>
              {categories.map(c => (
                <Button
                  key={c.slug}
                  variant={selectedCategory === c.slug ? 'secondary' : 'ghost'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(c.slug)}
                >
                  {c.name}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-sans text-sm font-semibold mb-3">Размер</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map(s => (
                <Button
                  key={s}
                  variant={selectedSizes.includes(s) ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 w-10"
                  onClick={() => toggleSize(s)}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>

        </aside>

        {/* Products grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">{filtered.length} товаров</p>
            <div className="flex gap-2">
              {sortOptions.map(o => (
                <Button
                  key={o.value}
                  variant={sort === o.value ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setSort(o.value)}
                >
                  {o.label}
                </Button>
              ))}
            </div>
          </div>
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">Товары не найдены</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
