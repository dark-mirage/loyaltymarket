'use client'
import React from 'react'
import ReviewCard, { Review } from './ReviewCard'

interface ReviewsGridProps {
  reviews: Review[]
}

/**
 * Компонент сетки отзывов (2 колонки)
 */
export default function ReviewsGrid({ reviews }: ReviewsGridProps) {
  if (reviews.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-[14px] font-normal text-[#7E7E7E]">
          Пока нет отзывов
        </p>
      </div>
    )
  }

  return (
    <div className="px-4 py-4 bg-[#F4F3F1]">
      <div className="grid grid-cols-2 gap-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
}





