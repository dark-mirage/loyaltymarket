"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: number;
  name: string;
  image: string;
  size?: string;
  article?: string;
  priceRub: number;
  quantity: number;
  deliveryText: string;
  isFavorite: boolean;
};

const STORAGE_KEY = "loyaltymarket_cart_v1";

function safeParseCart(value: string | null): CartItem[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed as CartItem[];
  } catch {
    return [];
  }
}

export function useCart(seed?: CartItem[]) {
  const [ready, setReady] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fromStorage = safeParseCart(localStorage.getItem(STORAGE_KEY));
    if (fromStorage.length > 0) {
      setItems(fromStorage);
    } else if (seed && seed.length > 0) {
      setItems(seed);
    }
    setReady(true);
    // seed intentionally only used on first load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }, [items, ready]);

  const toggleFavorite = useCallback((id: number) => {
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, isFavorite: !x.isFavorite } : x))
    );
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const setQuantity = useCallback((id: number, quantity: number) => {
    const nextQty = Math.max(1, quantity);
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, quantity: nextQty } : x))
    );
  }, []);

  const removeMany = useCallback((ids: Set<number>) => {
    if (ids.size === 0) return;
    setItems((prev) => prev.filter((x) => !ids.has(x.id)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totalQuantity = useMemo(
    () => items.reduce((sum, x) => sum + x.quantity, 0),
    [items]
  );
  const subtotalRub = useMemo(
    () => items.reduce((sum, x) => sum + x.priceRub * x.quantity, 0),
    [items]
  );

  return {
    ready,
    items,
    setItems,
    toggleFavorite,
    removeItem,
    setQuantity,
    removeMany,
    clear,
    totalQuantity,
    subtotalRub,
  };
}
