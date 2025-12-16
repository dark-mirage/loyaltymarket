'use client'
import React from 'react';

interface Brand {
  id: number;
  name: string;
  image?: string;
  isFavorite?: boolean;
}

interface FavoriteBrandsSectionProps {
  brands: Brand[];
}

export default function FavoriteBrandsSection({ brands }: FavoriteBrandsSectionProps) {
  return (
    <div className="bg-white rounded-[25px] mt-8 px-4 pt-[19px] pb-[24px]">
      <h2 className="text-[20px] font-bold leading-[1.06em] tracking-[-0.01em] text-black mb-[14px]">
        Избранные
      </h2>
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

            {/* Стрелка справа */}
            <img 
              src="/icons/global/Wrap.svg" 
              alt="arrow"
              className="w-[5.29px] h-[9.25px] flex-shrink-0"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

