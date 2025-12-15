'use client'
import React from 'react';
import Link from 'next/link';

interface ProfileHeaderProps {
  name: string;
  avatar?: string;
}

export default function ProfileHeader({ name, avatar }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center pt-[17px] pb-[26px]">
      {/* Аватар */}
      <div className="relative w-[93px] h-[93px] mb-[14px]">
        <div className="absolute inset-0 rounded-full bg-[#F4F3F1] overflow-hidden">
          {avatar ? (
            <img 
              src={avatar} 
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#F4F3F1]" />
          )}
        </div>
      </div>

      {/* Имя и кнопка настроек */}
      <div className="relative flex flex-col w-full max-w-[369px] flex items-center justify-between px-4">
        <h2 className="text-[20px] font-semibold leading-[1.06em] tracking-[-0.01em] text-black">
          {name}
        </h2>
        <Link 
          href="/settings"
          className="flex items-center gap-[5px] text-[12px] font-normal leading-[1.21em]  text-[#7E7E7E]"
        >
          <span>Настройки</span>
          <img 
            src="/icons/global/Wrap.svg" 
            alt="arrow"
            className="w-[10px] h-[9px]"
          />
        </Link>
      </div>
    </div>
  );
}

