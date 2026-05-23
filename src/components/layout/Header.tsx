import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Menu } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import logo from '@/assets/logo.webp';
import { useFavorites } from '@/context/FavoritesContext';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

const iconButtonClass =
  'relative inline-flex items-center justify-center h-10 w-10 rounded-md text-foreground/80 transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

const mobileLinkClass =
  'block py-3 text-sm font-semibold uppercase tracking-[0.18em] text-foreground/80 hover:text-foreground transition-colors border-b';

const Header = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const { favorites } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container grid grid-cols-3 items-center h-16">
        {/* Left: desktop catalog link / mobile burger */}
        <div className="flex items-center justify-start">
          <Link
            to="/catalog"
            className="hidden md:inline text-xs font-semibold uppercase tracking-[0.18em] text-foreground/80 hover:text-foreground transition-colors"
          >
            Каталог
          </Link>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className={cn(iconButtonClass, 'md:hidden')}
                aria-label="Меню"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-6">
              <div className="mt-8 space-y-1">
                <SheetClose asChild>
                  <Link to="/catalog" className={mobileLinkClass}>Каталог</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/catalog?category=leggings" className={mobileLinkClass}>Леггинсы</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/catalog?category=tops" className={mobileLinkClass}>Топы</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/catalog?category=longsleeves" className={mobileLinkClass}>Лонгсливы</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/catalog?category=rashguards" className={mobileLinkClass}>Рашгарды</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/catalog?category=bags" className={mobileLinkClass}>Сумки</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/about" className={mobileLinkClass}>О бренде</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/favorites" className={mobileLinkClass}>
                    Избранное{favorites.length > 0 ? ` (${favorites.length})` : ''}
                  </Link>
                </SheetClose>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  className={cn(mobileLinkClass, 'w-full text-left')}
                >
                  Корзина{totalItems > 0 ? ` (${totalItems})` : ''}
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center justify-center">
          <Link to="/" aria-label="На главную">
            <img src={logo} alt="āsana" className="h-8" />
          </Link>
        </div>

        {/* Right: desktop icons only */}
        <div className="hidden md:flex items-center justify-end gap-1">
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
        {/* Spacer on mobile to keep grid balanced */}
        <div className="md:hidden" />
      </div>
    </header>
  );
};

export default Header;
