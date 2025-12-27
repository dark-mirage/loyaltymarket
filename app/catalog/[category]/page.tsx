'use client'
import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Footer from '../../../components/layout/Footer'
import SearchBar from '@/components/SearchBar'
import CatalogTabs from '../../../components/catalog/CatalogTabs'
import BrandsList from '../../../components/catalog/BrandsList'
import Header from '../../../components/layout/Header'

const categoryData: Record<string, { title: string; subcategories: string[] }> = {
  clothes: {
    title: 'Одежда',
    subcategories: [
      'футболки',
      'худи',
      'зип-худи',
      'джинсы',
      'штаны',
      'Шорты',
      'Майки',
      'лонгсливы',
      'свитшоты',
      'свитеры',
      'рубашки',
      'ветровки',
      'бомберы',
      'куртки',
      'Пуховики',
      'Жилеты',
      'Носки',
      'Нижнее бельё',
    ],
  },
  shoes: {
    title: 'Обувь',
    subcategories: [
      'кроссовки',
      'кеды',
      'ботинки',
      'туфли',
      'сандалии',
      'сапоги',
    ],
  },
  accessories: {
    title: 'Аксессуары',
    subcategories: [
      'сумки',
      'рюкзаки',
      'часы',
      'очки',
      'ремни',
      'кошельки',
    ],
  },
}

export default function CategoryPage() {
  const params = useParams()
  const categoryId = params?.category as string
  const category = categoryData[categoryId]
  const [activeTab, setActiveTab] = useState<'catalog' | 'brands'>('catalog')

  if (!category) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen flex items-center justify-center">
        <p>Категория не найдена</p>
      </div>
    )
  }

  return (
    <>
    <Header title="Поиск" />
    <SearchBar/>
    <div className="max-w-md mx-auto bg-white min-h-screen">
      
      <main className="pb-20">
        {activeTab === 'catalog' ? (
          <>
            {/* Заголовок категории и кнопка "все" */}
            <div className="px-4 pt-[15px]">
              <div className="flex items-center justify-between" style={{ width: '371px', gap: '251px' }}>
                <h1 className="text-[20px] font-bold leading-[1.06em] tracking-[-0.01em] text-black uppercase" style={{ fontFamily: 'Inter' }}>
                  {category.title}
                </h1>
                <button className="flex items-center gap-0">
                  <span className="text-[12px] font-normal leading-[1.16em] text-[#7E7E7E] lowercase" style={{ fontFamily: 'Inter' }}>
                    все
                  </span>
                  <div className="w-[16px] h-[14.55px] ml-0 flex items-center justify-center">
                    <Image
                      src="/icons/global/Wrap.svg"
                      alt=""
                      width={16}
                      height={14.55}
                      className="w-full h-full"
                    />
                  </div>
                </button>
              </div>
            </div>

            {/* Список подкатегорий */}
            <div className="px-4">
              <div className="flex flex-col pt-[20px]" style={{ width: '369px' }}>
                {/* Разделитель сверху */}
                <div className="w-full h-[0.5px] bg-[#CDCDCD] mb-4" />

                {/* Подкатегории */}
                <div className="flex flex-col gap-4">
                  {category.subcategories.map((subcategory, index) => (
                    <React.Fragment key={subcategory}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[15px] font-normal leading-[1.06em] text-black" style={{ fontFamily: 'Inter', textTransform: 'capitalize' }}>
                            {subcategory}
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
                      {index < category.subcategories.length - 1 && (
                        <div className="w-full h-[0.5px] bg-[#CDCDCD]" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <BrandsList />
        )}
      </main>
      <Footer />
    </div>
    </>
  )
}

