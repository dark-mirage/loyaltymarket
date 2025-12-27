'use client'
import React from 'react'

interface ProductActionsProps {
  isFavorite: boolean
  onToggleFavorite: () => void
  onAddToCart?: () => void
  onBuy?: () => void
}

/**
 * Компонент кнопок действий для товара (избранное, корзина, купить)
 */
export default function ProductActions({ 
  isFavorite, 
  onToggleFavorite, 
  onAddToCart, 
  onBuy 
}: ProductActionsProps) {
  return (
    <div className="px-4 py-4 bg-white border-t border-[#F4F3F1]">
      <div className="flex gap-3">
        {/* Кнопка избранного */}
        <button
          onClick={onToggleFavorite}
          className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#F4F3F1] flex items-center justify-center"
          aria-pressed={isFavorite}
          aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
          <img
            src={isFavorite ? '/icons/global/active-heart.svg' : '/icons/global/not-active-heart.svg'}
            alt={isFavorite ? 'В избранном' : 'Добавить в избранное'}
            className="w-6 h-6"
          />
        </button>

        {/* Кнопка добавления в корзину */}
        {onAddToCart && (
          <button
            onClick={onAddToCart}
            className="flex-1 h-12 rounded-2xl bg-[#F4F3F1] text-[15px] font-semibold text-black"
          >
            В корзину
          </button>
        )}

        {/* Кнопка покупки */}
        {onBuy && (
          <button
            onClick={onBuy}
            className="flex-1 h-12 rounded-2xl bg-black text-[15px] font-semibold text-white"
          >
            Купить
          </button>
        )}
      </div>
    </div>
  )
}


