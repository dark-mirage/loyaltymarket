"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: number;
  name: string;
  shippingText: string;
  image: string;
  size?: string;
  article?: string;
  priceRub: number;
  quantity: number;
  deliveryText: string;
  isFavorite: boolean;
};

const STORAGE_KEY = "loyaltymarket_cart_v1";
const CART_UPDATED_EVENT = "loyaltymarket_cart_updated";

const STRAY_DELIVERY_PREFIX = "Доставка из Китая до РФ";

function containsStrayDeliveryText(value: string) {
  // tolerate different spacing/currency variants by matching only the stable prefix
  return value.includes(STRAY_DELIVERY_PREFIX);
}

type ParsedCartResult = {
  items: CartItem[];
  invalid: boolean;
};

function safeParseCart(value: string | null): ParsedCartResult {
  if (!value) return { items: [], invalid: false };
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return { items: [], invalid: false };

    // If old/bad data got stored where delivery text was saved as the product title,
    // consider the cache invalid and fall back to seed.
    const invalid = parsed.some(
      (x) => typeof x?.name === "string" && containsStrayDeliveryText(x.name)
    );
    if (invalid) return { items: [], invalid: true };

    // Migrate older cache versions: ensure shippingText exists (do not infer).
    const items = (parsed as unknown[]).map((entry) => {
      const x: Record<string, unknown> =
        typeof entry === "object" && entry !== null
          ? (entry as Record<string, unknown>)
          : {};

      const shippingText =
        typeof x.shippingText === "string" ? x.shippingText : "";

      return {
        ...x,
        shippingText,
      } as CartItem;
    });

    return { items, invalid: false };
  } catch {
    return { items: [], invalid: false };
  }
}

export function useCart(seed?: CartItem[]) {
  const [ready, setReady] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);

    const { items: fromStorage, invalid } = safeParseCart(raw);
    if (invalid) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }

    if (fromStorage.length > 0) {
      // If storage is missing newer fields, fill from seed when possible.
      if (seed && seed.length > 0) {
        const seedById = new Map(seed.map((x) => [x.id, x] as const));
        const merged = fromStorage.map((x) => {
          if (x.shippingText && x.shippingText.trim().length > 0) return x;
          const seedItem = seedById.get(x.id);
          if (seedItem?.shippingText)
            return { ...x, shippingText: seedItem.shippingText };
          return x;
        });
        setItems(merged);
      } else {
        setItems(fromStorage);
      }
    } else if (seed && seed.length > 0) {
      setItems(seed);
    }

    // Notify listeners (e.g. footer badge) on initial load.
    try {
      window.dispatchEvent(new Event(CART_UPDATED_EVENT));
    } catch {
      // ignore
    }

    setReady(true);
    // seed intentionally only used on first load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

      // Notify listeners (e.g. footer badge).
      window.dispatchEvent(new Event(CART_UPDATED_EVENT));
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
