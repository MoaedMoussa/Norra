import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('norra_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('norra_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Cart sync error', e);
    }
  }, [items]);

  const add = (template) => {
    setItems((prev) => {
      if (prev.some((i) => i.slug === template.slug)) return prev;
      return [...prev, template];
    });
  };

  const remove = (slug) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  };

  const clear = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  return (
    <CartContext.Provider value={{ items, add, remove, clear, total, count: items.length }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
};
