'use client'
import React from 'react'

interface ProductInfoProps {
  productName: string
  productBrand: string
  categories?: string[]
}

/**
 * Компонент информации о товаре (название, бренд, категории, цвета)
*/

export default function ProductInfo({ productName, productBrand, categories = [] }: ProductInfoProps) {
  return (
    <div className="px-4 py-4 bg-white">
      {/* Название и бренд */}
      <div className="mb-[10px]" style={{ paddingLeft: '15px', paddingTop: '77px' }}>
        <div className="flex flex-col gap-0" style={{ width: '89px' }}>
          <h2 className="text-[20px] font-semibold leading-[1.57em] tracking-[-0.01em] text-black uppercase" style={{ fontFamily: 'Inter' }}>
            {productBrand}
          </h2>
          <span className="text-[12px] font-semibold leading-[1.31em] text-[#7B7B7B] uppercase" style={{ fontFamily: 'Inter' }}>
            {productName}
          </span>
        </div>
      </div>

      {/* Хлебные крошки категорий */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-[3px] mb-[10px]" style={{ paddingLeft: '16px', paddingTop: '22px' }}>
          {categories.map((category, index) => (
            <button
              key={index}
              className="bg-[#F4F3F1] rounded-[10px] px-[12px] py-[11px] flex items-center gap-[6.55px]"
            >
              <span className="text-[13px] font-medium leading-[1.79em] text-black uppercase" style={{ fontFamily: 'Inter' }}>
                {category}
              </span>
              <img 
                src="/icons/global/Wrap.svg" 
                alt=""
                className="w-[3.49px] h-[6.1px]"
              />
            </button>
          ))}
        </div>
      )}

      {/* Цвета (заглушка) */}
      <div className="flex gap-[5px]" style={{ paddingLeft: '16px', paddingTop: '133px' }}>
        {/* Здесь будут цвета товара */}
      </div>
    </div>
  )
}

