'use client'
import React from 'react'
import Image from 'next/image'

interface Brand {
  name: string
}

interface BrandsByLetter {
  letter: string
  brands: Brand[]
}

const brandsData: BrandsByLetter[] = [
  {
    letter: 'А',
    brands: [
      { name: 'Adidas' },
      { name: 'Armani' },
      { name: 'ASICS' },
    ],
  },
  {
    letter: 'b',
    brands: [
      { name: 'Balenciaga' },
      { name: 'Burberry' },
      { name: 'Balmain' },
    ],
  },
  {
    letter: 'с',
    brands: [
      { name: 'Calvin Klein' },
      { name: 'Celine' },
    ],
  },
]

export default function BrandsList() {
  return (
    <div className="px-4 pb-20">
      <div className="flex flex-col gap-[14px]">
        {brandsData.map((group, groupIndex) => (
          <div key={group.letter} className="flex flex-col items-center gap-[14px]" style={{ width: '382px' }}>
            {/* Буква */}
            <div className="w-full bg-[#F4F3F1] rounded-[6px] flex items-center gap-[10px] px-[7px] py-[5px]">
              <span className="text-[12px] font-medium leading-[1.06em] text-[#7E7E7E] uppercase" style={{ fontFamily: 'Inter' }}>
                {group.letter}
              </span>
            </div>

            {/* Список брендов */}
            <div className="flex flex-col gap-4" style={{ width: '370px' }}>
              {group.brands.map((brand, brandIndex) => (
                <React.Fragment key={brand.name}>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center justify-between w-full" style={{ gap: '250px' }}>
                        <span className="text-[15px] font-normal leading-[1.06em] text-black" style={{ fontFamily: 'Inter', textTransform: 'capitalize' }}>
                          {brand.name}
                        </span>
                        <div className="w-[28px] h-[28px] flex items-center justify-center">
                          <Image
                            src="/icons/global/Wrap.svg"
                            alt=""
                            width={6.29}
                            height={11}
                            className="w-[6.29px] h-[11px]"
                          />
                        </div>
                      </div>
                    </div>
                    {/* Разделитель */}
                    {brandIndex < group.brands.length - 1 && (
                      <div className="w-full h-[0.5px] bg-[#CDCDCD]" />
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

