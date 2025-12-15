'use client'
import React from 'react';

interface Brand {
  id: number;
  name: string;
  image?: string;
  isFavorite?: boolean;
}

interface AllBrandsListProps {
  brands: Brand[];
  onToggleFavorite?: (id: number) => void;
}

export default function AllBrandsList({ brands, onToggleFavorite }: AllBrandsListProps) {
  return (
    <ul className="flex flex-col gap-[8px]">
      {brands.map((brand) => (
        <li key={brand.id} className="flex items-center justify-between w-full h-[60px] bg-[#F4F3F1] rounded-2xl px-[14px] py-[9px] mb-0">
          {/* Левая часть: изображение и текст */}
          <div className="flex items-center gap-[10px]">
            {/* Изображение бренда */}
            {brand.image && (
              <div className="w-[40.89px] h-[41px] rounded-[13px] overflow-hidden bg-white flex-shrink-0">
                <img
                  src={brand.image} 
                  alt={brand.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Текст бренда */}
            <div className="flex flex-col gap-0">
              <span className="text-[13px] font-semibold leading-[1.061em] text-black">
                {brand.name}
              </span>
              <span className="text-[13px] font-normal leading-[1.21em] text-[#7E7E7E]">
                Бренд
              </span>
            </div>
          </div>

          {/* Кнопка избранного */}
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(brand.id)}
              className="w-[24.1px] h-[22px] flex items-center justify-center flex-shrink-0"
              aria-pressed={brand.isFavorite}
            >
              <img
                src={brand.isFavorite ? '/icons/global/active-heart.svg' : '/icons/global/not-active-heart.svg'}
                alt={brand.isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
                className="w-full h-full"
              />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

