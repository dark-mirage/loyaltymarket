'use client'
import React from 'react';

interface BrandCardProps {
  name: string;
  image?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export default function BrandCard({ 
  name, 
  image, 
  isFavorite = false, 
  onToggleFavorite 
}: BrandCardProps) {
  return (
    <div className="flex items-center gap-[10px] pl-[12px] pr-[14px]  h-[60px] bg-[#F4F3F1] rounded-2xl overflow-hidden flex-shrink-0">
      {/* Изображение бренда */}
      {image && (
        <div className="w-[41px] h-[41px]">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Текст бренда */}
      <div className="flex flex-col gap-0 mr-[6px]">
        <span className="text-[13px] font-semibold leading-[1.06em] tracking-[0.01em] text-black">
          {name}
        </span>
        <span className="text-[13px] font-normal leading-[1.21em] tracking-[0.01em] text-[#7E7E7E]">
          Бренд
        </span>
      </div>

      {/* Кнопка избранного */}
      <button
        onClick={onToggleFavorite}
        className="w-[24px] h-[22px] flex items-center justify-center"
        aria-pressed={isFavorite}
      >
        <img
          src={isFavorite ? '/icons/global/active-heart.svg' : '/icons/global/not-active-heart.svg'}
          alt={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          className="w-full h-full"
        />
      </button>
    </div>
  );
}

