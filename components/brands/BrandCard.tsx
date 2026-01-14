"use client";
import React from "react";

interface BrandCardProps {
  id: number;
  name: string;
  image?: string;
  isFavorite?: boolean;
  onClick?: (id: number) => void;
}

export default function BrandCard({
  id,
  name,
  image,
  isFavorite,
  onClick,
}: BrandCardProps) {
  return (
    <li
      className="flex items-center justify-between w-full h-[60px] bg-[#F4F3F1] rounded-2xl px-[14px] py-[9px] mb-0 cursor-pointer hover:opacity-80 transition-opacity"
      onClick={() => onClick?.(id)}
    >
      {/* Левая часть: изображение и текст */}
      <div className="flex items-center gap-[10px]">
        {/* Изображение бренда */}
        {image && (
          <div className="w-[40.89px] h-[41px] rounded-[13px] overflow-hidden bg-white flex-shrink-0">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Текст бренда */}
        <div className="flex flex-col gap-0">
          <span className="text-[13px] font-semibold leading-[1.061em] text-black">
            {name}
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
  );
}
