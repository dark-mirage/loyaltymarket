import React from 'react';

interface ProductPriceCardProps {
  price: string;
  description: string;
  splitCount?: number;
  splitAmount?: string;
  splitText?: string;
}

export default function ProductPriceCard(props: ProductPriceCardProps) {
  const { price, description, splitCount = 4, splitAmount = '880', splitText = 'без переплаты' } = props;
  
  return (  
    <div className="px-4 py-4" style={{ paddingLeft: '16px', paddingTop: '850px' }}>
      <div className="bg-[#F4F3F1] rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" style={{ width: '369px', height: '131px' }}>
        {/* Цена */}
        <div className="px-[13px] pt-[14px]">
          <h2 className="text-[28.998px] font-semibold leading-[1.06em] tracking-[-0.04em] text-black uppercase mb-0" style={{ fontFamily: 'Inter' }}>
            {price}
          </h2>
          <p className="text-[12px] font-normal leading-[1.36em] text-[#7B7B7B] uppercase mt-[10px]" style={{ fontFamily: 'Inter' }}>
            {description}
          </p>
        </div>

        {/* Сплит */}
        <div className="relative mt-[22px]" style={{ height: '59px' }}>
          <div className="absolute" style={{ left: '13px', top: '8px' }}>
            <div className="flex items-center gap-0">
              <span className="text-[15px] font-semibold leading-[1.06em] tracking-[0.01em] text-black uppercase" style={{ fontFamily: 'Inter' }}>
                {splitCount}
              </span>
              <span className="text-[14.444px] font-semibold leading-[1.06em] tracking-[0.01em] text-black uppercase ml-[16px]" style={{ fontFamily: 'Inter' }}>
                {splitAmount}₽ в сплит
              </span>
            </div>
            <p className="text-[12px] font-normal leading-[1.21em] text-[#7E7E7E] mt-[1px]" style={{ fontFamily: 'Inter' }}>
              {splitText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

