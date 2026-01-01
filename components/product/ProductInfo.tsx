'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface ProductInfoProps {
  productName: string
  brand: string
  brandLink?: string
  images?: string[]
  currentImageIndex?: number
  onImageChange?: (index: number) => void
}

export default function ProductInfo({
  productName,
  brand,
  brandLink,
  images = [],
  currentImageIndex = 0,
  onImageChange
}: ProductInfoProps) {
  return (
    <div className="px-4 py-4">
      {/* Название товара */}
      <h1 className="text-[20px] font-bold leading-[1.57em] tracking-[-0.01em] text-black uppercase mb-2" style={{ fontFamily: 'Inter' }}>
        {productName}
      </h1>
      
      {/* Бренд */}
      {brandLink ? (
        <Link 
          href={brandLink}
          className="text-[15px] font-medium leading-[1.21em] text-[#7B7B7B] hover:text-black transition-colors"
          style={{ fontFamily: 'Inter' }}
        >
          {brand}
        </Link>
      ) : (
        <p className="text-[15px] font-medium leading-[1.21em] text-[#7B7B7B]" style={{ fontFamily: 'Inter' }}>
          {brand}
        </p>
      )}

      {images.length > 1 && (
        <div className="pl-[8px] py-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => onImageChange?.(index)}
                className={`relative flex-shrink-0 rounded-[10px] overflow-hidden transition-all ${
                  index === currentImageIndex 
                    ? 'ring-2 ring-[#2D2D2D]' 
                    : 'opacity-60 hover:opacity-80'
                }`}
                style={{ width: '80px', height: '80px' }}
              >
                <Image
                  src={image}
                  alt={`Миниатюра ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
