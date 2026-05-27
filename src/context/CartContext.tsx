import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Product, ProductSize, ProductColor, ProductCategory } from '@/data/products';
import { comboSets } from '@/data/comboSets';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface CartItem {
  product: Product;
  size: ProductSize;
  color: ProductColor;
  quantity: number;
}

export interface AppliedCombo {
  comboId: string;
  comboName: string;
  discountPercent: number;
  savings: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: ProductSize, color: ProductColor) => void;
  removeItem: (productId: string, size: ProductSize, colorName: string) => void;
  updateQuantity: (productId: string, size: ProductSize, colorName: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  totalPriceWithDiscount: number;
  appliedCombo: AppliedCombo | null;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const fallbackCartContext: CartContextType = {
  items: [],
  addItem: () => undefined,
  removeItem: () => undefined,
  updateQuantity: () => undefined,
  clearCart: () => undefined,
  totalItems: 0,
  totalPrice: 0,
  totalPriceWithDiscount: 0,
  appliedCombo: null,
  isCartOpen: false,
  setIsCartOpen: () => undefined,
};

const CartContext = createContext<CartContextType>(fallbackCartContext);

const stockKey = (productId: string, size: string, colorName: string) =>
  `${productId}__${size}__${colorName}`;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [stockMap, setStockMap] = useState<Record<string, number>>({});

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Load inventory once (read-allowed for everyone)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('products_inventory')
        .select('product_id, size, color, quantity, reserved');
      if (cancelled || !data) return;
      const map: Record<string, number> = {};
      data.forEach((r: any) => {
        map[stockKey(r.product_id, r.size, r.color)] = Math.max(0, (r.quantity ?? 0) - (r.reserved ?? 0));
      });
      setStockMap(map);
    })();
    return () => { cancelled = true; };
  }, []);

  const getAvailable = (productId: string, size: string, colorName: string) => {
    const k = stockKey(productId, size, colorName);
    // If we don't yet have the inventory data, don't block the user
    if (!(k in stockMap)) return Infinity;
    return stockMap[k];
  };

  const addItem = (product: Product, size: ProductSize, color: ProductColor) => {
    setItems(prev => {
      const existing = prev.find(
        i => i.product.id === product.id && i.size === size && i.color.name === color.name
      );
      const current = existing?.quantity ?? 0;
      const available = getAvailable(product.id, size, color.name);
      if (current + 1 > available) {
        toast({ title: 'Недостаточно товара на складе', variant: 'destructive' });
        return prev;
      }
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.size === size && i.color.name === color.name
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, size, color, quantity: 1 }];
    });
  };

  const removeItem = (productId: string, size: ProductSize, colorName: string) => {
    setItems(prev => prev.filter(
      i => !(i.product.id === productId && i.size === size && i.color.name === colorName)
    ));
  };

  const updateQuantity = (productId: string, size: ProductSize, colorName: string, qty: number) => {
    if (qty <= 0) return removeItem(productId, size, colorName);
    const available = getAvailable(productId, size, colorName);
    if (qty > available) {
      toast({ title: 'Недостаточно товара на складе', variant: 'destructive' });
      return;
    }
    setItems(prev => prev.map(i =>
      i.product.id === productId && i.size === size && i.color.name === colorName
        ? { ...i, quantity: qty }
        : i
    ));
  };

  const clearCart = () => setItems([]);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  // Detect best applicable combo discount
  const appliedCombo = useMemo<AppliedCombo | null>(() => {
    const cartCategories = new Set(items.map(i => i.product.category));
    
    let bestCombo: AppliedCombo | null = null;
    let bestSavings = 0;

    for (const combo of comboSets) {
      const allSlotsPresent = combo.categorySlots.every(slot => cartCategories.has(slot.category as ProductCategory));
      if (!allSlotsPresent) continue;

      const comboItemPrices = combo.categorySlots.map(slot => {
        const matchingItems = items.filter(i => i.product.category === slot.category);
        return matchingItems.length > 0 ? Math.min(...matchingItems.map(i => i.product.price)) : 0;
      });
      const comboTotal = comboItemPrices.reduce((s, p) => s + p, 0);
      const savings = Math.round(comboTotal * combo.discountPercent / 100);

      if (savings > bestSavings) {
        bestSavings = savings;
        bestCombo = {
          comboId: combo.id,
          comboName: combo.name,
          discountPercent: combo.discountPercent,
          savings,
        };
      }
    }

    return bestCombo;
  }, [items]);

  const totalPriceWithDiscount = appliedCombo ? totalPrice - appliedCombo.savings : totalPrice;

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, totalPriceWithDiscount, appliedCombo, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
