import { Link } from 'react-router-dom';
import { products } from '@/data/products';
import { useFavorites } from '@/context/FavoritesContext';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';

const Favorites = () => {
  const { favorites } = useFavorites();
  const favProducts = products.filter(p => favorites.includes(p.id));

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-serif mb-8">Избранное</h1>
      {favProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground mb-4">Вы ещё ничего не добавили в избранное</p>
          <Button asChild><Link to="/catalog">Перейти в каталог</Link></Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {favProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default Favorites;
