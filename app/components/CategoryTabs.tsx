'use client'
import React, { useState } from 'react';

const tabs = ['Для вас', 'Новинки', 'Одежда', 'Обувь', 'Аксессуары'];

const CategoryTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Для вас');

  return (
    <div className="px-4 py-2 bg-white overflow-x-auto overflow-hidden">
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-[6px] px-[10px] rounded-full text-[12px] whitespace-nowrap inline-flex items-center justify-center select-none relative whitespace-nowrap align-middle outline-transparent outline-2 outline-offset-2 leading-[1.2] transition-all min-w-[40px] shrink-0 px-[12px] h-[29px] font-medium rounded-[47.5px]  text-black ${
              activeTab === tab
                ? 'bg-black text-white'
                : 'text-black'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
