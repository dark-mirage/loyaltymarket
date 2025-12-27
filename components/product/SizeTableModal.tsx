'use client'

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface SizeTableModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Модальное окно с таблицей размеров (по макету Figma node 0-8052)
 */
export default function SizeTableModal({ open, onClose }: SizeTableModalProps) {
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
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
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
        {/* Верхняя часть с заголовком */}
        <div className="relative bg-white rounded-t-[16px] pt-[18px] pb-[16px] px-4 shadow-[0_-8px_20px_rgba(0,0,0,0.12)]">
          {/* Граббер */}
          <div className="absolute left-1/2 top-[10px] h-1 w-[31.5px] -translate-x-1/2 rounded-full bg-[#EFEAE5]" />
          
          {/* Кнопка закрытия */}
          <button
            type="button"
            aria-label="Закрыть"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-[14px] bg-[#F4F3F1]"
          >
            <X size={16} className="text-[#2D2D2D]" strokeWidth={1.5} />
          </button>

          {/* Заголовок */}
          <h3 className="mt-3 text-[20px] font-bold leading-[1.21em] tracking-[0.01em] text-black">
            Размерная сетка
          </h3>
        </div>

        {/* Нижняя часть с таблицей размеров */}
        <div className="relative bg-white pb-8">
          <div className="px-4 pt-4">
            {/* Изображение таблицы размеров */}
            <div className="relative w-full rounded-lg overflow-hidden bg-[#F4F3F1]">
              <img
                src="/img/size-table.png"
                alt="Таблица размеров"
                className="w-full h-auto object-contain"
                onError={(e) => {
                  // Если изображение не найдено, показываем placeholder
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const placeholder = target.nextElementSibling as HTMLElement;
                  if (placeholder) placeholder.style.display = 'flex';
                }}
              />
              {/* Placeholder если изображение не найдено */}
              <div className="hidden min-h-[400px] items-center justify-center text-[#7E7E7E] text-[14px]">
                <div className="text-center">
                  <p className="mb-2">Таблица размеров</p>
                  <p className="text-[12px] text-[#7E7E7E]">
                    Изображение таблицы размеров будет добавлено позже
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

