'use client'
import React, { useState } from 'react'
import Image from 'next/image'

interface ProductImageGalleryProps {
  images: string[]
  productName: string
  isFavorite?: boolean
  onToggleFavorite?: () => void
  currentImageIndex?: number
  onImageChange?: (index: number) => void
}

export default function ProductImageGallery({
  images,
  productName,
  isFavorite = false,
  onToggleFavorite,
  currentImageIndex: externalImageIndex,
  onImageChange
}: ProductImageGalleryProps) {
  const [internalImageIndex, setInternalImageIndex] = useState(0)
  const currentImageIndex = externalImageIndex !== undefined ? externalImageIndex : internalImageIndex
  
  const setCurrentImageIndex = (index: number) => {
    if (onImageChange) {
      onImageChange(index)
    } else {
      setInternalImageIndex(index)
    }
  }
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<number | null>(null)

  const minSwipeDistance = 50

  // Обработчики для тач-устройств
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  // Обработчики для мыши
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart(e.clientX)
  }

  const onMouseMove = () => {
    if (!isDragging || dragStart === null) return
  }

  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || dragStart === null) return
    
    const distance = dragStart - e.clientX
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }

    setIsDragging(false)
    setDragStart(null)
  }

  const onMouseLeave = () => {
    setIsDragging(false)
    setDragStart(null)
  }

  return (
    <div className="w-full">
      {/* Основное изображение */}
      <div 
        className="relative w-full bg-[#F4F3F1] overflow-hidden cursor-grab active:cursor-grabbing select-none"
        style={{ height: '395px' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <div 
          className="flex transition-transform duration-300 ease-out"
          style={{ 
            transform: `translateX(-${currentImageIndex * 100}%)`,
            width: `${images.length * 100}%`,
            height: '100%'
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="relative flex-shrink-0"
              style={{ width: `${100 / images.length}%`, height: '100%' }}
            >
              <Image
                src={image}
                alt={`${productName} - изображение ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
        
        {/* Кнопки избранного и поделиться */}
        <div className="absolute bg-white p-[10px]" style={{ right: '17px', bottom: '45px' }}>
          <div className="flex items-center gap-[21px]">
            {/* Избранное */}
            <button
              onClick={onToggleFavorite}
              className="w-[41px] h-[41px] bg-white/40 backdrop-blur-[14.9px] rounded-[10px] flex items-center justify-center shadow-[0px_0px_49.4px_0px_rgba(0,0,0,0.11)]"
              aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
            >
              <Image
                src={isFavorite ? '/icons/global/active-heart.svg' : '/icons/global/not-active-heart.svg'}
                alt="Избранное"
                width={22}
                height={20}
                className="w-[22px] h-[20px]"
              />
            </button>
            
            {/* Поделиться */}
            <button
              className="w-[41px] h-[41px] bg-white/40 backdrop-blur-[14.9px] rounded-[10px] flex items-center justify-center shadow-[0px_0px_49.4px_0px_rgba(0,0,0,0.11)]"
              aria-label="Поделиться"
            >
              <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 0.86L16.94 18.86" stroke="#2D2D2D" strokeWidth="2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>


    </div>
  )
}
