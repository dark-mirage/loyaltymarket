'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Footer from '../../components/layout/Footer'
import SearchBar from '@/components/SearchBar'
import CatalogTabs from '../../components/catalog/CatalogTabs'
import BrandsList from '../../components/catalog/BrandsList'
import { useState } from 'react'
import Header from '../../components/layout/Header'

export default function CatalogPage() {
  const categories = [
    {
      id: 'clothes',
      title: 'одежда',
      imageSrc: '/icons/catalog/catalog-icon-1.svg',
      altText: 'Одежда',
    },
    {
      id: 'shoes',
      title: 'обувь',
      imageSrc: '/icons/catalog/catalog-icon-2.svg',
      altText: 'Обувь',
    },
    {
      id: 'accessories',
      title: 'аксессуары',
      imageSrc: '/icons/catalog/catalog-icon-3.svg',
      altText: 'Аксессуары',
    },
  ]

  const [activeTab, setActiveTab] = useState<'catalog' | 'brands'>('catalog')

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <Header title="Поиск" />

      <div className='mb-[22px] pt-[33px]'>
        <CatalogTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      <div className='mb-[14px]'>
        <SearchBar/>
      </div>
      <main className="pb-20">
        {activeTab === 'catalog' ? (
          <div className="px-4 pt-[15px] flex flex-col gap-[15px]">
            {categories.map((category) => (
              <Link key={category.id} href={`/catalog/${category.id}`}>
                <div className="relative w-full h-[172px] rounded-[16px] overflow-hidden bg-[#F4F3F1] cursor-pointer hover:opacity-90 transition-opacity">
                  <h3 className="absolute top-[15px] left-[15px] text-[30px] font-bold leading-[1em] uppercase font-bebas text-black z-10">
                    {category.title}
                  </h3>
                  <div className="absolute right-0 bottom-0 h-full w-auto">
                    <Image
                      src={category.imageSrc}
                      alt={category.altText}
                      width={239}
                      height={239}
                      className="object-cover h-full w-auto"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <BrandsList />
        )}
      </main>
      <Footer />
    </div>
  )
}

