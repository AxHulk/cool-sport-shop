import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import logo from '@/assets/logo.png';
import { useFavorites } from '@/context/FavoritesContext';
import { Button } from '@/components/ui/button';

const navLinks = [
  { to: '/catalog', label: 'Каталог' },
  { to: '/catalog?category=leggings', label: 'Леггинсы' },
  { to: '/catalog?category=tops', label: 'Топы' },
  { to: '/catalog?category=rashguards', label: 'Рашгарды' },
  { to: '/catalog?category=bags', label: 'Сумки' },
];

const Header = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const { favorites } = useFavorites();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex items-center justify-between h-16">
        <Link to="/">
          <img src={logo} alt="āsana" className="h-8" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/70 hover:text-foreground transition-colors">
              {l.label}
            </Link>
          ))}
          <Link to="/about" className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/70 hover:text-foreground transition-colors">
            О бренде
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/favorites" className="relative">
              <Heart className="h-5 w-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/profile"><User className="h-5 w-5" /></Link>
          </Button>
          <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t bg-background px-4 py-4 space-y-3">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-foreground">
              {l.label}
            </Link>
          ))}
          <Link to="/about" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-foreground">
            О бренде
          </Link>
          <Link to="/delivery" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-foreground">
            Доставка и оплата
          </Link>
          <Link to="/contacts" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-foreground">
            Контакты
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
