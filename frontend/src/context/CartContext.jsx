import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('pp_cart');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('pp_cart', JSON.stringify(items));
  }, [items]);

  const add = (item) => {
    setItems((prev) => {
      if (prev.find((i) => i.slug === item.slug)) return prev;
      return [...prev, { ...item, qty: 1 }];
    });
  };
  const remove = (slug) => setItems((prev) => prev.filter((i) => i.slug !== slug));
  const clear = () => setItems([]);

  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);
  const count = items.length;

  return (
    <CartContext.Provider value={{ items, add, remove, clear, total, count }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
