import { useState, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, ShoppingBag, Ruler, RotateCcw, Image } from 'lucide-react';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ProductCard from '@/components/ProductCard';
import ProductImageSpin from '@/components/ProductImageSpin';
import ComboRecommendation from '@/components/ComboRecommendation';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import SEO from '@/components/SEO';
import { productLd, breadcrumbLd } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';

const ProductViewer3D = lazy(() => import('@/components/ProductViewer3D'));

const categoryNames: Record<string, string> = {
  leggings: 'Леггинсы',
  tops: 'Топы',
  tanks: 'Майки',
  rashguards: 'Рашгарды',
  bags: 'Сумки',
  longsleeves: 'Лонгсливы',
};

// Unified caption style — matches catalog category labels (uppercase, tracked, semibold)
const labelClass = 'text-xs font-semibold uppercase tracking-[0.18em] text-foreground/80';
const mutedLabelClass = 'text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground';

const ProductPage = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [selectedSize, setSelectedSize] = useState(product?.sizes[0]);
  const [view3D, setView3D] = useState(false);

  if (!product) return <div className="container py-20 text-center">Товар не найден</div>;

  const productColor = product.colors[0];

  // Find other color variants of the same colorGroup
  const otherColors = product.colorGroup
    ? products.filter(p => p.colorGroup === product.colorGroup && p.id !== product.id)
    : [];

  const related = products
    .filter(p => p.category === product.category && p.id !== product.id && p.colorGroup !== product.colorGroup)
    .slice(0, 4);
  const formatPrice = (p: number) => p.toLocaleString('ru-RU') + ' ₽';
  const fav = isFavorite(product.id);

  const categoryName = categoryNames[product.category] || 'Каталог';
  const ldProduct = productLd({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.images[0],
    category: categoryName,
  });
  const crumbs = [
    { name: 'Главная', url: '/' },
    { name: 'Каталог', url: '/catalog' },
    { name: categoryName, url: `/catalog?category=${product.category}` },
    { name: product.name, url: `/product/${product.id}` },
  ];
  const ldCrumbs = breadcrumbLd(crumbs);

  return (
    <div className="container py-8">
      <SEO
        title={`${product.name} — купить за ${product.price.toLocaleString('ru-RU')} ₽`}
        description={`${product.name}. ${product.description.slice(0, 140)}`}
        type="product"
        image={product.images[0]}
        jsonLd={[ldProduct, ldCrumbs]}
      />
      <Breadcrumbs items={crumbs} className="mb-6" />
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery / 3D Viewer */}
        <div>
          {(() => {
            const spinImgs = product.spinImages;
            const mainImg = product.images[0];
            const currentModelUrl = product.modelUrl;
            if (currentModelUrl && view3D) {
              const isRashguard = product.category === 'rashguards';
              return (
                <Suspense fallback={<Skeleton className="w-full aspect-square rounded-lg" />}>
                  <ProductViewer3D modelUrl={currentModelUrl} autoRotate={!isRashguard} cameraPosition={isRashguard ? [0, 0.2, 3] : [0, 0, 3]} />
                </Suspense>
              );
            } else if (spinImgs) {
              return <ProductImageSpin images={spinImgs} />;
            } else {
              return (
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img src={mainImg} alt={product.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                </div>
              );
            }
          })()}
          {product.modelUrl && (
            <div className="flex gap-2 mt-3 justify-center">
              <Button variant={view3D ? 'default' : 'outline'} size="sm" onClick={() => setView3D(true)} className="text-xs font-semibold uppercase tracking-[0.18em]">
                <RotateCcw className="h-4 w-4 mr-1" /> 3D
              </Button>
              <Button variant={!view3D ? 'default' : 'outline'} size="sm" onClick={() => setView3D(false)} className="text-xs font-semibold uppercase tracking-[0.18em]">
                <Image className="h-4 w-4 mr-1" /> Фото
              </Button>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className={cn(mutedLabelClass, 'mb-2')}>{categoryNames[product.category] || product.category}</p>
          <h1 className="text-3xl md:text-4xl font-serif uppercase tracking-[0.06em] mb-4">{product.name}</h1>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
            {product.oldPrice && <span className="text-lg text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-8">{product.description}</p>

          {/* Size */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className={labelClass}>Размер: {selectedSize}</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-xs font-semibold uppercase tracking-[0.18em] h-8 px-2">
                    <Ruler className="h-4 w-4 mr-1" />Таблица размеров
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="uppercase tracking-[0.06em]">Таблица размеров</DialogTitle>
                  </DialogHeader>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className={cn(mutedLabelClass, 'py-2 text-left')}>Размер</th>
                        <th className={mutedLabelClass}>Грудь</th>
                        <th className={mutedLabelClass}>Талия</th>
                        <th className={mutedLabelClass}>Бёдра</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['XS-S', '82-86', '62-66', '88-92'],
                        ['M-L', '90-94', '70-74', '96-100'],
                      ].map(([s, ...v]) => (
                        <tr key={s} className="border-b">
                          <td className="py-3 font-medium">{s}</td>
                          {v.map((x, i) => <td key={i} className="text-center">{x}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex gap-2">
              {product.sizes.map(s => (
                <Button
                  key={s}
                  variant={selectedSize === s ? 'default' : 'outline'}
                  size="sm"
                  className="h-10 min-w-16 px-3 text-xs font-semibold uppercase tracking-[0.18em]"
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <Button
              size="lg"
              className="flex-1 text-xs font-semibold uppercase tracking-[0.18em]"
              onClick={() => {
                if (selectedSize) {
                  addItem(product, selectedSize, productColor);
                  toast.success(`${product.name} добавлен в корзину`, {
                    description: selectedSize,
                  });
                }
              }}
            >
              <ShoppingBag className="h-5 w-5 mr-2" /> Добавить в корзину
            </Button>
            <Button variant="outline" size="lg" onClick={() => toggleFavorite(product.id)} aria-label="Избранное">
              <Heart className={cn('h-5 w-5', fav && 'fill-foreground text-foreground')} />
            </Button>
          </div>

          {/* Other colors */}
          {otherColors.length > 0 && (
            <div className="border-t pt-6 mb-6">
              <p className={cn(labelClass, 'mb-3')}>Смотрите в другом цвете</p>
              <div className="flex flex-wrap gap-3">
                {otherColors.map(p => (
                  <a
                    key={p.id}
                    href={`/product/${p.id}`}
                    className="group flex items-center gap-2 border border-border rounded-md px-3 py-2 hover:bg-foreground/5 transition-colors"
                    title={p.colors[0].name}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-border"
                      style={{ backgroundColor: p.colors[0].hex }}
                    />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/80 group-hover:text-foreground">
                      {p.colors[0].name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Specs */}
          <div className="border-t pt-6">
            <h3 className={cn(labelClass, 'mb-4')}>Характеристики</h3>
            <dl className="space-y-2">
              {Object.entries(product.specs).map(([k, v]) => (
                <div key={k} className="flex text-sm">
                  <dt className="w-40 text-muted-foreground">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Combo Recommendations */}
      <ComboRecommendation currentProduct={product} />

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-serif uppercase tracking-[0.06em] mb-6">С этим покупают</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;
