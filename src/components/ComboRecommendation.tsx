import { useState, useMemo, useRef, useEffect } from 'react';
import { ShoppingBag, Tag, ChevronDown } from 'lucide-react';
import { Product, ProductColor, products } from '@/data/products';
import { ComboSet, calculateComboPrice, getDefaultProductForCategory, getRelevantCombos } from '@/data/comboSets';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';


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
        <Tag className="h-5 w-5 text-foreground" style={{ fill: '#e4f0fe' }} />
        Собрать сет с максимальной выгодой
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

interface SlotSelection {
  product: Product;
  color: ProductColor;
}

/** Build a flat list of product+color variants for a category */
function getCategoryVariants(category: string): SlotSelection[] {
  const categoryProducts = products.filter(p => p.category === category);
  const variants: SlotSelection[] = [];
  for (const p of categoryProducts) {
    for (const c of p.colors) {
      variants.push({ product: p, color: c });
    }
  }
  return variants;
}

/** Get the display image for a product+color */
function getVariantImage(sel: SlotSelection): string {
  return sel.product.images[0];
}

/** Derive a short product type name from the product name */
function getShortProductName(product: Product): string {
  const name = product.name.toLowerCase();
  if (name.startsWith('майка')) return 'Майка';
  return shortCategoryName[product.category] || product.category;
}

/** Short display name: product type + color */
function getVariantLabel(sel: SlotSelection): string {
  const base = getShortProductName(sel.product);
  const variants = getCategoryVariants(sel.product.category);
  return variants.length > 1 ? `${base} (${sel.color.name})` : base;
}

interface ComboCardProps {
  combo: ComboSet;
  currentProduct: Product;
  addItem: (product: Product, size: any, color: any) => void;
}

const ComboCard = ({ combo, currentProduct, addItem }: ComboCardProps) => {
  const [selections, setSelections] = useState<Record<string, SlotSelection>>(() => {
    const initial: Record<string, SlotSelection> = {};
    combo.categorySlots.forEach(slot => {
      if (slot.category === currentProduct.category && !initial[slot.category]) {
        initial[slot.category] = { product: currentProduct, color: currentProduct.colors[0] };
      } else {
        const def = getDefaultProductForCategory(slot.category);
        if (def) {
          initial[slot.category] = { product: def, color: def.colors[0] };
        }
      }
    });
    return initial;
  });

  const comboProducts = combo.categorySlots.map(slot => selections[slot.category]?.product).filter(Boolean);
  const allSelected = comboProducts.length === combo.categorySlots.length;

  const { fullPrice, discountedPrice, savings } = useMemo(
    () => calculateComboPrice(comboProducts, combo.discountPercent),
    [comboProducts, combo.discountPercent]
  );

  const formatPrice = (p: number) => p.toLocaleString('ru-RU') + ' ₽';

  const handleAddCombo = () => {
    combo.categorySlots.forEach(slot => {
      const sel = selections[slot.category];
      if (sel) addItem(sel.product, sel.product.sizes[0], sel.color);
    });
  };

  return (
    <div className="border rounded-xl p-5 flex flex-col hover:border-[#e4f0fe] transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-sm">Сет «{combo.name}»</h3>
          <p className="text-xs text-muted-foreground">{combo.description}</p>
        </div>
        <span className="bg-[#e4f0fe] text-foreground text-xs font-bold px-2.5 py-1 rounded-full shrink-0">
          -{combo.discountPercent}%
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {combo.categorySlots.map(slot => {
          const selected = selections[slot.category];
          const variants = getCategoryVariants(slot.category);
          return (
            <SlotPicker
              key={slot.category}
              category={slot.category}
              selected={selected}
              variants={variants}
              onSelect={(sel) => setSelections(prev => ({ ...prev, [slot.category]: sel }))}
            />
          );
        })}
      </div>

      <div className="mt-auto border-t pt-3 space-y-2">
        {allSelected && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground line-through">{formatPrice(fullPrice)}</span>
              <span className="font-bold text-lg">{formatPrice(discountedPrice)}</span>
            </div>
            <p className="text-xs text-foreground/70 font-medium">Экономия: {formatPrice(savings)}</p>
          </>
        )}
        <Button className="w-full bg-[#e4f0fe] hover:bg-[#cde2fb] text-foreground" size="sm" onClick={handleAddCombo} disabled={!allSelected}>
          <ShoppingBag className="h-4 w-4 mr-1" />
          Добавить сет в корзину
        </Button>
      </div>
    </div>
  );
};

interface SlotPickerProps {
  category: string;
  selected: SlotSelection | undefined;
  variants: SlotSelection[];
  onSelect: (sel: SlotSelection) => void;
}

const SlotPicker = ({ category, selected, variants, onSelect }: SlotPickerProps) => {
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
  const hasOptions = variants.length > 1;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => hasOptions && setOpen(!open)}
        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
      >
        {selected ? (
          <img
            src={getVariantImage(selected)}
            alt={label}
            className="w-10 h-10 rounded-md object-cover bg-muted shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-md bg-muted shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate">
            {selected ? getVariantLabel(selected) : label}
          </p>
          {selected && (
            <p className="text-xs text-muted-foreground">{selected.product.price.toLocaleString('ru-RU')} ₽</p>
          )}
        </div>
        {hasOptions && (
          <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
        )}
      </button>

      {open && hasOptions && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg py-1 max-h-48 overflow-auto">
          {variants.map((v, i) => {
            const isSelected = selected?.product.id === v.product.id && selected?.color.name === v.color.name;
            return (
              <button
                key={`${v.product.id}-${v.color.name}`}
                onClick={() => { onSelect(v); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-muted/50 transition-colors text-left ${isSelected ? 'bg-muted/30' : ''}`}
              >
                <img src={getVariantImage(v)} alt={v.color.name} className="w-8 h-8 rounded object-cover bg-muted shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{getVariantLabel(v)}</p>
                  <p className="text-xs text-muted-foreground">{v.product.price.toLocaleString('ru-RU')} ₽</p>
                </div>
                <span
                  className="w-4 h-4 rounded-full border shrink-0"
                  style={{ backgroundColor: v.color.hex }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ComboRecommendation;
