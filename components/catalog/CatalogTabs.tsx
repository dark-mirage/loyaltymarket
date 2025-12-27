'use client'
import React from 'react'

interface CatalogTabsProps {
  activeTab: 'catalog' | 'brands'
  onTabChange: (tab: 'catalog' | 'brands') => void
}

const CatalogTabs: React.FC<CatalogTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="relative" style={{ height: '18px' }}>
      <div className="flex justify-center items-center gap-[134px]">
        <button
          onClick={() => onTabChange('catalog')}
          className="text-[15px] font-medium leading-[1.21em] text-black"
          style={{ fontFamily: 'Inter' }}
        >
          Каталог
        </button>
        <button
          onClick={() => onTabChange('brands')}
          className="text-[15px] font-medium leading-[1.21em] text-black"
          style={{ fontFamily: 'Inter' }}
        >
          Бренды
        </button>
      </div>
      {/* Разделительная линия */}
      <div className="absolute bottom-0 left-[-2px] right-[-2px] h-[0.5px] bg-[#CDCDCD]" style={{ top: '27px' }} />
      {/* Индикатор под активной вкладкой */}
      {activeTab === 'catalog' && (
        <div className="absolute bottom-0 left-[63px] w-[82px] h-[2px] bg-[#2D2D2D]" style={{ top: '26px' }} />
      )}
      {activeTab === 'brands' && (
        <div className="absolute bottom-0 left-[269px] w-[82px] h-[2px] bg-[#2D2D2D]" style={{ top: '26px' }} />
      )}
    </div>
  )
}

export default CatalogTabs

