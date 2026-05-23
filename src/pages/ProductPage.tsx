import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import ProductCard from '@/components/ProductCard';
import ProductImageSpin from '@/components/ProductImageSpin';
import ComboRecommendation from '@/components/ComboRecommendation';
import DolyamiBadge from '@/components/DolyamiBadge';
import { cn } from '@/lib/utils';
import SEO from '@/components/SEO';
import { productLd, breadcrumbLd } from '@/lib/seo';
import Breadcrumbs from '@/components/Breadcrumbs';

const categoryNames: Record<string, string> = {
  leggings: 'Леггинсы',
  tops: 'Топы',
  tanks: 'Майки',
  rashguards: 'Рашгарды',
  bags: 'Сумки',
  longsleeves: 'Лонгсливы',
};

const labelClass = 'text-xs font-semibold uppercase tracking-[0.18em] text-foreground/80';
const mutedLabelClass = 'text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground';

const ProductPage = () => {
  const { id } = useParams();
  const baseProduct = products.find(p => p.id === id);
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  // Color variants in the same group (including this product)
  const colorVariants = baseProduct?.colorGroup
    ? products.filter(p => p.colorGroup === baseProduct.colorGroup)
    : baseProduct ? [baseProduct] : [];

  // Local state: currently displayed product variant
  const [currentId, setCurrentId] = useState(id);
  const product = products.find(p => p.id === currentId) || baseProduct;

  const [selectedSize, setSelectedSize] = useState(product?.sizes[0]);

  if (!product) return <div className="container py-20 text-center">Товар не найден</div>;

  const productColor = product.colors[0];

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
        {/* Gallery */}
        <div>
          {product.spinImages ? (
            <ProductImageSpin key={product.id} images={product.spinImages} />
          ) : (
            <div className="aspect-[2/3] overflow-hidden">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-base md:text-4xl font-serif uppercase tracking-[0.06em] leading-[0.95] mb-4">
            {product.name}
          </h1>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-base md:text-2xl font-semibold">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-xs md:text-lg text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          {/* Color swap */}
          {colorVariants.length > 1 && (
            <div className="mb-6">
              <p className={cn(labelClass, 'mb-3')}>Цвет: {productColor.name}</p>
              <div className="flex flex-wrap gap-2">
                {colorVariants.map(v => {
                  const c = v.colors[0];
                  const active = v.id === product.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        setCurrentId(v.id);
                        setSelectedSize(v.sizes[0]);
                        window.history.replaceState(null, '', `/product/${v.id}`);
                      }}
                      title={c.name}
                      aria-label={c.name}
                      className={cn(
                        'w-9 h-9 rounded-full border-2 transition-all',
                        active ? 'border-foreground scale-110' : 'border-border hover:border-foreground/60'
                      )}
                      style={{ backgroundColor: c.hex }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Size */}
          <div className="mb-6">
            <p className={cn(labelClass, 'mb-3')}>Размер: {selectedSize}</p>
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
          <div className="flex gap-3 mb-3">
            <Button
              size="lg"
              className="flex-1 text-xs font-semibold uppercase tracking-[0.18em]"
              onClick={() => {
                if (selectedSize) addItem(product, selectedSize, productColor);
              }}
            >
              <ShoppingBag className="h-5 w-5 mr-2" /> Добавить в корзину
            </Button>
            <Button variant="outline" size="lg" onClick={() => toggleFavorite(product.id)} aria-label="Избранное">
              <Heart className={cn('h-5 w-5', fav && 'fill-foreground text-foreground')} />
            </Button>
          </div>



          {/* Collapsible sections */}
          <Accordion type="multiple" className="border-t">
            <AccordionItem value="description">
              <AccordionTrigger className={cn(labelClass, 'py-4')}>
                Описание
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="specs">
              <AccordionTrigger className={cn(labelClass, 'py-4')}>
                Характеристики
              </AccordionTrigger>
              <AccordionContent>
                <dl className="space-y-2">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div key={k} className="flex text-sm">
                      <dt className="w-40 text-muted-foreground">{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sizes">
              <AccordionTrigger className={cn(labelClass, 'py-4')}>
                Размерная сетка
              </AccordionTrigger>
              <AccordionContent>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className={cn(mutedLabelClass, 'py-2 text-left')}>Размер</th>
                      <th className={mutedLabelClass}>Обхват груди</th>
                      <th className={mutedLabelClass}>Обхват талии</th>
                      <th className={mutedLabelClass}>Обхват бёдер</th>
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
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="delivery">
              <AccordionTrigger className={cn(labelClass, 'py-4')}>
                Доставка и возврат
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Доставка по России курьером и в пункты выдачи 2–5 дней.
                  Возврат и обмен в течение 14 дней.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
