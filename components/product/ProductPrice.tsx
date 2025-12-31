'use client'
import React from 'react'
import Image from 'next/image'

interface ProductPriceProps {
  price: string
  splitPayment?: {
    count: number
    amount: string
    text?: string
  }
  deliveryInfo?: string
}

export default function ProductPrice({
  price,
  splitPayment,
  deliveryInfo
}: ProductPriceProps) {
  return (
    <div className="px-4 py-4">
      <div className="bg-[#F4F3F1] rounded-[16px] p-4">
        {/* Цена */}
        <div className="mb-3">
          <h2 className="text-[28.998px] font-semibold leading-[1.06em] tracking-[-0.04em] text-black uppercase mb-2" style={{ fontFamily: 'Inter' }}>
            {price}
          </h2>
          {deliveryInfo && (
            <div className="flex items-center gap-2">
              <p className="text-[12px] font-normal leading-[1.36em] text-[#7B7B7B] uppercase" style={{ fontFamily: 'Inter' }}>
                {deliveryInfo}
              </p>
              <div className="w-[13.45px] h-[13.45px] rounded-full overflow-hidden">
                <Image
                  src="/icons/global/logo-icon.svg"
                  alt=""
                  width={13.45}
                  height={13.45}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Рассрочка / Оплата частями */}
        {splitPayment && (
          <div className="flex items-center justify-between pt-3 border-t border-[#CDCDCD]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[15px] font-semibold leading-[1.06em] tracking-[0.01em] text-black uppercase" style={{ fontFamily: 'Inter' }}>
                  {splitPayment.count}
                </span>
                <span className="text-[14.444px] font-semibold leading-[1.06em] tracking-[0.01em] text-black uppercase" style={{ fontFamily: 'Inter' }}>
                  {splitPayment.amount}₽ в сплит
                </span>
              </div>
              <p className="text-[12px] font-normal leading-[1.21em] text-[#7E7E7E]" style={{ fontFamily: 'Inter' }}>
                {splitPayment.text || 'без переплаты'}
              </p>
            </div>
            <div className="w-[23.38px] h-[23.38px] rounded-full border border-[#B6B6B6] flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.88 4.06L11.25 4.06L11.25 10.94L1.88 10.94L1.88 4.06Z" stroke="black" strokeWidth="1.25"/>
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

