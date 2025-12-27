'use client'
import React from 'react'
import { Star } from 'lucide-react'

export interface Review {
  id: number
  rating: number
  title?: string
  date?: string
  pros: string
  cons: string
  avatar: string
  userName?: string
}

interface ReviewCardProps {
  review: Review
}

/**
 * Компонент карточки отзыва
 */
export default function ReviewCard({ review }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${
          index < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ))
  }

  return (
    <div className="border border-[#F4F3F1] rounded-2xl p-3 bg-white">
      {/* Заголовок отзыва */}
      <div className="flex items-start gap-2 mb-2">
        <img
          src={review.avatar}
          alt={review.userName || 'Пользователь'}
          className="w-6 h-6 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex gap-0.5 mb-1">
            {renderStars(review.rating)}
          </div>
          {review.title && (
            <p className="text-[12px] font-medium text-black mt-1 truncate">
              {review.title}
            </p>
          )}
          {review.date && (
            <p className="text-[12px] font-normal text-[#7E7E7E]">
              {review.date}
            </p>
          )}
        </div>
      </div>

      {/* Контент отзыва */}
      <div className="space-y-2">
        {/* Достоинства */}
        <div>
          <p className="text-[12px] font-semibold text-black mb-0.5">
            Достоинства:{' '}
            <span className="font-normal">{review.pros}</span>
          </p>
        </div>

        {/* Недостатки */}
        <div>
          <p className="text-[12px] font-semibold text-black mb-0.5">
            Недостатки:{' '}
            <span className="font-normal text-[#FF4444]">{review.cons}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

