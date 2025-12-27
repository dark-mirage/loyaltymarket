'use client'
import React from 'react'

interface ProductDetailsProps {
  size?: string
  country?: string
  pickupPoint?: string
  deliveryDate?: string
}

/**
 * Компонент деталей товара (размер, страна, пункт выдачи, дата доставки)
 */
export default function ProductDetails({ 
  size, 
  country, 
  pickupPoint, 
  deliveryDate 
}: ProductDetailsProps) {
  const details = [
    { label: 'Размер', value: size },
    { label: 'Страна', value: country },
    { label: 'Пункт выдачи', value: pickupPoint },
    { label: 'Доставка', value: deliveryDate },
  ].filter(item => item.value) // Фильтруем только заполненные поля

  if (details.length === 0) {
    return null
  }

  return (
    <div className="px-4 py-4 bg-white border-t border-[#F4F3F1]">
      <div className="space-y-3">
        {details.map((detail, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-[14px] font-normal text-[#7E7E7E]">
              {detail.label}
            </span>
            <span className="text-[14px] font-medium text-black">
              {detail.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}





