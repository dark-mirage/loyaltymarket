"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart, type CartItem } from "../hooks/useCart";

const CHECKOUT_SELECTED_KEY = "loyaltymarket_checkout_selected_ids_v1";
const CHECKOUT_PROMO_KEY = "loyaltymarket_checkout_promo_v1";
const CHECKOUT_RECIPIENT_KEY = "loyaltymarket_checkout_recipient_v1";
const CHECKOUT_CUSTOMS_KEY = "loyaltymarket_checkout_customs_v1";
const CHECKOUT_CARD_KEY = "loyaltymarket_checkout_card_v1";

type CheckoutRecipient = {
  fullName: string;
  phoneDigits: string; // 10 digits after +7
  email: string;
};

type CheckoutCustomsData = {
  passportSeries: string;
  passportNumber: string;
  issueDate: string;
  birthDate: string;
  inn: string;
};

type CheckoutCardSaved = {
  last4: string;
  exp: string; // MM/YY
  holder: string;
};

type CheckoutCardDraft = {
  numberDigits: string;
  exp: string;
  cvc: string;
  holder: string;
};

function readRecipient(): CheckoutRecipient | null {
  try {
    const raw = localStorage.getItem(CHECKOUT_RECIPIENT_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const x = parsed as Record<string, unknown>;
    if (
      typeof x.fullName !== "string" ||
      typeof x.phoneDigits !== "string" ||
      typeof x.email !== "string"
    ) {
      return null;
    }
    return {
      fullName: x.fullName,
      phoneDigits: x.phoneDigits,
      email: x.email,
    };
  } catch {
    return null;
  }
}

function writeRecipient(value: CheckoutRecipient) {
  try {
    localStorage.setItem(CHECKOUT_RECIPIENT_KEY, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function readCustomsData(): CheckoutCustomsData | null {
  try {
    const raw = localStorage.getItem(CHECKOUT_CUSTOMS_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const x = parsed as Record<string, unknown>;
    if (
      typeof x.passportSeries !== "string" ||
      typeof x.passportNumber !== "string" ||
      typeof x.issueDate !== "string" ||
      typeof x.birthDate !== "string" ||
      typeof x.inn !== "string"
    ) {
      return null;
    }
    return {
      passportSeries: x.passportSeries,
      passportNumber: x.passportNumber,
      issueDate: x.issueDate,
      birthDate: x.birthDate,
      inn: x.inn,
    };
  } catch {
    return null;
  }
}

function writeCustomsData(value: CheckoutCustomsData) {
  try {
    localStorage.setItem(CHECKOUT_CUSTOMS_KEY, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function readCard(): CheckoutCardSaved | null {
  try {
    const raw = localStorage.getItem(CHECKOUT_CARD_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const x = parsed as Record<string, unknown>;
    if (
      typeof x.last4 !== "string" ||
      typeof x.exp !== "string" ||
      typeof x.holder !== "string"
    ) {
      return null;
    }
    return {
      last4: x.last4,
      exp: x.exp,
      holder: x.holder,
    };
  } catch {
    return null;
  }
}

function writeCard(value: CheckoutCardSaved) {
  try {
    localStorage.setItem(CHECKOUT_CARD_KEY, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function normalizeCardNumberDigits(input: string): string {
  return (input || "").replace(/\D/g, "").slice(0, 19);
}

function formatCardNumber(digits: string): string {
  const d = (digits || "").replace(/\D/g, "");
  return d.replace(/(.{4})/g, "$1 ").trim();
}

function normalizeExpiry(value: string): string {
  const digits = (value || "").replace(/\D/g, "").slice(0, 4);
  const mm = digits.slice(0, 2);
  const yy = digits.slice(2, 4);
  return yy ? `${mm}/${yy}` : mm;
}

function isValidLuhn(numberDigits: string): boolean {
  const digits = (numberDigits || "").replace(/\D/g, "");
  if (digits.length < 12) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);
    if (Number.isNaN(digit)) return false;
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

function normalizePhoneDigits(input: string): string {
  const raw = input || "";
  let digits = raw.replace(/\D/g, "");
  if (!digits) return "";

  // If the user types into our formatted input (which shows "+7 ..."),
  // the extracted digits will start with a leading "7" from the prefix.
  // Strip it so we keep only the 10 digits after +7.
  const hasPlus7Prefix = /^\s*\+7/.test(raw);
  if (hasPlus7Prefix && digits.startsWith("7")) {
    digits = digits.slice(1);
  }

  // Also accept pasted formats: 8XXXXXXXXXX, 7XXXXXXXXXX, +7XXXXXXXXXX.
  if (
    digits.length >= 11 &&
    (digits.startsWith("7") || digits.startsWith("8"))
  ) {
    digits = digits.slice(1);
  }

  return digits.slice(0, 10);
}

function formatPhone(digits10: string): string {
  const d = (digits10 || "").replace(/\D/g, "").slice(0, 10);
  if (!d) return "";
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 8);
  const e = d.slice(8, 10);
  let out = "+7";
  if (a) out += ` ${a}`;
  if (b) out += ` ${b}`;
  if (c) out += `-${c}`;
  if (e) out += `-${e}`;
  return out;
}

type FieldError = "required" | "invalid";
type RecipientErrors = Partial<Record<keyof CheckoutRecipient, FieldError>>;

type CardErrors = Partial<Record<keyof CheckoutCardDraft, FieldError>>;

function validateCardDraft(draft: CheckoutCardDraft): CardErrors {
  const errors: CardErrors = {};

  const numberDigits = normalizeCardNumberDigits(draft.numberDigits);
  if (!numberDigits) {
    errors.numberDigits = "required";
  } else if (numberDigits.length < 16 || numberDigits.length > 19) {
    errors.numberDigits = "invalid";
  } else if (!isValidLuhn(numberDigits)) {
    errors.numberDigits = "invalid";
  }

  const exp = normalizeExpiry(draft.exp);
  if (!exp) {
    errors.exp = "required";
  } else if (!/^\d{2}\/\d{2}$/.test(exp)) {
    errors.exp = "invalid";
  } else {
    const [mmStr, yyStr] = exp.split("/");
    const mm = Number(mmStr);
    const yy = Number(yyStr);
    if (mm < 1 || mm > 12 || Number.isNaN(yy)) {
      errors.exp = "invalid";
    }
  }

  const cvc = (draft.cvc || "").replace(/\D/g, "").slice(0, 4);
  if (!cvc) {
    errors.cvc = "required";
  } else if (cvc.length < 3) {
    errors.cvc = "invalid";
  }

  const holder = (draft.holder || "").trim();
  if (!holder) {
    errors.holder = "required";
  } else {
    const ok = /^[A-Za-zА-Яа-яЁё\s-]+$/.test(holder);
    if (!ok || holder.replace(/\s+/g, " ").length < 3) {
      errors.holder = "invalid";
    }
  }

  return errors;
}

function validateRecipient(draft: CheckoutRecipient): RecipientErrors {
  const errors: RecipientErrors = {};

  const fullName = draft.fullName.trim();
  if (!fullName) {
    errors.fullName = "required";
  } else {
    if (/[A-Za-z]/.test(fullName)) {
      errors.fullName = "invalid";
    } else {
      const parts = fullName.split(/\s+/).filter(Boolean);
      if (parts.length < 2) {
        errors.fullName = "invalid";
      } else {
        const ok = parts.every((p) => /^[А-Яа-яЁё-]+$/.test(p));
        if (!ok) errors.fullName = "invalid";
      }
    }
  }

  const phoneDigits = draft.phoneDigits.trim();
  if (!phoneDigits) {
    errors.phoneDigits = "required";
  } else if (phoneDigits.length !== 10 || !phoneDigits.startsWith("9")) {
    errors.phoneDigits = "invalid";
  }

  const email = draft.email.trim();
  if (!email) {
    errors.email = "required";
  } else {
    const ok = /^[^\s@]+@[^\s@]+\.(ru|com)$/i.test(email);
    if (!ok) errors.email = "invalid";
  }

  return errors;
}

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
  return (
    <Suspense
      fallback={<div className="max-w-md mx-auto bg-[#F4F3F1] min-h-screen" />}
    >
      <CheckoutPageInner />
    </Suspense>
  );
}

function CheckoutPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();
  const { items } = useCart();

  const pickup = useMemo(() => {
    const params = new URLSearchParams(searchParamsKey);
    const pickupPvzId = params.get("pickupPvzId")?.trim() || null;
    const pickupAddress = params.get("pickupAddress")?.trim() || null;
    const pickupProvider = params.get("pickupProvider")?.trim() || null;
    return { pickupPvzId, pickupAddress, pickupProvider };
  }, [searchParamsKey]);

  const openPickupSelection = useMemo(() => {
    if (pickup.pickupPvzId) {
      return `/checkout/pickup?step=map&pvzId=${encodeURIComponent(
        pickup.pickupPvzId
      )}`;
    }
    return "/checkout/pickup?step=search";
  }, [pickup.pickupPvzId]);

  const [recipient, setRecipient] = useState<CheckoutRecipient | null>(null);
  const [isRecipientModalOpen, setIsRecipientModalOpen] = useState(false);
  const [recipientDraft, setRecipientDraft] = useState<CheckoutRecipient>({
    fullName: "",
    phoneDigits: "",
    email: "",
  });
  const [recipientSubmitAttempted, setRecipientSubmitAttempted] =
    useState(false);

  const openRecipientModal = () => {
    setRecipientDraft(
      recipient ?? { fullName: "", phoneDigits: "", email: "" }
    );
    setRecipientSubmitAttempted(false);
    setIsRecipientModalOpen(true);
  };

  const recipientErrors = useMemo(() => {
    if (!recipientSubmitAttempted) return {} as RecipientErrors;
    return validateRecipient(recipientDraft);
  }, [recipientDraft, recipientSubmitAttempted]);

  const [customs, setCustoms] = useState<CheckoutCustomsData | null>(null);
  const [isCustomsModalOpen, setIsCustomsModalOpen] = useState(false);
  const [customsDraft, setCustomsDraft] = useState<CheckoutCustomsData>({
    passportSeries: "",
    passportNumber: "",
    issueDate: "",
    birthDate: "",
    inn: "",
  });

  const openCustomsModal = () => {
    setCustomsDraft(
      customs ?? {
        passportSeries: "",
        passportNumber: "",
        issueDate: "",
        birthDate: "",
        inn: "",
      }
    );
    setIsCustomsModalOpen(true);
  };

  const [card, setCard] = useState<CheckoutCardSaved | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [cardDraft, setCardDraft] = useState<CheckoutCardDraft>({
    numberDigits: "",
    exp: "",
    cvc: "",
    holder: "",
  });
  const [cardSubmitAttempted, setCardSubmitAttempted] = useState(false);

  const closeCardModal = () => {
    setIsCardModalOpen(false);
    if (!card) setPaymentMethod("sbp");
  };

  const openCardModal = () => {
    setCardDraft({
      numberDigits: "",
      exp: card?.exp ?? "",
      cvc: "",
      holder: card?.holder ?? "",
    });
    setCardSubmitAttempted(false);
    setIsCardModalOpen(true);
  };

  const [deliveryMode] = useState<"pickup" | "courier">("pickup");
  const [usePoints, setUsePoints] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"sbp" | "card">("sbp");
  const [useSplit, setUseSplit] = useState(false);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set());
  const [promo, setPromo] = useState<{
    code: string;
    discountRub: number;
  } | null>(null);

  // Hydrate client-only state after mount to avoid SSR/CSR text mismatches.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setRecipient(readRecipient());
    setCustoms(readCustomsData());
    setCard(readCard());
    setSelectedIds(readSelectedIds());
    setPromo(readPromo());
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const cardErrors = useMemo(() => {
    if (!cardSubmitAttempted) return {} as CardErrors;
    return validateCardDraft(cardDraft);
  }, [cardDraft, cardSubmitAttempted]);

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
            onClick={() => router.push(openPickupSelection)}
            className="rounded-[16px] bg-white border-2 border-black p-4 text-left"
          >
            <div className="text-[14px] font-semibold text-black">
              Пункт выдачи
            </div>
            {pickup.pickupAddress ? (
              <div className="mt-2 text-[12px] text-black/80 leading-[1.2]">
                {pickup.pickupProvider
                  ? `${pickup.pickupProvider} — ${pickup.pickupAddress}`
                  : pickup.pickupAddress}
              </div>
            ) : null}
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
              onClick={() => router.push(openPickupSelection)}
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
                  <div className="text-[15px] text-black">
                    {pickup.pickupAddress ?? "Не выбран"}
                  </div>
                </div>
              </div>
              <img
                src="/icons/global/small-arrow.svg"
                alt=""
                className="w-[6px] h-[11px]"
              />
            </button>

            <button
              type="button"
              onClick={openRecipientModal}
              className="w-full flex items-center justify-between px-4 py-4 border-b bg-[#F4F3F1] border-[#E5E5E5] text-left"
            >
              <div className="flex items-center gap-3">
                <img
                  src="/icons/global/user.svg"
                  alt="location"
                  className="w-5 h-5 text-[#000000] mt-[1px]"
                />
                <div>
                  <div className="text-[12px] text-[#000000]">Получатель</div>
                  <div className="text-[15px] text-black">
                    {recipient?.fullName?.trim()
                      ? recipient.fullName
                      : "Не указан"}
                  </div>
                </div>
              </div>
              <img
                src="/icons/global/small-arrow.svg"
                alt=""
                className="w-[6px] h-[11px]"
              />
            </button>

            <button
              type="button"
              onClick={openCustomsModal}
              className="w-full flex items-center justify-between px-4 py-4 bg-[#F4F3F1] text-left"
            >
              <div className="flex items-center gap-3">
                <img
                  src="/icons/global/shipping.svg"
                  alt="location"
                  className="w-5 h-5 text-[#000000] mt-[1px]"
                />
                <div>
                  <div className="text-[12px] text-[#000000]">
                    Данные для таможни
                  </div>
                  <div className="text-[15px] text-black">Паспорт и ИНН</div>
                </div>
              </div>
              <img
                src="/icons/global/small-arrow.svg"
                alt=""
                className="w-[6px] h-[11px]"
              />
            </button>
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
                onClick={() => {
                  setPaymentMethod("card");
                  openCardModal();
                }}
                className={
                  "rounded-[16px] bg-[#F4F3F1] flex items-center justify-center flex-col gap-0 " +
                  (paymentMethod === "card"
                    ? "border-2 border-black"
                    : "border-2 border-[#E5E5E5]")
                }
              >
                <span className="text-[40px] font-light leading-[100%] text-black">
                  {card ? "••••" : "+"}
                </span>
                <span className="text-[14px] font-semibold text-black">
                  {card ? `Карта •••• ${card.last4}` : "Добавить карту"}
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
                <span>
                  {paymentMethod === "sbp"
                    ? "Оплатить через СБП"
                    : "Оплатить картой"}
                </span>
                {paymentMethod === "sbp" ? (
                  <img
                    src="/icons/global/cbp.png"
                    alt=""
                    className="w-[18px] h-[20px]"
                  />
                ) : null}
              </button>

              <div className="mt-[26px] text-center text-[12px] text-[#000000] flex items-center justify-center gap-2">
                <img src="/icons/global/security.png" alt="" />{" "}
                <span>Безопасное оформление заказа</span>
              </div>

              <div className="mt-[26px] text-start text-[11px] text-[#2D2D2D] leading-[1.3em]">
                Нажимая «
                {paymentMethod === "sbp"
                  ? "Оплатить через СБП"
                  : "Оплатить картой"}
                », вы принимаете условия{" "}
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

      {isRecipientModalOpen ? (
        <div className="fixed inset-0 z-2000" style={{ zIndex: 2500 }}>
          <button
            type="button"
            aria-label="Закрыть"
            onClick={() => setIsRecipientModalOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md">
            <div className="bg-white rounded-t-[28px] border border-[#E5E5E5] shadow-[0_-18px_44px_rgba(0,0,0,0.18)] overflow-hidden">
              <div className="pt-3 pb-1">
                <div className="mx-auto w-12 h-1.5 rounded-full bg-[#E5E5E5]" />
              </div>

              <div className="px-4 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-[18px] font-semibold text-black leading-tight">
                    Получатель
                  </div>
                  <button
                    type="button"
                    aria-label="Закрыть"
                    onClick={() => setIsRecipientModalOpen(false)}
                    className="w-6 h-6 rounded-full grid place-items-center bg-white border border-[#E5E5E5]"
                  >
                    <img
                      src="/icons/global/xicon.svg"
                      alt=""
                      className="w-3 h-3 opacity-80"
                    />
                  </button>
                </div>

                <div className="mt-3 bg-[#F4F3F1] rounded-2xl px-3 py-3 flex items-start gap-3">
                  <img
                    src="/icons/global/Info.svg"
                    alt=""
                    className="w-5 h-5"
                  />
                  <div className="text-[12px] text-black leading-[1.2]">
                    <div className="font-semibold">
                      Указывайте настоящие данные
                    </div>
                    <div className="text-[#7E7E7E]">
                      При получении заказа потребуется паспорт
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <input
                      value={recipientDraft.fullName}
                      onChange={(e) =>
                        setRecipientDraft((v) => ({
                          ...v,
                          fullName: e.target.value,
                        }))
                      }
                      placeholder="ФИО"
                      className={
                        "w-full h-12 rounded-2xl bg-[#F4F3F1] px-4 text-[14px] text-black outline-none border " +
                        (recipientErrors.fullName
                          ? "border-[#FF3B30]"
                          : "border-transparent")
                      }
                    />
                    {recipientSubmitAttempted &&
                    recipientDraft.fullName.trim() &&
                    recipientErrors.fullName === "invalid" ? (
                      <div className="mt-1 text-[12px] text-[#FF3B30]">
                        ФИ неверный формат
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <input
                      value={formatPhone(recipientDraft.phoneDigits)}
                      onChange={(e) => {
                        const el = e.target;
                        const selectionStart = el.selectionStart;
                        const selectionEnd = el.selectionEnd;

                        // Prevent "overflow" typing: once we have 10 digits after +7,
                        // extra typed digits should be ignored (not shift/replace existing).
                        const raw = el.value || "";
                        let rawDigits = raw.replace(/\D/g, "");
                        const hasPlus7Prefix = /^\s*\+7/.test(raw);
                        if (hasPlus7Prefix && rawDigits.startsWith("7")) {
                          rawDigits = rawDigits.slice(1);
                        }
                        if (
                          rawDigits.length >= 11 &&
                          (rawDigits.startsWith("7") ||
                            rawDigits.startsWith("8"))
                        ) {
                          rawDigits = rawDigits.slice(1);
                        }

                        const isSelectionCollapsed =
                          selectionStart != null &&
                          selectionEnd != null &&
                          selectionStart === selectionEnd;

                        if (
                          recipientDraft.phoneDigits.length >= 10 &&
                          rawDigits.length > 10 &&
                          isSelectionCollapsed
                        ) {
                          return;
                        }

                        const next = normalizePhoneDigits(raw);
                        setRecipientDraft((v) => ({ ...v, phoneDigits: next }));
                      }}
                      inputMode="tel"
                      placeholder="Телефон"
                      className={
                        "w-full h-12 rounded-2xl bg-[#F4F3F1] px-4 text-[14px] text-black outline-none border " +
                        (recipientErrors.phoneDigits
                          ? "border-[#FF3B30]"
                          : "border-transparent")
                      }
                    />
                    {recipientSubmitAttempted &&
                    recipientDraft.phoneDigits.trim() &&
                    recipientErrors.phoneDigits === "invalid" ? (
                      <div className="mt-1 text-[12px] text-[#FF3B30]">
                        Укажите телефон в формате +7 9XX XXX-XX-XX
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <input
                      value={recipientDraft.email}
                      onChange={(e) =>
                        setRecipientDraft((v) => ({
                          ...v,
                          email: e.target.value,
                        }))
                      }
                      inputMode="email"
                      placeholder="Электронная почта"
                      className={
                        "w-full h-12 rounded-2xl bg-[#F4F3F1] px-4 text-[14px] text-black outline-none border " +
                        (recipientErrors.email
                          ? "border-[#FF3B30]"
                          : "border-transparent")
                      }
                    />
                    {recipientSubmitAttempted &&
                    recipientDraft.email.trim() &&
                    recipientErrors.email === "invalid" ? (
                      <div className="mt-1 text-[12px] text-[#FF3B30]">
                        Неверный формат
                      </div>
                    ) : null}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setRecipientSubmitAttempted(true);
                    const errs = validateRecipient(recipientDraft);
                    if (Object.keys(errs).length > 0) return;

                    const next: CheckoutRecipient = {
                      fullName: recipientDraft.fullName.trim(),
                      phoneDigits: normalizePhoneDigits(
                        recipientDraft.phoneDigits
                      ),
                      email: recipientDraft.email.trim(),
                    };

                    setRecipient(next);
                    writeRecipient(next);
                    setIsRecipientModalOpen(false);
                  }}
                  className="mt-5 w-full h-[54px] rounded-[16px] bg-[#2D2D2D] text-white text-[15px] font-medium"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isCustomsModalOpen ? (
        <div className="fixed inset-0 z-2000" style={{ zIndex: 2500 }}>
          <button
            type="button"
            aria-label="Закрыть"
            onClick={() => setIsCustomsModalOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md">
            <div className="bg-white rounded-t-[28px] border border-[#E5E5E5] shadow-[0_-18px_44px_rgba(0,0,0,0.18)] overflow-hidden">
              <div className="pt-3 pb-1">
                <div className="mx-auto w-12 h-1.5 rounded-full bg-[#E5E5E5]" />
              </div>

              <div className="px-4 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-[18px] font-semibold text-black leading-tight">
                    Данные для таможни
                  </div>
                  <button
                    type="button"
                    aria-label="Закрыть"
                    onClick={() => setIsCustomsModalOpen(false)}
                    className="w-6 h-6 rounded-full grid place-items-center bg-white border border-[#E5E5E5]"
                  >
                    <img
                      src="/icons/global/xicon.svg"
                      alt=""
                      className="w-3 h-3 opacity-80"
                    />
                  </button>
                </div>

                <div className="mt-2 text-[14px] text-black leading-[1.25]">
                  <div>
                    Данные нужны при декларировании товаров из-за рубежа. Все
                    товары оформляются на таможне согласно приказу ФТС от
                    05.07.2018 № 1060
                  </div>
                  <div className="mt-3">
                    Мы соблюдаем таможенное законодательство и передаем
                    паспортные данные и ИНН получателя в защищенном виде
                  </div>
                  <button
                    type="button"
                    className="mt-3 text-[14px] text-[#7E7E7E] underline"
                  >
                    Подробнее
                  </button>
                </div>

                <div className="mt-4 bg-[#F4F3F1] rounded-2xl px-3 py-3 flex items-start gap-3">
                  <img
                    src="/icons/global/Info.svg"
                    alt=""
                    className="w-5 h-5"
                  />
                  <div className="text-[12px] text-black leading-[1.2]">
                    <div className="font-semibold">
                      Указывайте настоящие данные
                    </div>
                    <div className="text-[#7E7E7E]">
                      При таможенном оформлении неверные данные приведут к
                      отказу в пропуске товара
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      value={customsDraft.passportSeries}
                      onChange={(e) => {
                        const next = (e.target.value || "")
                          .replace(/[^0-9A-Za-zА-Яа-яЁё]/g, "")
                          .toUpperCase()
                          .slice(0, 10);
                        setCustomsDraft((v) => ({
                          ...v,
                          passportSeries: next,
                        }));
                      }}
                      inputMode="text"
                      autoCapitalize="characters"
                      spellCheck={false}
                      maxLength={10}
                      placeholder="Серия"
                      className="w-full h-12 rounded-2xl bg-[#F4F3F1] px-4 text-[14px] text-black outline-none border border-transparent"
                    />
                    <input
                      value={customsDraft.passportNumber}
                      onChange={(e) => {
                        const next = (e.target.value || "")
                          .replace(/\D/g, "")
                          .slice(0, 6);
                        setCustomsDraft((v) => ({
                          ...v,
                          passportNumber: next,
                        }));
                      }}
                      inputMode="numeric"
                      placeholder="Номер"
                      className="w-full h-12 rounded-2xl bg-[#F4F3F1] px-4 text-[14px] text-black outline-none border border-transparent"
                    />
                  </div>

                  <input
                    value={customsDraft.issueDate}
                    onChange={(e) => {
                      const next = (e.target.value || "")
                        .replace(/[^0-9.]/g, "")
                        .slice(0, 10);
                      setCustomsDraft((v) => ({ ...v, issueDate: next }));
                    }}
                    inputMode="numeric"
                    placeholder="Дата выдачи"
                    className="w-full h-12 rounded-2xl bg-[#F4F3F1] px-4 text-[14px] text-black outline-none border border-transparent"
                  />

                  <input
                    value={customsDraft.birthDate}
                    onChange={(e) => {
                      const next = (e.target.value || "")
                        .replace(/[^0-9.]/g, "")
                        .slice(0, 10);
                      setCustomsDraft((v) => ({ ...v, birthDate: next }));
                    }}
                    inputMode="numeric"
                    placeholder="Дата рождения"
                    className="w-full h-12 rounded-2xl bg-[#F4F3F1] px-4 text-[14px] text-black outline-none border border-transparent"
                  />

                  <div>
                    <input
                      value={customsDraft.inn}
                      onChange={(e) => {
                        const next = (e.target.value || "")
                          .replace(/\D/g, "")
                          .slice(0, 12);
                        setCustomsDraft((v) => ({ ...v, inn: next }));
                      }}
                      inputMode="numeric"
                      placeholder="ИНН"
                      className="w-full h-12 rounded-2xl bg-[#F4F3F1] px-4 text-[14px] text-black outline-none border border-transparent"
                    />
                    <button
                      type="button"
                      className="mt-2 text-left text-[12px] text-[#7E7E7E] underline"
                    >
                      Узнать свой ИНН на Госуслугах
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-[12px] text-black">
                  <img
                    src="/icons/global/security.png"
                    alt=""
                    className="w-5 h-5"
                  />
                  <span>Данные хранятся и передаются в защищенном виде</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const next: CheckoutCustomsData = {
                      passportSeries: customsDraft.passportSeries.trim(),
                      passportNumber: customsDraft.passportNumber.trim(),
                      issueDate: customsDraft.issueDate.trim(),
                      birthDate: customsDraft.birthDate.trim(),
                      inn: customsDraft.inn.trim(),
                    };
                    setCustoms(next);
                    writeCustomsData(next);
                    setIsCustomsModalOpen(false);
                  }}
                  className="mt-5 w-full h-[54px] rounded-[16px] bg-[#2D2D2D] text-white text-[15px] font-medium"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isCardModalOpen ? (
        <div className="fixed inset-0 z-2000" style={{ zIndex: 2500 }}>
          <button
            type="button"
            aria-label="Закрыть"
            onClick={closeCardModal}
            className="absolute inset-0 bg-black/40"
          />

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md">
            <div className="bg-white rounded-t-[28px] border border-[#E5E5E5] shadow-[0_-18px_44px_rgba(0,0,0,0.18)] overflow-hidden">
              <div className="pt-3 pb-1">
                <div className="mx-auto w-12 h-1.5 rounded-full bg-[#E5E5E5]" />
              </div>

              <div className="px-4 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-[18px] font-semibold text-black leading-tight">
                    Добавить карту
                  </div>
                  <button
                    type="button"
                    aria-label="Закрыть"
                    onClick={closeCardModal}
                    className="w-6 h-6 rounded-full grid place-items-center bg-white border border-[#E5E5E5]"
                  >
                    <img
                      src="/icons/global/xicon.svg"
                      alt=""
                      className="w-3 h-3 opacity-80"
                    />
                  </button>
                </div>

                <div className="mt-3 text-[12px] text-[#7E7E7E] leading-[1.2]">
                  CVV-код не сохраняется и не хранится.
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <input
                      value={formatCardNumber(cardDraft.numberDigits)}
                      onChange={(e) => {
                        const next = normalizeCardNumberDigits(e.target.value);
                        setCardDraft((v) => ({ ...v, numberDigits: next }));
                      }}
                      inputMode="numeric"
                      placeholder="Номер карты"
                      className={
                        "w-full h-12 rounded-2xl bg-[#F4F3F1] px-4 text-[14px] text-black outline-none border " +
                        (cardErrors.numberDigits
                          ? "border-[#FF3B30]"
                          : "border-transparent")
                      }
                    />
                    {cardSubmitAttempted &&
                    cardDraft.numberDigits.trim() &&
                    cardErrors.numberDigits === "invalid" ? (
                      <div className="mt-1 text-[12px] text-[#FF3B30]">
                        Проверьте номер карты
                      </div>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        value={normalizeExpiry(cardDraft.exp)}
                        onChange={(e) => {
                          const next = normalizeExpiry(e.target.value);
                          setCardDraft((v) => ({ ...v, exp: next }));
                        }}
                        inputMode="numeric"
                        placeholder="MM/YY"
                        className={
                          "w-full h-12 rounded-2xl bg-[#F4F3F1] px-4 text-[14px] text-black outline-none border " +
                          (cardErrors.exp
                            ? "border-[#FF3B30]"
                            : "border-transparent")
                        }
                      />
                      {cardSubmitAttempted &&
                      cardDraft.exp.trim() &&
                      cardErrors.exp === "invalid" ? (
                        <div className="mt-1 text-[12px] text-[#FF3B30]">
                          Неверный срок
                        </div>
                      ) : null}
                    </div>

                    <div>
                      <input
                        value={(cardDraft.cvc || "")
                          .replace(/\D/g, "")
                          .slice(0, 4)}
                        onChange={(e) => {
                          const next = (e.target.value || "")
                            .replace(/\D/g, "")
                            .slice(0, 4);
                          setCardDraft((v) => ({ ...v, cvc: next }));
                        }}
                        inputMode="numeric"
                        placeholder="CVV"
                        className={
                          "w-full h-12 rounded-2xl bg-[#F4F3F1] px-4 text-[14px] text-black outline-none border " +
                          (cardErrors.cvc
                            ? "border-[#FF3B30]"
                            : "border-transparent")
                        }
                      />
                      {cardSubmitAttempted &&
                      cardDraft.cvc.trim() &&
                      cardErrors.cvc === "invalid" ? (
                        <div className="mt-1 text-[12px] text-[#FF3B30]">
                          Минимум 3 цифры
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <input
                      value={cardDraft.holder}
                      onChange={(e) => {
                        const next = (e.target.value || "")
                          .replace(/\s+/g, " ")
                          .toUpperCase();
                        setCardDraft((v) => ({ ...v, holder: next }));
                      }}
                      inputMode="text"
                      autoCapitalize="characters"
                      spellCheck={false}
                      placeholder="Имя владельца"
                      className={
                        "w-full h-12 rounded-2xl bg-[#F4F3F1] px-4 text-[14px] text-black outline-none border " +
                        (cardErrors.holder
                          ? "border-[#FF3B30]"
                          : "border-transparent")
                      }
                    />
                    {cardSubmitAttempted &&
                    cardDraft.holder.trim() &&
                    cardErrors.holder === "invalid" ? (
                      <div className="mt-1 text-[12px] text-[#FF3B30]">
                        Укажите имя латиницей или кириллицей
                      </div>
                    ) : null}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCardSubmitAttempted(true);
                    const errs = validateCardDraft(cardDraft);
                    if (Object.keys(errs).length > 0) return;

                    const numberDigits = normalizeCardNumberDigits(
                      cardDraft.numberDigits
                    );
                    const exp = normalizeExpiry(cardDraft.exp);
                    const holder = cardDraft.holder.trim();

                    const next: CheckoutCardSaved = {
                      last4: numberDigits.slice(-4),
                      exp,
                      holder,
                    };

                    setCard(next);
                    writeCard(next);
                    setPaymentMethod("card");
                    setIsCardModalOpen(false);
                  }}
                  className="mt-5 w-full h-[54px] rounded-[16px] bg-[#2D2D2D] text-white text-[15px] font-medium"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
