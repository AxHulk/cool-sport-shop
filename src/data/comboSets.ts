import { products, Product } from './products';

export interface ComboSet {
  id: string;
  name: string;
  description: string;
  categorySlots: Array<{
    category: string;
    label: string;
  }>;
  discountPercent: number;
}

export const comboSets: ComboSet[] = [
  {
    id: 'combo-full',
    name: 'полный комплект',
    description: 'Леггинсы + Топ + Рашгард',
    categorySlots: [
      { category: 'leggings', label: 'Леггинсы' },
      { category: 'tops', label: 'Топ' },
      { category: 'rashguards', label: 'Рашгард' },
    ],
    discountPercent: 30,
  },
  {
    id: 'combo-top-leggings',
    name: 'базовый',
    description: 'Леггинсы + Топ',
    categorySlots: [
      { category: 'leggings', label: 'Леггинсы' },
      { category: 'tops', label: 'Топ' },
    ],
    discountPercent: 20,
  },
  {
    id: 'combo-bag',
    name: 'базовый+сумка',
    description: 'Сумка + Топ + Леггинсы',
    categorySlots: [
      { category: 'bags', label: 'Сумка' },
      { category: 'tops', label: 'Топ' },
      { category: 'leggings', label: 'Леггинсы' },
    ],
    discountPercent: 30,
  },
];

/** Get combo sets relevant to a given product */
export function getRelevantCombos(product: Product): ComboSet[] {
  return comboSets.filter(combo =>
    combo.categorySlots.some(slot => slot.category === product.category)
  );
}

/** Get a default product for a category (first available) */
export function getDefaultProductForCategory(category: string, excludeIds: string[] = []): Product | undefined {
  return products.find(p => p.category === category && !excludeIds.includes(p.id));
}

/** Calculate combo price */
export function calculateComboPrice(items: Product[], discountPercent: number) {
  const fullPrice = items.reduce((sum, p) => sum + p.price, 0);
  const discountedPrice = Math.round(fullPrice * (1 - discountPercent / 100));
  return { fullPrice, discountedPrice, savings: fullPrice - discountedPrice };
}
