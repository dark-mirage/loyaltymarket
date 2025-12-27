'use client'
import React, { useState } from 'react'
import SizeTableModal from './SizeTableModal'

interface ProductSizesProps {
  sizes: string[]
  availableSizes?: string[]
  onSizeSelect?: (size: string) => void
}

/**
 * Компонент выбора размера товара
 */
export default function ProductSizes({ 
  sizes, 
  availableSizes = [], 
  onSizeSelect 
}: ProductSizesProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [isSizeTableModalOpen, setIsSizeTableModalOpen] = useState(false)

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
    <div className="px-4 py-4 bg-white" style={{ paddingLeft: '16px', paddingTop: '238px' }}>
      <div className="flex flex-col gap-[14px]" style={{ width: '301px' }}>
        {/* Заголовок с индикатором */}
        <div className="flex items-center gap-2" style={{ width: '74px', height: '9px' }}>
          <span className="text-[12px] font-normal leading-[1.31em] text-black uppercase" style={{ fontFamily: 'Inter' }}>
            Размер    eu
          </span>
          <div className="w-[2px] h-[2px] bg-black rounded-full" />
        </div>
        
        {/* Кнопки размеров */}
        <div className="flex gap-[5px]">
          {sizes.map((size) => {
            const isAvailable = isSizeAvailable(size)
            const isSelected = selectedSize === size

            return (
              <button
                key={size}
                onClick={() => handleSizeClick(size)}
                disabled={!isAvailable}
                className={`
                  w-[56px] h-[48px] rounded-[10px] flex items-center justify-center
                  text-[13px] font-medium transition-all uppercase
                  ${
                    !isAvailable
                      ? 'bg-transparent border border-[#D5D5D5] text-[#7E7E7E] cursor-not-allowed opacity-50'
                      : isSelected
                      ? 'bg-transparent border-2 border-[#2D2D2D] text-black'
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
          onClick={() => setIsSizeTableModalOpen(true)}
          className="flex items-center gap-0 text-[12px] font-normal leading-[1.31em] text-[#7B7B7B] hover:opacity-70 transition-opacity"
          style={{ width: '118px', height: '9px', fontFamily: 'Inter' }}
        >
          <span>Таблица размеров</span>
          <img 
            src="/icons/global/Wrap.svg" 
            alt=""
            className="w-[3.38px] h-[5.91px] ml-[3px]"
          />
        </button>
      </div>

      <SizeTableModal
        open={isSizeTableModalOpen}
        onClose={() => setIsSizeTableModalOpen(false)}
      />
    </div>
  )
}


