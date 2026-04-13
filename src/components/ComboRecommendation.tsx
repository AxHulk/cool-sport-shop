import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check, Tag } from 'lucide-react';
import { Product, products } from '@/data/products';
import { ComboSet, calculateComboPrice, getDefaultProductForCategory, getRelevantCombos } from '@/data/comboSets';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ComboRecommendationProps {
  currentProduct: Product;
}

const ComboRecommendation = ({ currentProduct }: ComboRecommendationProps) => {
  const combos = getRelevantCombos(currentProduct);
  const { addItem } = useCart();

  if (combos.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-serif mb-6 flex items-center gap-2">
        <Tag className="h-5 w-5 text-accent" />
        Собери комплект — получи скидку
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {combos.map(combo => (
          <ComboCard key={combo.id} combo={combo} currentProduct={currentProduct} addItem={addItem} />
        ))}
      </div>
    </section>
  );
};

interface ComboCardProps {
  combo: ComboSet;
  currentProduct: Product;
  addItem: (product: Product, size: any, color: any) => void;
}

const ComboCard = ({ combo, currentProduct, addItem }: ComboCardProps) => {
  // For each slot, pick the current product if it matches, otherwise a default
  const [selectedProducts, setSelectedProducts] = useState<Record<string, Product>>(() => {
    const initial: Record<string, Product> = {};
    const usedIds: string[] = [];
    combo.categorySlots.forEach(slot => {
      if (slot.category === currentProduct.category && !initial[slot.category]) {
        initial[slot.category] = currentProduct;
        usedIds.push(currentProduct.id);
      } else {
        const def = getDefaultProductForCategory(slot.category, usedIds);
        if (def) {
          initial[slot.category] = def;
          usedIds.push(def.id);
        }
      }
    });
    return initial;
  });

  const comboProducts = combo.categorySlots.map(slot => selectedProducts[slot.category]).filter(Boolean);
  const allSelected = comboProducts.length === combo.categorySlots.length;

  const { fullPrice, discountedPrice, savings } = useMemo(
    () => calculateComboPrice(comboProducts, combo.discountPercent),
    [comboProducts, combo.discountPercent]
  );

  const formatPrice = (p: number) => p.toLocaleString('ru-RU') + ' ₽';

  const handleAddCombo = () => {
    comboProducts.forEach(product => {
      const size = product.sizes[0];
      const color = product.colors[0];
      addItem(product, size, color);
    });
    toast.success(`Комплект «${combo.name}» добавлен в корзину`, {
      description: `Скидка ${combo.discountPercent}% — вы экономите ${formatPrice(savings)}`,
    });
  };

  const categoryProducts = (category: string) =>
    products.filter(p => p.category === category);

  return (
    <div className="border rounded-xl p-5 space-y-4 hover:border-accent/50 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">{combo.name}</h3>
          <p className="text-xs text-muted-foreground">{combo.description}</p>
        </div>
        <span className="bg-accent text-accent-foreground text-xs font-bold px-2.5 py-1 rounded-full">
          -{combo.discountPercent}%
        </span>
      </div>

      {/* Product slots */}
      <div className="space-y-3">
        {combo.categorySlots.map(slot => {
          const selected = selectedProducts[slot.category];
          const options = categoryProducts(slot.category);
          return (
            <div key={slot.category} className="flex items-center gap-3">
              {selected ? (
                <>
                  <img
                    src={selected.images[0]}
                    alt={selected.name}
                    className="w-12 h-12 rounded-lg object-cover bg-muted"
                  />
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${selected.id}`} className="text-xs font-medium hover:underline truncate block">
                      {selected.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{formatPrice(selected.price)}</p>
                  </div>
                  {options.length > 1 && (
                    <select
                      className="text-xs border rounded px-1 py-0.5 bg-background"
                      value={selected.id}
                      onChange={(e) => {
                        const newProduct = products.find(p => p.id === e.target.value);
                        if (newProduct) {
                          setSelectedProducts(prev => ({ ...prev, [slot.category]: newProduct }));
                        }
                      }}
                    >
                      {options.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  )}
                </>
              ) : (
                <div className="flex-1 text-xs text-muted-foreground py-3 text-center border border-dashed rounded-lg">
                  Выберите {slot.label.toLowerCase()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pricing */}
      {allSelected && (
        <div className="border-t pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground line-through">{formatPrice(fullPrice)}</span>
            <span className="font-bold text-lg">{formatPrice(discountedPrice)}</span>
          </div>
          <p className="text-xs text-accent font-medium">Экономия: {formatPrice(savings)}</p>
          <Button className="w-full" size="sm" onClick={handleAddCombo}>
            <ShoppingBag className="h-4 w-4 mr-1" />
            Добавить комплект в корзину
          </Button>
        </div>
      )}
    </div>
  );
};

export default ComboRecommendation;
