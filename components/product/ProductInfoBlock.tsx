'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface ProductInfoBlockProps {
  images: string[]
  productName: string
  brand: string
  categories: string[]
  colors?: Array<{ name: string; value: string }>
  sizes: string[]
  availableSizes?: string[]
  onSizeSelect?: (size: string) => void
}

export default function ProductInfoBlock({
  images,
  productName,
  brand,
  categories,
  colors = [],
  sizes,
  availableSizes = [],
  onSizeSelect
}: ProductInfoBlockProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<number | null>(null)

  // Минимальное расстояние для свайпа
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

  // Обработчики для мыши (десктоп)
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart(e.clientX)
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || dragStart === null) return
    // Можно добавить визуальную обратную связь при перетаскивании
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
    <div className="relative w-full">
      {/* Изображение товара */}
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
        
        {/* Кнопка избранного и поделиться */}
        <div className="absolute" style={{ right: '17px', bottom: '45px' }}>
          <button
            className="w-[98px] h-[41px] bg-white/40 backdrop-blur-[14.9px] rounded-[10px] flex items-center justify-center gap-[21px] shadow-[0px_0px_49.4px_0px_rgba(0,0,0,0.11)]"
            aria-label="Избранное и поделиться"
          >
            <Image
              src="/icons/global/not-active-heart.svg"
              alt="Избранное"
              width={22}
              height={20}
              className="w-[22px] h-[20px]"
            />
            <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 0.86L16.94 18.86" stroke="#2D2D2D" strokeWidth="2"/>
            </svg>
          </button>
        </div>
        
        {/* Индикатор текущего изображения (точки) */}
        {images.length > 1 && (
          <div className="absolute" style={{ bottom: '8px', left: '195px' }}>
            <div className="flex gap-[10px]">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`transition-all rounded-full ${
                    index === currentImageIndex 
                      ? 'w-[5px] h-[5px] bg-[#595959]' 
                      : 'w-[3px] h-[3px] bg-[#C1C1C1]'
                  }`}
                  aria-label={`Изображение ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Блок информации */}
      <div className="px-4" style={{ paddingLeft: '0px', paddingTop: '0px' }}>
        {/* Название и бренд */}
        <div className="flex flex-col gap-[10px]" style={{ paddingLeft: '15px', paddingTop: '77px', width: '89px' }}>
          <span className="text-[12px] font-semibold leading-[1.31em] text-[#7B7B7B] uppercase" style={{ fontFamily: 'Inter' }}>
            {productName}
          </span>
          <h2 className="text-[20px] font-semibold leading-[1.57em] tracking-[-0.01em] text-black uppercase" style={{ fontFamily: 'Inter' }}>
            {brand}
          </h2>
        </div>

        {/* Хлебные крошки категорий */}
        <div className="flex flex-wrap gap-[3px]" style={{ paddingLeft: '16px', paddingTop: '22px' }}>
          {categories.map((category, index) => (
            <Link
              key={index}
              href={`/catalog/${category.toLowerCase().replace(/\s+/g, '-')}`}
              className="bg-[#F4F3F1] rounded-[10px] px-[12px] py-[11px] flex items-center gap-[6.55px]"
            >
              <span className={`text-[13px] leading-[1.79em] text-black uppercase ${
                index === 0 ? 'font-medium' : 'font-normal'
              }`} style={{ fontFamily: 'Inter' }}>
                {category}
              </span>
              <Image
                src="/icons/global/Wrap.svg"
                alt=""
                width={3.49}
                height={6.1}
                className="w-[3.49px] h-[6.1px]"
              />
            </Link>
          ))}
        </div>

        {/* Цвета */}
        {colors.length > 0 && (
          <div className="flex gap-[5px]" style={{ paddingLeft: '16px', paddingTop: '56px' }}>
            {colors.map((color, index) => (
              <button
                key={index}
                className="w-[83px] h-[83px] rounded-[10px] border border-[#D5D5D5] flex items-center justify-center"
                style={{ backgroundColor: color.value }}
                aria-label={`Цвет ${color.name}`}
              />
            ))}
          </div>
        )}

        {/* Размеры */}
        <div className="flex flex-col gap-[14px]" style={{ paddingLeft: '16px', paddingTop: '238px', width: '301px' }}>
          {/* Заголовок с индикатором */}
          <div className="flex items-center gap-2" style={{ width: '74px', height: '9px' }}>
            <span className="text-[12px] font-normal leading-[1.31em] text-black uppercase" style={{ fontFamily: 'Inter' }}>
              Размер    eu
            </span>
            <div className="w-[2px] h-[2px] bg-black rounded-full" />
          </div>
          
          {/* Кнопки размеров */}
          <div className="flex gap-[5px] relative">
            {sizes.map((size) => {
              const isAvailable = isSizeAvailable(size)
              const isSelected = selectedSize === size

              return (
                <React.Fragment key={size}>
                  <button
                    onClick={() => handleSizeClick(size)}
                    disabled={!isAvailable}
                    className={`
                      w-[56px] h-[48px] rounded-[10px] flex items-center justify-center
                      text-[13px] font-medium transition-all uppercase relative
                      ${
                        !isAvailable
                          ? 'bg-transparent border border-[#D5D5D5] text-[#7E7E7E] cursor-not-allowed opacity-50'
                          : isSelected
                          ? 'bg-transparent border border-[#2D2D2D] text-black'
                          : 'bg-transparent border border-[#D5D5D5] text-black hover:bg-[#F4F3F1]'
                      }
                    `}
                    style={{ 
                      fontFamily: 'Inter',
                      borderWidth: isSelected ? '2px' : '1.43px'
                    }}
                  >
                    {size}
                  </button>
                  {/* Прямоугольник за выбранным размером */}
                  {isSelected && (
                    <div 
                      className="absolute rounded-[10.88px]" 
                      style={{ 
                        left: `${sizes.indexOf(size) * 61}px`,
                        top: '0',
                        width: '55px',
                        height: '48px',
                        backgroundColor: 'rgba(217, 217, 217, 0)',
                        zIndex: -1
                      }} 
                    />
                  )}
                </React.Fragment>
              )
            })}
          </div>
          
          {/* Кнопка таблицы размеров */}
          <button
            className="flex items-center gap-0 text-[12px] font-normal leading-[1.31em] text-[#7B7B7B] hover:opacity-70 transition-opacity"
            style={{ width: '118px', height: '9px', fontFamily: 'Inter' }}
          >
            <span>Таблица размеров</span>
            <Image 
              src="/icons/global/Wrap.svg" 
              alt=""
              width={3.38}
              height={5.91}
              className="w-[3.38px] h-[5.91px] ml-[3px]"
            />
          </button>
        </div>
      </div>
    </div>
  )
}

