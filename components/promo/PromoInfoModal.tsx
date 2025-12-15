'use client'

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "../ui/Button";

interface PromoInfoModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Нижнее модальное окно с описанием баллов (по макету Figma node 0-12811).
 */
export default function PromoInfoModal({ open, onClose }: PromoInfoModalProps) {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setVisible(true);
      return;
    }
    const timer = setTimeout(() => setVisible(false), 250);
    return () => clearTimeout(timer);
  }, [open]);

  if (!visible) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Затемнение */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Листание снизу */}
      <div
        className={`relative w-full transform transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="relative bg-white rounded-t-[22px] pt-[18px] pb-8 px-4 shadow-[0_-8px_20px_rgba(0,0,0,0.12)]">
          {/* Граббер и закрытие */}
          <div className="absolute left-1/2 top-[10px] h-1 w-[31.5px] -translate-x-1/2 rounded-full bg-[#E5E5E5]" />
          <button
            type="button"
            aria-label="Закрыть"
            onClick={onClose}
            className="absolute right-4 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#F4F3F1]"
          >
            <span className="text-sm font-medium text-black">✕</span>
          </button>

          <h3 className="mt-3 text-[20px] font-bold leading-[1.21em] tracking-[-0.01em] text-black">
            Баллы
          </h3>

          <div className="mt-4 space-y-5 text-[15px] leading-[1.21em] text-black">
            <section className="space-y-2">
              <p className="text-[15px] font-medium uppercase tracking-[0.01em]">КАК ПОЛУЧИТЬ?</p>
              <p className="text-[#7E7E7E]">
                За каждый завершённый заказ начисляется 200 баллов.
              </p>
            </section>

            <section className="space-y-2">
              <p className="text-[15px] font-medium uppercase tracking-[0.01em]">КАК ПОТРАТИТЬ?</p>
              <p className="text-[#7E7E7E]">
                Баллами можно оплачивать часть заказа: до 10% на стартовом уровне,
                до 15% на продвинутом и до 20% на премиум.
              </p>
            </section>

            <section className="space-y-2">
              <p className="text-[20px] font-bold uppercase tracking-[-0.01em]">подарочные баллы</p>
              <div className="space-y-2">
                <p className="text-[15px] font-medium uppercase tracking-[0.01em]">КАК ПОЛУЧИТЬ?</p>
                <p className="text-[#7E7E7E]">
                  Подарочные баллы начисляются при активации подарочной карты,
                  полученной от другого пользователя.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[15px] font-medium uppercase tracking-[0.01em]">КАК ПОТРАТИТЬ?</p>
                <p className="text-[#7E7E7E]">
                  Подарочными баллами можно оплачивать до 100% стоимости заказа.
                  При их наличии они списываются первыми, пока не израсходуются полностью.
                </p>
              </div>
            </section>
            <Button
              onClick={onClose}
              className="w-full"
            >
              Закрыть
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

