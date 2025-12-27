'use client'
import React, { useState } from 'react'
import ProductInfo from './ProductInfo'

interface ProductImageGalleryProps {
  images: string[]
  productName: string
  productBrand: string
}

/**
 * Компонент галереи изображений товара
 */
export default function ProductImageGallery({ images, productName, productBrand }: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index)
  }

  return (
    <div className="relative w-full">
      {/* Основное изображение */}
      <div className="relative w-full bg-[#F4F3F1] overflow-hidden" style={{ height: '395px' }}>
        <img
          src={images[currentImageIndex] || images[0]}
          alt={`${productName} - изображение ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Кнопка избранного поверх изображения */}
        <div className="absolute" style={{ right: '17px', bottom: '45px' }}>
          <button
            className="w-[98px] h-[41px] bg-white/40 backdrop-blur-[14.9px] rounded-[10px] flex items-center justify-center gap-2 shadow-[0px_0px_49.4px_0px_rgba(0,0,0,0.11)]"
            aria-label="Добавить в избранное"
          >
            <img
              src="/icons/global/not-active-heart.svg"
              alt="Избранное"
              className="w-[22px] h-[20px]"
            />
            <img
              src="/icons/global/arrow.svg"
              alt=""
              className="w-[19px] h-[20px]"
            />
          </button>
        </div>
        
        {/* Индикатор текущего изображения */}
        {images.length > 1 && (
          <div className="absolute" style={{ bottom: '8px', left: '195px' }}>
            <div className="flex gap-[10px]">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`transition-all ${
                    index === currentImageIndex 
                      ? 'w-[5px] h-[5px] bg-[#595959]' 
                      : 'w-[3px] h-[3px] bg-[#C1C1C1]'
                  } rounded-full`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <ProductInfo
        productName={productName}
        productBrand={productBrand}
        categories={['Одежда, обувь и аксессуары', 'Одежда', 'Зип худи', 'diesel']}
      />
    </div>
  )
}


