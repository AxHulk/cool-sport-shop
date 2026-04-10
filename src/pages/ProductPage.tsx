import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Ruler, RotateCcw, Image } from 'lucide-react';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ProductCard from '@/components/ProductCard';
import ProductViewer3D from '@/components/ProductViewer3D';
import ProductImageSpin from '@/components/ProductImageSpin';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const categoryNames: Record<string, string> = {
  leggings: 'Леггинсы',
  tops: 'Топы',
  rashguards: 'Рашгарды',
  bags: 'Сумки',
};

const ProductPage = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[1] || product?.sizes[0]);
  const [view3D, setView3D] = useState(true);

  if (!product) return <div className="container py-20 text-center">Товар не найден</div>;

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const formatPrice = (p: number) => p.toLocaleString('ru-RU') + ' ₽';
  const fav = isFavorite(product.id);

  return (
    <div className="container py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery / 3D Viewer */}
        <div>
          {(() => {
            const spinImgs = (selectedColor && product.colorSpinImages?.[selectedColor.name]) || product.spinImages;
            const mainImg = (selectedColor && product.colorImages?.[selectedColor.name]) || product.images[0];
            if (spinImgs) {
              return <ProductImageSpin key={selectedColor?.name} images={spinImgs} />;
            } else if (product.modelUrl && view3D) {
              return <ProductViewer3D modelUrl={product.modelUrl} />;
            } else {
              return (
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img src={mainImg} alt={product.name} className="w-full h-full object-cover" />
                </div>
              );
            }
          })()}
          {product.modelUrl && !product.spinImages && (
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
