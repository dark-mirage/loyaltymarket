"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Footer from "../../components/layout/Footer";
import ProductSection from "../../components/ProductSection";
import type { Product } from "../../components/types";
import { useCart, type CartItem } from "../hooks/useCart";

const SEED_ITEMS: CartItem[] = [
  {
    id: 1,
    name: "Худи Carne Bollente",
    image: "/products/t-shirt-1.png",
    size: "L",
    article: "4465457",
    priceRub: 23400,
    quantity: 1,
    deliveryText: "30 марта, из Китая",
    isFavorite: true,
  },
  {
    id: 2,
    name: "Джинсы Carne Bollente",
    image: "/products/t-shirt-2.png",
    size: "L",
    article: "4465457",
    priceRub: 23400,
    quantity: 1,
    deliveryText: "Послезавтра, из наличия",
    isFavorite: false,
  },
  {
    id: 3,
    name: "Джинсы Carne Bollente blue jeans...",
    image: "/products/shoes-1.png",
    size: "L",
    article: "4465457",
    priceRub: 23400,
    quantity: 1,
    deliveryText: "Послезавтра, из наличия",
    isFavorite: true,
  },
];

function formatRub(value: number) {
  try {
    return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
  } catch {
    return `${value} ₽`;
  }
}

function pluralizeItemsRu(count: number) {
  const n = Math.abs(count);
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "товар";
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14))
    return "товара";
  return "товаров";
}

export default function TrashBasketPage() {
  const {
    items,
    toggleFavorite,
    removeItem,
    setQuantity,
    removeMany,
    totalQuantity,
    subtotalRub,
  } = useCart(SEED_ITEMS);

  const [unselectedIds, setUnselectedIds] = useState<Set<number>>(
    () => new Set()
  );
  const selectedIds = useMemo(() => {
    const next = new Set<number>();
    for (const item of items) {
      if (!unselectedIds.has(item.id)) next.add(item.id);
    }
    return next;
  }, [items, unselectedIds]);

  const allSelected = items.length > 0 && selectedIds.size === items.length;

  const toggleSelect = (id: number) => {
    setUnselectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setUnselectedIds((prev) => {
      if (items.length === 0) return prev;
      const areAllSelected = items.every((x) => !prev.has(x.id));
      if (areAllSelected) return new Set(items.map((x) => x.id));
      return new Set();
    });
  };

  const deleteSelected = () => {
    removeMany(selectedIds);
    setUnselectedIds((prev) => {
      const next = new Set(prev);
      for (const id of selectedIds) next.add(id);
      return next;
    });
  };

  const removeOne = (id: number) => {
    removeItem(id);
    setUnselectedIds((prev) => new Set(prev).add(id));
  };

  const TEST_PROMO_CODES = useMemo(
    () => [
      {
        code: "PROMO100",
        discountRub: 500,
      },
    ],
    []
  );
  type PromoStatus = "idle" | "success" | "error";
  const [promoCode, setPromoCode] = useState("");
  const [promoStatus, setPromoStatus] = useState<PromoStatus>("idle");
  const [appliedPromo, setAppliedPromo] = useState<
    (typeof TEST_PROMO_CODES)[number] | null
  >(null);

  const promoActive = promoCode.trim().length > 0;
  const promoNormalized = promoCode.trim().toUpperCase();

  const onPromoChange = (value: string) => {
    setPromoCode(value);
    if (promoStatus !== "idle" || appliedPromo) {
      setPromoStatus("idle");
      setAppliedPromo(null);
    }
  };

  const applyPromo = () => {
    if (!promoActive) {
      setPromoStatus("idle");
      setAppliedPromo(null);
      return;
    }

    const match = TEST_PROMO_CODES.find((p) => p.code === promoNormalized);
    if (match) {
      setPromoStatus("success");
      setAppliedPromo(match);
      return;
    }

    setPromoStatus("error");
    setAppliedPromo(null);
  };

  const discountRub = appliedPromo?.discountRub ?? 0;
  const totalRub = Math.max(0, subtotalRub - discountRub);

  const recommendedProducts: Product[] = useMemo(
    () => [
      {
        id: 101,
        name: "Лонгслив Comme Des Garcons Play",
        brand: "Comme Des Garcons",
        price: "2 890 ₽",
        image: "/products/t-shirt-1.png",
        isFavorite: false,
        deliveryDate: "30 марта",
      },
      {
        id: 102,
        name: "Туфли Prada Monolith Brushed Original Bla...",
        brand: "Prada",
        price: "112 490 ₽",
        image: "/products/shoes-1.png",
        isFavorite: true,
        deliveryDate: "Послезавтра",
      },
      {
        id: 103,
        name: "Футболка Daze",
        brand: "Daze",
        price: "2 890 ₽",
        image: "/products/t-shirt-2.png",
        isFavorite: false,
        deliveryDate: "30 марта",
      },
      {
        id: 104,
        name: "Кроссовки Nike Dunk Low",
        brand: "Nike",
        price: "12 990 ₽",
        image: "/products/shoes-2.png",
        isFavorite: true,
        deliveryDate: "Послезавтра",
      },
    ],
    []
  );

  const [recommended, setRecommended] =
    useState<Product[]>(recommendedProducts);

  const toggleRecommendedFavorite = (id: number) => {
    setRecommended((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  const itemsWord = pluralizeItemsRu(totalQuantity);

  return (
    <div className="max-w-md mx-auto bg-[#F4F3F1] min-h-screen">
      <div className="px-4 pt-[20px]">
        <div className="flex items-baseline gap-3">
          <h1 className="text-[22px] font-semibold leading-[1.1em] text-black">
            Корзина
          </h1>
          {items.length > 0 ? (
            <span className="text-[13px] font-normal text-[#7E7E7E]">
              {totalQuantity} {itemsWord}
            </span>
          ) : null}
        </div>

        {items.length > 0 ? (
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={deleteSelected}
              className="text-[13px] font-medium text-[#7E7E7E] flex items-center gap-1.5"
              disabled={selectedIds.size === 0}
            >
              <img src="/icons/global/xicon.svg" alt="" className="w-3 h-3" />{" "}
              <span>Удалить выбранные</span>
            </button>

            <label className="flex items-center gap-2 text-[13px] font-medium text-[#7E7E7E]">
              Выбрать все
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="h-5 w-5 accent-black"
              />
            </label>
          </div>
        ) : null}
      </div>

      <main className="pt-3">
        {items.length === 0 ? (
          <div className="p-0">
            <div className="bg-white rounded-b-[25px] px-4 py-10 text-center">
              <div className="text-[20px] font-semibold text-black">
                В корзине пока пусто
              </div>
              <div className="mt-2 text-[14px] font-normal text-[#7E7E7E]">
                А товаров полно — ищите их в каталоге
              </div>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center mt-6 px-6 h-[44px] rounded-[16px] bg-[#2D2D2D] text-white text-[13px] font-semibold"
              >
                За покупками
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-[25px] px-4 pt-5 pb-4"
                >
                  <div className="flex gap-3">
                    <div className="w-[92px] h-[92px] rounded-xl bg-[#F4F3F1] overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-[14px] font-semibold leading-[1.2em] text-black truncate">
                            {item.name}
                          </div>
                          <div className="mt-1 text-[12px] text-[#7E7E7E]">
                            {item.size ? `Размер: ${item.size}` : null}
                            {item.article
                              ? ` ${item.size ? "• " : ""}Артикул: ${
                                  item.article
                                }`
                              : null}
                          </div>
                        </div>

                        <input
                          type="checkbox"
                          checked={selectedIds.has(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          className="h-5 w-5 accent-black flex-shrink-0"
                        />
                      </div>

                      <div className="mt-2 text-[20px] font-semibold leading-[1em] text-black">
                        {formatRub(item.priceRub)}
                      </div>

                      <div className="mt-1 text-[12px] text-[#7E7E7E]">
                        {item.deliveryText}
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <button
                            type="button"
                            onClick={() => toggleFavorite(item.id)}
                            aria-label={
                              item.isFavorite
                                ? "Убрать из избранного"
                                : "Добавить в избранное"
                            }
                            className=""
                          >
                            <img
                              src={
                                item.isFavorite
                                  ? "/icons/global/active-heart.svg"
                                  : "/icons/global/not-active-heart.svg"
                              }
                              alt=""
                              className="w-5 h-5"
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() => removeOne(item.id)}
                            aria-label="Удалить"
                          >
                            <img
                              src="/icons/global/xicon.svg"
                              alt="Удалить"
                              className="w-4 h-4"
                            />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 bg-[#F4F3F1] rounded-[8px] px-3 py-1">
                          <button
                            type="button"
                            onClick={() =>
                              setQuantity(item.id, item.quantity - 1)
                            }
                          >
                            −
                          </button>
                          <span className="w-7 text-center text-[14px] font-semibold text-black">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-white rounded-[25px] p-4">
              <div
                className={
                  "w-full bg-[#F4F3F1] rounded-[16px] px-4 py-3 flex items-center gap-3 " +
                  (promoActive
                    ? "border-2 border-black"
                    : "border border-transparent")
                }
              >
                <div className="flex-1 min-w-0">
                  {promoActive ? (
                    <div className="text-[12px] font-normal text-[#7E7E7E] leading-[1.1em]">
                      Промокод
                    </div>
                  ) : null}
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => onPromoChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") applyPromo();
                    }}
                    placeholder={promoActive ? "" : "Промокод"}
                    className={
                      "w-full bg-transparent outline-none placeholder:text-[#7E7E7E] " +
                      (promoStatus === "success"
                        ? "text-green-600 "
                        : promoStatus === "error"
                        ? "text-red-500 "
                        : "text-black ") +
                      (promoActive
                        ? "text-[16px] font-semibold leading-[1.2em]"
                        : "text-[14px] font-normal h-[22px]")
                    }
                  />
                </div>

                {promoActive ? (
                  <button
                    type="button"
                    aria-label="Применить промокод"
                    onClick={applyPromo}
                    className="w-9 h-9 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center flex-shrink-0"
                  >
                    <img
                      src="/icons/global/arrow.svg"
                      alt=""
                      className="w-[10px] h-[12px]"
                    />
                  </button>
                ) : null}
              </div>

              {promoStatus === "success" ? (
                <div className="mt-1 pl-2 text-[12px] font-normal text-green-600 ">
                  Промокод применён
                </div>
              ) : null}

              {promoStatus === "error" ? (
                <div className="mt-1 pl-2 text-[12px] font-normal text-red-500">
                  Такого промокода нет
                </div>
              ) : null}

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-[14px] text-black">
                  <span>
                    {totalQuantity} {itemsWord}
                  </span>
                  <span className="font-semibold">
                    {formatRub(subtotalRub)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[14px] text-black">
                  <span>Скидка</span>
                  <span>
                    {discountRub > 0 ? `-${formatRub(discountRub)}` : "0 ₽"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[14px] text-black">
                  <span className="flex items-center gap-2">
                    <span>Доставка</span>
                    <img
                      src="/icons/global/Info.svg"
                      alt=""
                      className="w-[14px] h-[14px]"
                    />
                  </span>
                  <span>при оформлении</span>
                </div>

                <div className="pt-3 border-t border-[#E5E5E5] flex items-end justify-between">
                  <span className="text-[16px] font-semibold text-black">
                    Итого
                  </span>
                  <div className="flex items-end justify-end gap-2">
                    <span className="text-[32px] font-semibold leading-[1em] text-black">
                      {formatRub(totalRub)}
                    </span>
                    {discountRub > 0 ? (
                      <span className="text-[14px] font-medium text-[#7E7E7E] line-through leading-[1.1em]">
                        {formatRub(subtotalRub)}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="mt-6 bg-white rounded-t-[25px] pt-[20px] pb-[160px]">
          <h2 className="px-[16px] text-[20px] font-semibold text-black mb-3">
            Для вас
          </h2>
          <ProductSection
            products={recommended}
            onToggleFavorite={toggleRecommendedFavorite}
            layout="grid"
          />
        </div>
      </main>

      {items.length > 0 ? (
        <div className="fixed left-0 right-0 bottom-[80px] ">
          <div className="max-w-md mx-auto p-[10px] pt-[15px] bg-white rounded-t-[25px]">
            <div className="bg-[#2D2D2D] rounded-[16px] px-[16px] py-[18px] flex items-center justify-between">
              <span className="text-[13px] font-semibold text-white">
                {totalQuantity} {pluralizeItemsRu(totalQuantity)}
              </span>
              <button
                type="button"
                className="text-[13px] font-semibold text-white"
                disabled={items.length === 0}
              >
                К оформлению
              </button>
              <div className="flex items-center justify-end gap-2">
                <span className="text-[13px] font-semibold text-white">
                  {formatRub(totalRub)}
                </span>
                {discountRub > 0 ? (
                  <span className="text-[12px] font-semibold text-white/60 line-through">
                    {formatRub(subtotalRub)}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <Footer />
    </div>
  );
}
