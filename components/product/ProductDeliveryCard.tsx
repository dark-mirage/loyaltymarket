import React from 'react';

interface ProductDeliveryCardProps {
  deliveryDate: string;
  deliveryPlace: string;
  pickupPrice: string;
}

export default function ProductDeliveryCard(props: ProductDeliveryCardProps) {
  const { deliveryDate, deliveryPlace, pickupPrice } = props;
  
  return (
    <div className="px-4 py-4" style={{ paddingLeft: '16px', paddingTop: '989px' }}>
      <div className="bg-[#F4F3F1] rounded-[16px] relative" style={{ width: '369px', height: '101px' }}>
        <div className="px-[14px] pt-[14px]">
          <h3 className="text-[15px] font-bold leading-[1.16em] text-black uppercase mb-0" style={{ fontFamily: 'Inter' }}>
            ДОСТАВКА
          </h3>
          
          <div className="flex items-center gap-[14px] mt-[20px]">
            <div className="w-[8px] h-[8px] bg-[#E5E5E5] rounded-full" />
            <div className="flex flex-col gap-0">
              <p className="text-[13px] font-semibold leading-[1.06em] text-black uppercase" style={{ fontFamily: 'Inter' }}>
                {deliveryDate}, {deliveryPlace}
              </p>
              <p className="text-[13px] font-normal leading-[1.06em] text-[#7E7E7E] lowercase mt-[6px]" style={{ fontFamily: 'Inter' }}>
                В пункт выдачи от {pickupPrice}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
