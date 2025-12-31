'use client'
import React from 'react'

interface ProductDeliveryProps {
  deliveryDate: string
  country: string
  pickupPrice?: string
}

export default function ProductDelivery({
  deliveryDate,
  country,
  pickupPrice
}: ProductDeliveryProps) {
  return (
    <div className="px-4 py-4">
      <div className="bg-[#F4F3F1] rounded-[16px] p-4">
        <div className="flex items-start gap-3">
          {/* Иконка грузовика */}
          <div className="flex-shrink-0 mt-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 3H15V13H1V3Z" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 7H19L22 10V13H15V7Z" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="5" cy="17" r="2" stroke="#2D2D2D" strokeWidth="2"/>
              <circle cx="19" cy="17" r="2" stroke="#2D2D2D" strokeWidth="2"/>
            </svg>
          </div>

          {/* Информация о доставке */}
          <div className="flex-1">
            <h3 className="text-[15px] font-bold leading-[1.16em] text-black uppercase mb-2" style={{ fontFamily: 'Inter' }}>
              ДОСТАВКА
            </h3>
            <div className="flex items-start gap-2 mb-2">
              <div className="w-[8px] h-[8px] bg-[#E5E5E5] rounded-full mt-1.5 flex-shrink-0" />
              <div>
                <p className="text-[13px] font-semibold leading-[1.06em] text-black uppercase" style={{ fontFamily: 'Inter' }}>
                  {deliveryDate}, {country}
                </p>
                {pickupPrice && (
                  <p className="text-[13px] font-normal leading-[1.06em] text-[#7E7E7E] lowercase mt-1" style={{ fontFamily: 'Inter' }}>
                    В пункт выдачи от {pickupPrice}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

