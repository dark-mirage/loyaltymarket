'use client'
import React from 'react'

interface ProductBrandDeliveryProps {
  brand?: string
  deliveryDate?: string
  pickupPoint?: string
  country?: string
}

/**
 * Компонент блока доставки бренда
 */
export default function ProductBrandDelivery({
  brand,
  deliveryDate,
  pickupPoint,
  country,
}: ProductBrandDeliveryProps) {
  return (
    <div className="px-4 py-4 bg-white border-t border-[#F4F3F1]">
      <div className="space-y-3">
        {/* Бренд */}
        {brand && (
          <div className="flex justify-between items-center">
            <span className="text-[14px] font-normal text-[#7E7E7E]">
              Бренд
            </span>
            <span className="text-[14px] font-medium text-black">
              {brand}
            </span>
          </div>
        )}

        {/* Страна */}
        {country && (
          <div className="flex justify-between items-center">
            <span className="text-[14px] font-normal text-[#7E7E7E]">
              Страна
            </span>
            <span className="text-[14px] font-medium text-black">
              {country}
            </span>
          </div>
        )}

        {/* Пункт выдачи */}
        {pickupPoint && (
          <div className="flex justify-between items-center">
            <span className="text-[14px] font-normal text-[#7E7E7E]">
              Пункт выдачи
            </span>
            <span className="text-[14px] font-medium text-black text-right max-w-[60%]">
              {pickupPoint}
            </span>
          </div>
        )}

        {/* Доставка */}
        {deliveryDate && (
          <div className="flex justify-between items-center">
            <span className="text-[14px] font-normal text-[#7E7E7E]">
              Доставка
            </span>
            <span className="text-[14px] font-medium text-black">
              {deliveryDate}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}


