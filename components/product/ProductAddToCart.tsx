'use client'
import React, { useState } from 'react'

interface ProductAddToCartProps {
  onAddToCart?: () => void
  onBuyNow?: () => void
  quantity?: number
  onQuantityChange?: (quantity: number) => void
}

export default function ProductAddToCart({
  onAddToCart,
  onBuyNow,
  quantity = 1,
  onQuantityChange
}: ProductAddToCartProps) {
  const [currentQuantity, setCurrentQuantity] = useState(quantity)

  const handleDecrease = () => {
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1
      setCurrentQuantity(newQuantity)
      onQuantityChange?.(newQuantity)
    }
  }

  const handleIncrease = () => {
    const newQuantity = currentQuantity + 1
    setCurrentQuantity(newQuantity)
    onQuantityChange?.(newQuantity)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#CDCDCD] p-4 z-50 md:relative md:border-0 md:p-4">
      <div className="max-w-md mx-auto flex items-center gap-3">
        {/* Счетчик количества */}
        <div className="flex items-center bg-[#F4F3F1] rounded-[16px] px-4 py-3">
          <button
            onClick={handleDecrease}
            disabled={currentQuantity <= 1}
            className="text-[28.63px] font-light leading-[1.21em] text-black disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ fontFamily: 'Inter' }}
          >
            −
          </button>
          <span className="text-[15px] font-medium leading-[1.21em] text-black mx-6" style={{ fontFamily: 'Inter' }}>
            {currentQuantity}
          </span>
          <button
            onClick={handleIncrease}
            className="text-[28.63px] font-light leading-[1.21em] text-black"
            style={{ fontFamily: 'Inter' }}
          >
            +
          </button>
        </div>

        {/* Кнопка добавления в корзину */}
        <button
          onClick={onAddToCart}
          className="flex-1 bg-[#F4F3F1] rounded-[16px] py-4 px-6 text-center hover:bg-[#E5E5E5] transition-colors"
        >
          <span className="text-[15px] font-medium leading-[1.06em] tracking-[0.02em] text-black uppercase" style={{ fontFamily: 'Inter' }}>
            В корзину
          </span>
        </button>

        {/* Кнопка купить сейчас */}
        {onBuyNow && (
          <button
            onClick={onBuyNow}
            className="flex-1 bg-[#2D2D2D] rounded-[16px] py-4 px-6 text-center hover:bg-[#1A1A1A] transition-colors"
          >
            <span className="text-[15px] font-medium leading-[1.06em] tracking-[0.02em] text-white uppercase" style={{ fontFamily: 'Inter' }}>
              Купить сейчас
            </span>
          </button>
        )}
      </div>
    </div>
  )
}

