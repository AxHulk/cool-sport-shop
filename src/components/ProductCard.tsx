import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Product, ProductSize } from '@/data/products';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const ProductCard = ({ product }: { product: Product }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addItem } = useCart();
  const fav = isFavorite(product.id);
  const defaultColor = product.colors[0];

  const handleQuickAdd = (e: React.MouseEvent, size: ProductSize) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, size, defaultColor);
  };
  const [imgLoaded, setImgLoaded] = useState(false);
  const [frame, setFrame] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const images = product.spinImages && product.spinImages.length > 0 ? product.spinImages : product.images;
  const total = images.length;

  const formatPrice = (p: number) => p.toLocaleString('ru-RU') + ' ₽';

  const updateFrameFromX = (clientX: number, target: HTMLElement) => {
    if (total <= 1) return;
    const rect = target.getBoundingClientRect();
    const x = clientX - rect.left;
    const idx = Math.floor((x / rect.width) * total);
    setFrame(Math.max(0, Math.min(total - 1, idx)));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) =>
    updateFrameFromX(e.clientX, e.currentTarget);
  const handleMouseLeave = () => setFrame(0);
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) =>
    updateFrameFromX(e.touches[0].clientX, e.currentTarget);
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) =>
    updateFrameFromX(e.touches[0].clientX, e.currentTarget);

  return (
    <div className="group">
      <div
        ref={containerRef}
        className="relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Tick indicators above image */}
        {total > 1 && (
          <div className="absolute top-2 left-2 right-2 z-10 flex gap-1 px-1">
            {images.map((_, i) => (
              <span
                key={i}
                className={cn(
                  'flex-1 transition-all duration-200',
                  i === frame ? 'h-0.5 bg-foreground' : 'h-px bg-foreground/25'
                )}
              />
            ))}
          </div>
        )}

        <Link to={`/product/${product.id}`} className="block">
          <div className="aspect-[3/4] overflow-hidden bg-muted/40 relative">
            {!imgLoaded && <Skeleton className="absolute inset-0" />}
            {images.map((src, i) => (
              <img
                key={src + i}
                src={src}
                alt={product.name}
                width={600}
                height={800}
                loading="lazy"
                decoding="async"
                onLoad={i === 0 ? () => setImgLoaded(true) : undefined}
                className={cn(
                  'absolute inset-0 w-full h-full object-cover transition-opacity duration-200',
                  i === frame ? 'opacity-100' : 'opacity-0',
                  !imgLoaded && i === 0 && 'opacity-0'
                )}
              />
            ))}
          </div>

          {product.oldPrice && (
            <div className="absolute top-4 left-3 flex flex-col gap-1">
              <span className="bg-accent text-accent-foreground text-[10px] uppercase tracking-wider px-2 py-0.5">
                Sale
              </span>
            </div>
          )}
        </Link>

        <button
          aria-label="В избранное"
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product.id);
          }}
          className="absolute top-3 right-3 p-1.5 transition-transform hover:scale-110"
          style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))' }}
        >
          <Heart className={cn('h-5 w-5 text-foreground', fav && 'fill-accent text-accent')} />
        </button>

        <div className="hidden md:flex absolute bottom-3 left-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 bg-foreground/85 text-background backdrop-blur-sm flex-col items-center gap-2 py-3 px-3 pointer-events-none group-hover:pointer-events-auto">
          <span className="text-[10px] uppercase tracking-[0.22em] font-semibold">Добавить в корзину:</span>
          <div className="flex gap-2 w-full justify-center">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={(e) => handleQuickAdd(e, size)}
                className="flex-1 max-w-[80px] text-xs uppercase tracking-wider font-semibold py-1.5 border border-background/40 hover:bg-background hover:text-foreground transition-colors"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 text-center">
        <Link
          to={`/product/${product.id}`}
          className="block text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          {product.name}
        </Link>
        <div className="mt-1 flex items-center justify-center gap-2">
          <span className="text-xs md:text-sm font-semibold">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-[10px] md:text-xs text-muted-foreground line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
