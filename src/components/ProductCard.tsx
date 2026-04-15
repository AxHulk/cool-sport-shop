import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const fav = isFavorite(product.id);
  const [imgLoaded, setImgLoaded] = useState(false);

  const formatPrice = (p: number) => p.toLocaleString('ru-RU') + ' ₽';

  return (
    <div className="group relative">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden rounded-lg bg-muted relative">
          {!imgLoaded && <Skeleton className="absolute inset-0 rounded-lg" />}
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            className={cn(
              "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
              !imgLoaded && "opacity-0"
            )}
          />
        </div>
        {(product.isNew || product.oldPrice) && (
          <div className="absolute top-2 left-2 flex gap-1">
            {product.isNew && <span className="bg-foreground text-background text-xs px-2 py-0.5 rounded">NEW</span>}
            {product.oldPrice && <span className="bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded">SALE</span>}
          </div>
        )}
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 bg-background/80 backdrop-blur h-8 w-8"
        onClick={() => toggleFavorite(product.id)}
      >
        <Heart className={cn("h-4 w-4", fav && "fill-accent text-accent")} />
      </Button>
      <div className="mt-3">
        <Link to={`/product/${product.id}`} className="text-sm font-medium hover:underline">
          {product.name}
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
        <div className="flex gap-1 mt-2">
          {product.colors.map(c => (
            <span key={c.name} className="w-4 h-4 rounded-full border" style={{ backgroundColor: c.hex }} title={c.name} />
          ))}
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-full mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => addItem(product, product.sizes[1] || product.sizes[0], product.colors[0])}
      >
        <ShoppingBag className="h-4 w-4 mr-1" /> В корзину
      </Button>
    </div>
  );
};

export default ProductCard;
