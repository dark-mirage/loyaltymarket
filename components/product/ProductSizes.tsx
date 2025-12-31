'use client'
import React, { useState } from 'react'
import Image from 'next/image'

interface ProductSizesProps {
  sizes: string[]
  availableSizes?: string[]
  onSizeSelect?: (size: string) => void
}

export default function ProductSizes({ 
  sizes, 
  availableSizes = [], 
  onSizeSelect 
}: ProductSizesProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  const handleSizeClick = (size: string) => {
    const isAvailable = availableSizes.length === 0 || availableSizes.includes(size)
    if (isAvailable) {
      setSelectedSize(size)
      onSizeSelect?.(size)
    }
  }

  const isSizeAvailable = (size: string) => {
    return availableSizes.length === 0 || availableSizes.includes(size)
  }

  return (
    <div className="px-4 py-4">
      <div className="flex flex-col gap-4">
        {/* Заголовок */}
        <div className="flex items-center gap-2">
          <h3 className="text-[13px] font-medium leading-[1.31em] text-black uppercase" style={{ fontFamily: 'Inter' }}>
            Размер EU
          </h3>
        </div>
        
        {/* Кнопки размеров */}
        <div className="flex gap-2 flex-wrap">
          {sizes.map((size) => {
            const isAvailable = isSizeAvailable(size)
            const isSelected = selectedSize === size

            return (
              <button
                key={size}
                onClick={() => handleSizeClick(size)}
                disabled={!isAvailable}
                className={`
                  min-w-[56px] h-[48px] px-4 rounded-[10px] flex items-center justify-center
                  text-[13px] font-medium transition-all uppercase
                  ${
                    !isAvailable
                      ? 'bg-transparent border border-[#D5D5D5] text-[#7E7E7E] cursor-not-allowed opacity-50'
                      : isSelected
                      ? 'bg-[#2D2D2D] text-white border-2 border-[#2D2D2D]'
                      : 'bg-transparent border border-[#D5D5D5] text-black hover:bg-[#F4F3F1]'
                  }
                `}
                style={{ fontFamily: 'Inter' }}
              >
                {size}
              </button>
            )
          })}
        </div>
        
        {/* Кнопка таблицы размеров */}
        <button
          className="flex items-center gap-1 text-[12px] font-normal leading-[1.31em] text-[#7B7B7B] hover:opacity-70 transition-opacity w-fit"
          style={{ fontFamily: 'Inter' }}
        >
          <span>Таблица размеров</span>
          <Image 
            src="/icons/global/Wrap.svg" 
            alt=""
            width={3.38}
            height={5.91}
            className="w-[3.38px] h-[5.91px]"
          />
        </button>
      </div>
    </div>
  )
}
