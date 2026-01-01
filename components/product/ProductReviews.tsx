'use client'
import React, { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Review {
  id: number
  userName: string
  avatar: string
  date: string
  rating: number
  productName?: string
  pros: string
  cons: string
}

interface RatingDistribution {
  5: number
  4: number
  3: number
  2: number
  1: number
}

interface ProductReviewsProps {
  brandName: string
  reviews: Review[]
  ratingDistribution: RatingDistribution
  onViewAll?: () => void
}

export default function ProductReviews({
  brandName,
  reviews,
  ratingDistribution,
  onViewAll
}: ProductReviewsProps) {
  // Расчет общего рейтинга и количества отзывов
  const { averageRating, totalReviews } = useMemo(() => {
    const { 5: r5 = 0, 4: r4 = 0, 3: r3 = 0, 2: r2 = 0, 1: r1 = 0 } = ratingDistribution
    const total = r5 + r4 + r3 + r2 + r1
    const sum = r5 * 5 + r4 * 4 + r3 * 3 + r2 * 2 + r1 * 1
    const average = total > 0 ? sum / total : 0
    return {
      averageRating: Math.round(average * 10) / 10,
      totalReviews: total
    }
  }, [ratingDistribution])

  // Рендер звезд
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className="w-[14px] h-[14px]"
            viewBox="0 0 14 14"
            fill={star <= rating ? '#2D2D2D' : 'none'}
            stroke="#2D2D2D"
            strokeWidth={star <= rating ? 0 : 1}
          >
            <path d="M7 0L8.5 5H14L9.5 8L11 13L7 10L3 13L4.5 8L0 5H5.5L7 0Z" />
          </svg>
        ))}
      </div>
    )
  }

  // Рендер гистограммы рейтинга (вертикальная стопка горизонтальных баров)
  const renderRatingBars = () => {
    const { 5: r5 = 0, 4: r4 = 0, 3: r3 = 0, 2: r2 = 0, 1: r1 = 0 } = ratingDistribution
    const maxCount = Math.max(r5, r4, r3, r2, r1)
    
    const bars = [
      { stars: 5, count: r5 },
      { stars: 4, count: r4 },
      { stars: 3, count: r3 },
      { stars: 2, count: r2 },
      { stars: 1, count: r1 },
    ]

    return (
      <div className="flex flex-col gap-[10px]" style={{ width: '45px', height: '48.61px' }}>
        {bars.map((bar, index) => {
          const width = maxCount > 0 ? (bar.count / maxCount) * 100 : 0
          
          return (
            <div key={index} className="relative" style={{ height: '8.61px', width: '100%' }}>
              {/* Полоса заполнения */}
              <div
                className="absolute left-0 top-0 rounded-sm"
                style={{
                  width: `${width}%`,
                  height: '100%',
                  backgroundColor: '#2D2D2D',
                  zIndex: 1,
                }}
              />
              {/* Фон полосы (серый) */}
              <div
                className="absolute left-0 top-0 rounded-sm"
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#E5E5E5',
                  zIndex: 0,
                }}
              />
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="px-4 py-4">
      <div className="bg-[#F4F3F1] rounded-[16px] p-[14px]">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-[34px]">
          <h2 className="text-[15px] font-bold leading-[1.16em] text-black uppercase" style={{ fontFamily: 'Inter' }}>
            Отзывы на {brandName}
          </h2>
          <Link href={`/reviews/${brandName.toLowerCase()}`} onClick={onViewAll}>
            <Image
              src="/icons/global/Wrap.svg"
              alt="Все отзывы"
              width={5.29}
              height={9.25}
              className="w-[5.29px] h-[9.25px]"
            />
          </Link>
        </div>

        {/* Общий рейтинг и гистограмма */}
        <div className="flex items-start gap-[21px] mb-[43px]">
          {/* Левый блок - Рейтинг */}
          <div className="flex flex-col">
            <div className="flex items-center gap-[3px] mb-[3px]">
              <span className="text-[20px] font-bold leading-[1.16em] text-[#2D2D2D] uppercase" style={{ fontFamily: 'Inter' }}>
                {averageRating}
              </span>
              <svg
                className="w-[14px] h-[14px]"
                viewBox="0 0 14 14"
                fill="#2D2D2D"
              >
                <path d="M7 0L8.5 5H14L9.5 8L11 13L7 10L3 13L4.5 8L0 5H5.5L7 0Z" />
              </svg>
            </div>
            <span className="text-[12px] font-normal leading-[1.06em] text-[#7E7E7E] uppercase" style={{ fontFamily: 'Inter' }}>
              {totalReviews} {totalReviews === 1 ? 'отзыв' : totalReviews < 5 ? 'отзыва' : 'отзывов'}
            </span>
          </div>

          {/* Гистограмма рейтинга */}
          <div style={{ width: '45px' }}>
            {renderRatingBars()}
          </div>
        </div>

        {/* Превью отзывов - горизонтальный скролл */}
        <div className="overflow-x-auto scrollbar-hide -mx-[14px] px-[14px]">
          <div className="flex gap-[23px] pb-2">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex-shrink-0 bg-white rounded-[16px] p-[14px]"
                style={{ width: '209px' }}
              >
                {/* Аватар, имя, дата, рейтинг */}
                <div className="flex gap-[14px] mb-[14px]">
                  <div className="w-[32px] h-[32px] rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={review.avatar}
                      alt={review.userName}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    {renderStars(review.rating)}
                    {review.productName && (
                      <p className="text-[12px] font-normal leading-[1.21em] text-[#7E7E7E] uppercase mt-[1px]" style={{ fontFamily: 'Inter' }}>
                        {review.productName}
                      </p>
                    )}
                    <div className="flex items-center gap-[4px] mt-[1px]">
                      <span className="text-[12px] font-normal leading-[1.21em] text-[#7E7E7E] uppercase" style={{ fontFamily: 'Inter' }}>
                        {review.userName}
                      </span>
                      <div className="w-[2px] h-[2px] bg-[#7E7E7E] rounded-full" />
                      <span className="text-[12px] font-normal leading-[1.21em] text-[#7E7E7E] uppercase" style={{ fontFamily: 'Inter' }}>
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Текст отзыва */}
                <div className="space-y-[10px]">
                  {/* Достоинства */}
                  <div>
                    <p className="text-[13px] font-normal leading-[1.21em] text-[#8F8F8F] uppercase whitespace-pre-line" style={{ fontFamily: 'Inter', letterSpacing: '-0.01em' }}>
                      <span className="font-semibold">Достоинства:</span> {review.pros}
                    </p>
                  </div>

                  {/* Недостатки */}
                  <div>
                    <p className="text-[13px] font-normal leading-[1.21em] text-[#8F8F8F] uppercase whitespace-pre-line" style={{ fontFamily: 'Inter', letterSpacing: '-0.01em' }}>
                      <span className="font-semibold">Недостатки:</span> {review.cons}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
