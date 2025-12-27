'use client'
import React from 'react'
import { Star } from 'lucide-react'

export interface RatingStat {
  stars: number
  count: number
  percentage: number
}

interface ReviewsRatingSummaryProps {
  averageRating: number
  totalReviews: number
  ratingStats: RatingStat[]
  productImages?: string[]
}

/**
 * Компонент сводки рейтинга с распределением по звездам
 */
export default function ReviewsRatingSummary({
  averageRating,
  totalReviews,
  ratingStats,
  productImages = [],
}: ReviewsRatingSummaryProps) {
  const renderSmallStars = (count: number) => {
    return Array.from({ length: count }, (_, index) => (
      <Star
        key={index}
        className="w-2 h-2 fill-black text-black"
      />
    ))
  }

  return (
    <div className="px-4 py-4 bg-white border-b border-[#F4F3F1]">
      <div className="flex items-start gap-4">
        {/* Левая часть - Общий рейтинг */}
        <div className="flex flex-col items-start">
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-[32px] font-bold text-black leading-none">
              {averageRating.toFixed(1)}
            </span>
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          </div>
          <span className="text-[12px] font-normal text-[#7E7E7E]">
            {totalReviews} {totalReviews === 1 ? 'отзыв' : totalReviews < 5 ? 'отзыва' : 'отзывов'}
          </span>
        </div>

        {/* Центральная часть - Распределение рейтингов */}
        <div className="flex-1 space-y-1">
          {ratingStats.map((stat) => (
            <div key={stat.stars} className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {renderSmallStars(stat.stars)}
              </div>
              <div className="flex-1 bg-[#F4F3F1] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-black h-full rounded-full transition-all"
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Правая часть - Изображения товаров */}
        {productImages.length > 0 && (
          <div className="flex gap-1">
            {productImages.slice(0, 2).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Товар ${index + 1}`}
                className="w-10 h-10 rounded-lg object-cover"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}





