'use client'
import React from 'react';

interface LoyaltyProgramCard2Props {
  name: string;
  category?: string;
  description?: string;
  benefits?: string[];
  level?: string;
  points?: number;
  image?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onDetailsClick?: () => void;
}

export default function LoyaltyProgramCard2({
  name,
  category,
  description,
  benefits,
  level,
  points,
  image,
  isFavorite = false,
  onToggleFavorite,
  onDetailsClick
}: LoyaltyProgramCard2Props) {
  return (
    <div className="bg-white rounded-2xl p-[16px] w-full max-w-[343px] relative shadow-sm">
      {/* Кнопка избранного */}
      {onToggleFavorite && (
        <button
          onClick={onToggleFavorite}
          className="absolute top-[16px] right-[16px] w-[24px] h-[22px] flex items-center justify-center z-10"
          aria-pressed={isFavorite}
        >
          <img
            src={isFavorite ? '/icons/global/active-heart.svg' : '/icons/global/not-active-heart.svg'}
            alt={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
            className="w-full h-full"
          />
        </button>
      )}

      {/* Заголовок с логотипом */}
      <div className="flex items-center gap-[12px] mb-[12px]">
        {image && (
          <div className="w-[40px] h-[40px] rounded-full overflow-hidden flex-shrink-0 bg-[#F4F3F1]">
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex flex-col gap-0 flex-1 min-w-0">
          <h3 className="text-[16px] font-semibold leading-[1.2em] tracking-[0.01em] text-black truncate">
            {name}
          </h3>
          {category && (
            <p className="text-[13px] font-normal leading-[1.21em] tracking-[0.01em] text-[#7E7E7E]">
              {category}
            </p>
          )}
        </div>
      </div>

      {/* Описание */}
      {description && (
        <div className="mb-[12px]">
          <p className="text-[13px] font-normal leading-[1.21em] tracking-[0.01em] text-black">
            {description}
          </p>
        </div>
      )}

      {/* Список преимуществ */}
      {benefits && benefits.length > 0 && (
        <div className="mb-[12px]">
          <ul className="list-none space-y-[4px]">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-[8px]">
                <span className="text-[13px] font-normal leading-[1.21em] tracking-[0.01em] text-black">
                  • {benefit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Информация об уровне и баллах */}
      <div className="flex justify-between items-center mb-[16px] pt-[12px] border-t border-[#E5E5E5]">
        {level && (
          <div className="flex flex-col gap-0">
            <span className="text-[13px] font-normal leading-[1.21em] tracking-[0.01em] text-[#7E7E7E] mb-[2px]">
              Уровень
            </span>
            <span className="text-[13px] font-semibold leading-[1.06em] tracking-[0.01em] text-black">
              {level}
            </span>
          </div>
        )}
        {points !== undefined && (
          <div className="flex flex-col gap-0 items-end">
            <span className="text-[13px] font-normal leading-[1.21em] tracking-[0.01em] text-[#7E7E7E] mb-[2px]">
              Баллы
            </span>
            <span className="text-[13px] font-semibold leading-[1.06em] tracking-[0.01em] text-black">
              {points.toLocaleString('ru-RU')}
            </span>
          </div>
        )}
      </div>

      {/* Кнопка "Подробнее" */}
      {onDetailsClick && (
        <button
          onClick={onDetailsClick}
          className="w-full h-[40px] bg-black text-white rounded-2xl flex items-center justify-center transition-colors hover:bg-neutral-900"
        >
          <span className="text-[13px] font-semibold leading-[1.06em] tracking-[0.02em]">
            Подробнее
          </span>
        </button>
      )}
    </div>
  );
}




