'use client'
import React from 'react';
import Link from 'next/link'
import { X, ChevronDown, MoreHorizontal } from "lucide-react";

interface HeaderProps {
  title?: string;
  bgColor?: string; // Пропс для фонового цвета
  titleColor?: 'white' | 'black';
}

const Header: React.FC<HeaderProps> = ({ 
  title = 'Зовите друзья', 
  bgColor, // Необязательный пропс для фона
  titleColor = 'black'
}) => {
  return (
    <header 
      className={`flex items-center justify-between px-[16px] py-[4px] pt-[20px]  ${!bgColor ? '' : ''}`}
      style={bgColor ? { backgroundColor: bgColor } : undefined}
    >
      <Link
        href="/"
        aria-label="Закрыть страницу"
        className="flex items-center gap-0.5 bg-[#413F4066] text-white text-sm font-medium rounded-2xl py-1 px-3 pl-0.5"
      >
          <X size={24} color="white" />
          Закрыть
      </Link>

      <h1
        className={`pr-4 text-center text-[15px] font-medium ${
          titleColor === 'white' ? 'text-white' : 'text-black'
        }`}
        itemProp="headline"
      >
        {title}
      </h1>

      <div
        aria-hidden="true"
        className="flex gap-[21px] px-[13px] py-[4px] bg-[#413F4066] w-20 h-8 rounded-2xl"
      >
        <button>
          <ChevronDown size={20} color="white" />
        </button>
        <button>
           <MoreHorizontal size={20} color="white" />
        </button>
      </div>
    </header>
  );
};

export default Header;