import { useState, useMemo, useRef, useEffect } from 'react';
import { ShoppingBag, Tag, ChevronDown } from 'lucide-react';
import { Product, products } from '@/data/products';
import { ComboSet, calculateComboPrice, getDefaultProductForCategory, getRelevantCombos } from '@/data/comboSets';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
        {combos.map(combo => (
          <ComboCard key={combo.id} combo={combo} currentProduct={currentProduct} addItem={addItem} />
        ))}
      </div>
    </section>
  );
};

const shortCategoryName: Record<string, string> = {
  leggings: 'Леггинсы',
  tops: 'Топ',
  rashguards: 'Рашгард',
  bags: 'Сумка',
};

interface ComboCardProps {
  combo: ComboSet;
  currentProduct: Product;
  addItem: (product: Product, size: any, color: any) => void;
}

const ComboCard = ({ combo, currentProduct, addItem }: ComboCardProps) => {
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
    <div className="border rounded-xl p-5 flex flex-col hover:border-accent/50 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-sm">{combo.name}</h3>
          <p className="text-xs text-muted-foreground">{combo.description}</p>
        </div>
        <span className="bg-accent text-accent-foreground text-xs font-bold px-2.5 py-1 rounded-full shrink-0">
          -{combo.discountPercent}%
        </span>
      </div>

      {/* Product slots */}
      <div className="space-y-2 mb-4">
        {combo.categorySlots.map(slot => {
          const selected = selectedProducts[slot.category];
          const options = categoryProducts(slot.category);
          return (
            <SlotPicker
              key={slot.category}
              category={slot.category}
              selected={selected}
              options={options}
              onSelect={(p) => setSelectedProducts(prev => ({ ...prev, [slot.category]: p }))}
            />
          );
        })}
      </div>

      {/* Pricing — pushed to bottom */}
      <div className="mt-auto border-t pt-3 space-y-2">
        {allSelected && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground line-through">{formatPrice(fullPrice)}</span>
              <span className="font-bold text-lg">{formatPrice(discountedPrice)}</span>
            </div>
            <p className="text-xs text-accent font-medium">Экономия: {formatPrice(savings)}</p>
          </>
        )}
        <Button className="w-full" size="sm" onClick={handleAddCombo} disabled={!allSelected}>
          <ShoppingBag className="h-4 w-4 mr-1" />
          Добавить комплект в корзину
        </Button>
      </div>
    </div>
  );
};

interface SlotPickerProps {
  category: string;
  selected: Product | undefined;
  options: Product[];
  onSelect: (p: Product) => void;
}

const SlotPicker = ({ category, selected, options, onSelect }: SlotPickerProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const label = shortCategoryName[category] || category;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => options.length > 1 && setOpen(!open)}
        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
      >
        {selected ? (
          <img
            src={selected.images[0]}
            alt={selected.name}
            className="w-10 h-10 rounded-md object-cover bg-muted shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-md bg-muted shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate">{label}</p>
          {selected && (
            <p className="text-xs text-muted-foreground">{selected.price.toLocaleString('ru-RU')} ₽</p>
          )}
        </div>
        {options.length > 1 && (
          <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
        )}
      </button>

      {open && options.length > 1 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg py-1 max-h-48 overflow-auto">
          {options.map(p => (
            <button
              key={p.id}
              onClick={() => { onSelect(p); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-muted/50 transition-colors text-left ${selected?.id === p.id ? 'bg-muted/30' : ''}`}
            >
              <img src={p.images[0]} alt={p.name} className="w-8 h-8 rounded object-cover bg-muted shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.price.toLocaleString('ru-RU')} ₽</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComboRecommendation;
