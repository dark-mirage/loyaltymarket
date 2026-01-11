"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, type CartItem } from "../hooks/useCart";

const CHECKOUT_SELECTED_KEY = "loyaltymarket_checkout_selected_ids_v1";
const CHECKOUT_PROMO_KEY = "loyaltymarket_checkout_promo_v1";

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

function readSelectedIds(): Set<number> {
  try {
    const raw = localStorage.getItem(CHECKOUT_SELECTED_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    const ids = parsed.filter((x) => typeof x === "number") as number[];
    return new Set(ids);
  } catch {
    return new Set();
  }
}

function readPromo(): { code: string; discountRub: number } | null {
  try {
    const raw = localStorage.getItem(CHECKOUT_PROMO_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const x = parsed as Record<string, unknown>;
    if (typeof x.code !== "string" || typeof x.discountRub !== "number")
      return null;
    return { code: x.code, discountRub: x.discountRub };
  } catch {
    return null;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCart();

  const [deliveryMode] = useState<"pickup" | "courier">("pickup");
  const [usePoints, setUsePoints] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"sbp" | "card">("sbp");
  const [useSplit, setUseSplit] = useState(false);

  const selectedIds = useMemo(() => readSelectedIds(), []);
  const promo = useMemo(() => readPromo(), []);

  const selectedItems = useMemo(() => {
    if (selectedIds.size === 0) return [] as CartItem[];
    return items.filter((x) => selectedIds.has(x.id));
  }, [items, selectedIds]);

  const { selectedQuantity, selectedSubtotalRub } = useMemo(() => {
    let qty = 0;
    let sum = 0;
    for (const x of selectedItems) {
      qty += x.quantity;
      sum += x.priceRub * x.quantity;
    }
    return { selectedQuantity: qty, selectedSubtotalRub: sum };
  }, [selectedItems]);

  const groupedByDelivery = useMemo(() => {
    const map = new Map<string, CartItem[]>();
    for (const x of selectedItems) {
      const key = x.deliveryText || "";
      const bucket = map.get(key);
      if (bucket) bucket.push(x);
      else map.set(key, [x]);
    }
    return Array.from(map.entries());
  }, [selectedItems]);

  const deliveryPriceText = deliveryMode === "pickup" ? "от 99₽" : "—";
  const deliveryBulletText =
    deliveryMode === "pickup" ? "Доставка в пункт выдачи" : "Доставка курьером";

  const discountRub = selectedQuantity > 0 ? promo?.discountRub ?? 0 : 0;
  const pointsRub = selectedQuantity > 0 && usePoints ? 200 : 0;
  const totalRub = Math.max(0, selectedSubtotalRub - discountRub - pointsRub);

  return (
    <div className="max-w-md mx-auto bg-[#F4F3F1] min-h-screen">
      <div className=" pt-4">
        <h1 className="text-[22px] font-semibold text-black px-4">
          Оформление заказа
        </h1>

        <div className="mt-4 grid grid-cols-2 gap-3 px-4">
          <button
            type="button"
            onClick={() => router.push("/checkout/pickup?step=search")}
            className="rounded-[16px] bg-white border-2 border-black p-4 text-left"
          >
            <div className="text-[14px] font-semibold text-black">
              Пункт выдачи
            </div>
            <div className="mt-6 text-[12px] text-[#7E7E7E]">
              {deliveryPriceText}
            </div>
          </button>
          <div className="rounded-[16px] bg-white border border-[#E5E5E5] p-4 opacity-60">
            <div className="text-[14px] font-semibold text-black">Курьером</div>
            <div className="mt-6 text-[12px] text-[#7E7E7E] leading-[1.1em]">
              Нет курьерской доставки
            </div>
          </div>
        </div>

        <div className="w-full mt-[12px] p-[16px] pb-[80px] bg-white rounded-t-[25px]">
          <div className="mt-4 bg-white rounded-[16px] overflow-hidden">
            <button
              type="button"
              onClick={() => router.push("/checkout/pickup?step=search")}
              className="w-full flex items-center justify-between px-4 py-4 border-b bg-[#F4F3F1] border-[#E5E5E5] text-left"
            >
              <div className="flex items-center gap-3">
                <img
                  src="/icons/global/location.svg"
                  alt="location"
                  className="w-5 h-5 text-[#000000] mt-[1px]"
                />
                <div>
                  <div className="text-[12px] text-[#000000]">Пункт выдачи</div>
                  <div className="text-[15px] text-black">Не выбран</div>
                </div>
              </div>
              <img
                src="/icons/global/small-arrow.svg"
                alt=""
                className="w-[6px] h-[11px]"
              />
            </button>

            <div className="flex items-center justify-between px-4 py-4 border-b bg-[#F4F3F1] border-[#E5E5E5]">
              <div className="flex items-center gap-3">
                <img
                  src="/icons/global/user.svg"
                  alt="location"
                  className="w-5 h-5 text-[#000000] mt-[1px]"
                />
                <div>
                  <div className="text-[12px] text-[#000000]">Получатель</div>
                  <div className="text-[15px] text-black">Не указан</div>
                </div>
              </div>
              <img
                src="/icons/global/small-arrow.svg"
                alt=""
                className="w-[6px] h-[11px]"
              />
            </div>

            <div className="flex items-center justify-between px-4 py-4 bg-[#F4F3F1]">
              <div className="flex items-center gap-3">
                <img
                  src="/icons/global/shipping.svg"
                  alt="location"
                  className="w-5 h-5 text-[#000000] mt-[1px]"
                />
                <div>
                  <div className="text-[12px] text-[#000000]">О сервисе</div>
                  <div className="text-[15px] text-black">
                    Доставка и отслеживание
                  </div>
                </div>
              </div>
              <img
                src="/icons/global/small-arrow.svg"
                alt=""
                className="w-[6px] h-[11px]"
              />
            </div>
          </div>

          {selectedQuantity === 0 ? (
            <div className="mt-6 bg-white rounded-[16px] px-4 py-6 text-center">
              <div className="text-[14px] font-semibold text-black">
                Выберите товары
              </div>
              <button
                type="button"
                onClick={() => router.push("/trash")}
                className="mt-4 h-[44px] px-6 rounded-[16px] bg-[#2D2D2D] text-white text-[13px] font-semibold"
              >
                Вернуться в корзину
              </button>
            </div>
          ) : (
            <div className="mt-2 space-y-2">
              {groupedByDelivery.map(([deliveryText, groupItems]) => {
                const first = groupItems[0];
                return (
                  <div key={deliveryText} className="space-y-[14px] mt-[14px]">
                    <div className="bg-[#F4F3F1] rounded-[16px] px-4 py-3">
                      <div className="flex items-start gap-2 text-black">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#E5E5E5] mt-2" />
                        <div>
                          <span className="text-[15px] font-medium">
                            {deliveryText}
                          </span>
                          <div className="text-[12px] text-[#6F6F6F]">
                            В пункт выдачи {deliveryPriceText}
                          </div>
                          {first?.shippingText?.trim() ? (
                            <div className="text-[11px] text-[#DD8825]">
                              {first.shippingText}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {groupItems.map((x) => (
                      <div
                        key={x.id}
                        className="bg-white rounded-[16px] py-1 flex items-center gap-3"
                      >
                        <div className="w-[69px] h-[67px] rounded-[10px] bg-[#F4F3F1] overflow-hidden flex-shrink-0 p-1">
                          <img
                            src={x.image}
                            alt={x.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] text-black">{x.name}</div>
                          <div className="text-[12px] text-[#7E7E7E] font-medium truncate">
                            {x.size && (
                              <>
                                Размер:{" "}
                                <span className="text-[#000000]">{x.size}</span>
                              </>
                            )}
                            {x.article && (
                              <>
                                {x.size && " · "}Артикул:{" "}
                                <span className="text-[#000000]">
                                  {x.article}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="mt-1 text-[14px] font-semibold text-black">
                            {formatRub(x.priceRub)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-[22px] mb-[8px] bg-[#F4F3F1] rounded-[16px] p-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                aria-pressed={paymentMethod === "sbp"}
                onClick={() => setPaymentMethod("sbp")}
                className={
                  "rounded-[16px] bg-[#F4F3F1] flex items-start justify-start flex-col p-4 gap-2 " +
                  (paymentMethod === "sbp"
                    ? "border-2 border-black"
                    : "border-2 border-[#2D2D2D47]")
                }
              >
                <span className="w-[27px] h-[27px] p-1 flex items-center justify-center rounded-[50%] bg-white border-[1px] border-[#D2D0CA]">
                  <img
                    src="/icons/global/cbp.png"
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </span>
                <span className="text-[14px] font-semibold text-black">
                  СБП
                </span>
              </button>
              <button
                type="button"
                aria-pressed={paymentMethod === "card"}
                onClick={() => setPaymentMethod("card")}
                className={
                  "rounded-[16px] bg-[#F4F3F1] flex items-center justify-center flex-col gap-0 " +
                  (paymentMethod === "card"
                    ? "border-2 border-black"
                    : "border-2 border-[#E5E5E5]")
                }
              >
                <span className="text-[40px] font-light leading-[100%] text-black">
                  +
                </span>
                <span className="text-[14px] font-semibold text-black">
                  Добавить карту
                </span>
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-[14px] text-black">
                <span>
                  {selectedQuantity} {pluralizeItemsRu(selectedQuantity)}
                </span>
                <span className="font-semibold">
                  {formatRub(selectedSubtotalRub)}
                </span>
              </div>

              <div className="flex items-center justify-between text-[14px] text-black">
                <span className="flex items-center gap-2">
                  <span>Скидка</span>
                  <img
                    src="/icons/global/small-arrow.svg"
                    alt=""
                    className="w-[6px] h-[11px] -rotate-90"
                  />
                </span>
                <span>
                  {discountRub > 0 ? `-${formatRub(discountRub)}` : "0 ₽"}
                </span>
              </div>
              {discountRub > 0 && promo ? (
                <div className="flex items-center justify-between text-[12px] text-black">
                  <span className="pl-3">• Промокод {promo.code}</span>
                  <span>-{formatRub(discountRub)}</span>
                </div>
              ) : null}

              <div className="flex items-center justify-between text-[14px] text-black">
                <span className="flex items-center gap-2">
                  <span>Доставка</span>
                  <img
                    src="/icons/global/small-arrow.svg"
                    alt=""
                    className="w-[6px] h-[11px] -rotate-90"
                  />
                </span>
                <span>{deliveryPriceText}</span>
              </div>
              <div className="flex items-center justify-between text-[12px] text-black">
                <span className="pl-3">• {deliveryBulletText}</span>
                <span>{deliveryPriceText}</span>
              </div>

              <div className="flex items-center justify-between text-[14px] text-black pt-1">
                <span className="text-black">Списать баллы</span>
                <div className="flex items-center gap-3">
                  <span className="text-[14px] text-[#7E7E7E]">
                    {usePoints ? `-${formatRub(200)}` : ""}
                  </span>
                  <button
                    type="button"
                    aria-label="Списать баллы"
                    onClick={() => setUsePoints((v) => !v)}
                    className={
                      "w-[44px] h-[26px] rounded-full p-[3px] transition-colors " +
                      (usePoints ? "bg-[#2D2D2D]" : "bg-[#E5E5E5]")
                    }
                  >
                    <span
                      className={
                        "block w-[20px] h-[20px] rounded-full bg-white transition-transform " +
                        (usePoints ? "translate-x-[18px]" : "translate-x-0")
                      }
                    />
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5E5E5] flex items-end justify-between">
                <span className="text-[16px] font-semibold text-black">
                  Итого
                </span>
                <span className="text-[32px] font-semibold leading-[1em] text-black">
                  {formatRub(totalRub)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="max-w-md mx-auto px-0">
              <div className="bg-[#F4F3F1] rounded-[16px] px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <img
                      src="/icons/global/split.svg"
                      alt=""
                      className="w-[34px] h-[34px]"
                    />
                    <div className="min-w-0">
                      <div className="text-[16px] font-semibold text-black truncate">
                        4×880₽ в сплит
                      </div>
                      <div className="text-[12px] text-[#7E7E7E]">
                        На 2 месяца без переплаты
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Включить сплит"
                    aria-pressed={useSplit}
                    onClick={() => setUseSplit((v) => !v)}
                    className={
                      "w-[44px] h-[26px] rounded-full p-[3px] transition-colors flex-shrink-0 " +
                      (useSplit ? "bg-[#2D2D2D]" : "bg-[#E5E5E5]")
                    }
                  >
                    <span
                      className={
                        "block w-[20px] h-[20px] rounded-full bg-white transition-transform " +
                        (useSplit ? "translate-x-[18px]" : "translate-x-0")
                      }
                    />
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between text-[12px] text-[#7E7E7E]">
                  <span>Сегодня</span>
                  <span>Ещё 3 платежа раз в 2 недели</span>
                </div>
                <div className="mt-2 flex w-full gap-1">
                  <div className="h-[6px] flex-1 rounded-full bg-black" />
                  <div className="h-[6px] flex-1 rounded-full bg-[#D2D0CA]" />
                  <div className="h-[6px] flex-1 rounded-full bg-[#D2D0CA]" />
                  <div className="h-[6px] flex-1 rounded-full bg-[#D2D0CA]" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="max-w-md mt-[20px] mx-auto pb-4 ">
              <button
                type="button"
                disabled={selectedQuantity === 0}
                className={
                  "w-full h-[54px] rounded-[16px] text-[15px] font-medium flex items-center justify-center gap-2 select-none transition active:scale-[0.98] active:opacity-90 disabled:active:scale-100 disabled:active:opacity-100 " +
                  (selectedQuantity > 0
                    ? "bg-[#2D2D2D] text-white"
                    : "bg-[#2D2D2D99] text-white")
                }
              >
                <span>Оплатить через СБП</span>{" "}
                <img
                  src="/icons/global/cbp.png"
                  alt=""
                  className="w-[18px] h-[20px]"
                />
              </button>

              <div className="mt-[26px] text-center text-[12px] text-[#000000] flex items-center justify-center gap-2">
                <img src="/icons/global/security.png" alt="" />{" "}
                <span>Безопасное оформление заказа</span>
              </div>

              <div className="mt-[26px] text-start text-[11px] text-[#2D2D2D] leading-[1.3em]">
                Нажимая «Оплатить через СБП», вы принимаете условия{" "}
                <a href="#" className="underline">
                  публичной оферты
                </a>
                ,{" "}
                <a href="#" className="underline">
                  пользовательского соглашения
                </a>{" "}
                и даете согласие на{" "}
                <a href="#" className="underline">
                  обработку персональных данных
                </a>
                .
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
