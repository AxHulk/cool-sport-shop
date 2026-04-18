import { useState, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
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

const ProductPage = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[1] || product?.sizes[0]);
  const [view3D, setView3D] = useState(false);

  if (!product) return <div className="container py-20 text-center">Товар не найден</div>;

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
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
            const spinImgs = (selectedColor && product.colorSpinImages?.[selectedColor.name]) || product.spinImages;
            const mainImg = (selectedColor && product.colorImages?.[selectedColor.name]) || product.images[0];
            const currentModelUrl = (selectedColor && product.colorModelUrls?.[selectedColor.name]) || product.modelUrl;
            if (currentModelUrl && view3D) {
              const isRashguard = product.category === 'rashguards';
              return (
                <Suspense fallback={<Skeleton className="w-full aspect-square rounded-lg" />}>
                  <ProductViewer3D key={selectedColor?.name} modelUrl={currentModelUrl} autoRotate={!isRashguard} cameraPosition={isRashguard ? [0, 0.2, 3] : [0, 0, 3]} />
                </Suspense>
              );
            } else if (spinImgs) {
              return <ProductImageSpin key={selectedColor?.name} images={spinImgs} />;
            } else {
              return (
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img src={mainImg} alt={product.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                </div>
              );
            }
          })()}
          {(product.modelUrl || product.colorModelUrls) && (
            <div className="flex gap-2 mt-3 justify-center">
              <Button variant={view3D ? 'default' : 'outline'} size="sm" onClick={() => setView3D(true)}>
                <RotateCcw className="h-4 w-4 mr-1" /> 3D
              </Button>
              <Button variant={!view3D ? 'default' : 'outline'} size="sm" onClick={() => setView3D(false)}>
                <Image className="h-4 w-4 mr-1" /> Фото
              </Button>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-muted-foreground mb-1">{categoryNames[product.category] || product.category}</p>
          <h1 className="text-3xl font-serif mb-3">{product.name}</h1>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
            {product.oldPrice && <span className="text-lg text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>}
          </div>

          <p className="text-muted-foreground mb-6">{product.description}</p>

          {/* Color */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Цвет: {selectedColor?.name}</p>
            <div className="flex gap-2">
              {product.colors.map(c => (
                <button
                  key={c.name}
                  className={cn("w-8 h-8 rounded-full border-2 transition-all", selectedColor?.name === c.name ? 'border-foreground scale-110' : 'border-transparent')}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => setSelectedColor(c)}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Размер: {selectedSize}</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm"><Ruler className="h-4 w-4 mr-1" />Таблица размеров</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Таблица размеров</DialogTitle></DialogHeader>
                  <table className="w-full text-sm">
                    <thead><tr className="border-b"><th className="py-2 text-left">Размер</th><th>Грудь</th><th>Талия</th><th>Бёдра</th></tr></thead>
                    <tbody>
                      {[['XS','80-84','60-64','86-90'],['S','84-88','64-68','90-94'],['M','88-92','68-72','94-98'],['L','92-96','72-76','98-102'],['XL','96-100','76-80','102-106']].map(([s,...v]) => (
                        <tr key={s} className="border-b"><td className="py-2 font-medium">{s}</td>{v.map((x,i)=><td key={i} className="text-center">{x}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex gap-2">
              {product.sizes.map(s => (
                <Button key={s} variant={selectedSize === s ? 'default' : 'outline'} size="sm" className="h-10 w-12" onClick={() => setSelectedSize(s)}>
                  {s}
                </Button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <Button size="lg" className="flex-1" onClick={() => {
              if (selectedColor && selectedSize) {
                addItem(product, selectedSize, selectedColor);
                toast.success(`${product.name} добавлен в корзину`, {
                  description: `${selectedColor.name}, ${selectedSize}`,
                });
              }
            }}>
              <ShoppingBag className="h-5 w-5 mr-2" /> Добавить в корзину
            </Button>
            <Button variant="outline" size="lg" onClick={() => toggleFavorite(product.id)}>
              <Heart className={cn("h-5 w-5", fav && "fill-accent text-accent")} />
            </Button>
          </div>

          {/* Specs */}
          <div className="border-t pt-6">
            <h3 className="font-sans font-semibold mb-3">Характеристики</h3>
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
          <h2 className="text-2xl font-serif mb-6">С этим покупают</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;
