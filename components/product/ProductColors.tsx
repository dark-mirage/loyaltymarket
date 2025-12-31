'use client'
import React from 'react'

interface Color {
  name: string
  value: string
  available?: boolean
}

interface ProductColorsProps {
  colors: Color[]
  selectedColor?: string
  onColorSelect?: (color: Color) => void
}

export default function ProductColors({
  colors,
  selectedColor,
  onColorSelect
}: ProductColorsProps) {
  return (
    <div className="px-4 py-4">
      <h3 className="text-[13px] font-medium leading-[1.21em] text-black uppercase mb-3" style={{ fontFamily: 'Inter' }}>
        Цвет
      </h3>
      <div className="flex gap-3 flex-wrap">
        {colors.map((color, index) => {
          const isSelected = selectedColor === color.value
          const isAvailable = color.available !== false

          return (
            <button
              key={index}
              onClick={() => isAvailable && onColorSelect?.(color)}
              disabled={!isAvailable}
              className={`
                w-[50px] h-[50px] rounded-full flex items-center justify-center
                transition-all relative
                ${!isAvailable ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}
                ${isSelected ? 'ring-2 ring-[#2D2D2D] ring-offset-2' : ''}
              `}
              style={{ 
                backgroundColor: color.value,
                border: isSelected ? '2px solid #2D2D2D' : '1px solid #D5D5D5'
              }}
              aria-label={`Цвет ${color.name}`}
            >
              {!isAvailable && (
                <div className="absolute w-full h-[1px] bg-[#7E7E7E] rotate-45" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

