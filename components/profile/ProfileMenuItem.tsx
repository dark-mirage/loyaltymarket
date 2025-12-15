'use client'
import React, { ReactNode } from 'react';
import Link from 'next/link';

interface MenuItemProps {
  text: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  fontWeight?: 400 | 500 | 600;
  badge?: number;
  isFirst?: boolean;
  isLast?: boolean;
}

export default function MenuItem({
  text,
  icon,
  href,
  onClick,
  fontWeight = 500,
  badge,
  isFirst = false,
  isLast = false,
}: MenuItemProps) {
 
  const fontWeightClass = {
    400: 'font-normal',
    500: 'font-medium',
    600: 'font-semibold',
  }[fontWeight];

  const borderRadiusClass = isFirst && isLast
    ? 'rounded-2xl'
    : isFirst
    ? 'rounded-t-2xl'
    : isLast
    ? 'rounded-b-2xl'
    : '';

  const content = (
    <div className={`relative flex items-center gap-[13px] w-full h-[55px] px-[15px] bg-[#F4F3F1] ${borderRadiusClass}`}>
      {/* Иконка */}
      {icon && (
        <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
          {icon}
        </div>
      )}

      {/* Текст */}
      <span className={`text-[15px] ${fontWeightClass} leading-[1.06em] text-black flex-1`}>
        {text}
      </span>

      {/* Стрелка */}
      <img 
        src="/icons/global/Wrap.svg" 
        alt="arrow"
        className="absolute right-[15px] top-[22px] w-[6px] h-[10.5px]"
      />

      {/* Бейдж */}
      {badge !== undefined && (
        <div className="absolute right-[40px] top-[20px] w-4 h-4 bg-[#FF601D] border border-white rounded-[8px] flex items-center justify-center">
          <span className="text-[10.29px] font-semibold leading-[1.21em] text-white">
            {badge}
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="block w-full">
        {content}
      </button>
    );
  }

  return content;
}

