'use client'
import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface ReviewsHeaderProps {
  brandName: string
  onBack?: () => void
}

/**
 * Компонент заголовка страницы отзывов
 */
export default function ReviewsHeader({ brandName, onBack }: ReviewsHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-[#F4F3F1]">
      <h1 className="text-[18px] font-semibold text-black">
        Отзывы на {brandName}
      </h1>
      {onBack ? (
        <button
          onClick={onBack}
          className="text-[#7E7E7E] hover:text-black transition-colors"
          aria-label="Назад"
        >
          <ChevronRight size={20} />
        </button>
      ) : (
        <Link
          href="/"
          className="text-[#7E7E7E] hover:text-black transition-colors"
          aria-label="Назад"
        >
          <ChevronRight size={20} />
        </Link>
      )}
    </div>
  )
}





