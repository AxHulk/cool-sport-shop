import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ProductSize, ProductColor } from '@/data/products';

export interface CartItem {
  product: Product;
  size: ProductSize;
  color: ProductColor;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: ProductSize, color: ProductColor) => void;
  removeItem: (productId: string, size: ProductSize, colorName: string) => void;
  updateQuantity: (productId: string, size: ProductSize, colorName: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, size: ProductSize, color: ProductColor) => {
    setItems(prev => {
      const existing = prev.find(
        i => i.product.id === product.id && i.size === size && i.color.name === color.name
      );
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.size === size && i.color.name === color.name
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, size, color, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (productId: string, size: ProductSize, colorName: string) => {
    setItems(prev => prev.filter(
      i => !(i.product.id === productId && i.size === size && i.color.name === colorName)
    ));
  };

  const updateQuantity = (productId: string, size: ProductSize, colorName: string, qty: number) => {
    if (qty <= 0) return removeItem(productId, size, colorName);
    setItems(prev => prev.map(i =>
      i.product.id === productId && i.size === size && i.color.name === colorName
        ? { ...i, quantity: qty }
        : i
    ));
  };

  const clearCart = () => setItems([]);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};
