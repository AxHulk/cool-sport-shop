import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import logo from '@/assets/logo.webp';
import { useFavorites } from '@/context/FavoritesContext';
import { cn } from '@/lib/utils';

const iconButtonClass =
  'relative inline-flex items-center justify-center h-10 w-10 rounded-md text-foreground/80 transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

const Header = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const { favorites } = useFavorites();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container grid grid-cols-3 items-center h-16">
        <div className="flex items-center justify-start">
          <Link
            to="/catalog"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/80 hover:text-foreground transition-colors"
          >
            Каталог
          </Link>
        </div>

        <div className="flex items-center justify-center">
          <Link to="/" aria-label="На главную">
            <img src={logo} alt="āsana" className="h-8" />
          </Link>
        </div>

        <div className="flex items-center justify-end gap-1">
          <Link to="/favorites" className={cn(iconButtonClass)} aria-label="Избранное">
            <Heart className="h-5 w-5" />
            {favorites.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-foreground text-background text-[10px] rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className={cn(iconButtonClass)}
            aria-label="Корзина"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-foreground text-background text-[10px] rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
