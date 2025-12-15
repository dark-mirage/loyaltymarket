'use client'
import React, { ReactNode } from 'react';
import MenuItem from './ProfileMenuItem';

interface MenuItemData {
  text: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  fontWeight?: 400 | 500 | 600;
  badge?: number;
}

interface MenuSectionProps {
  items: MenuItemData[];
  className?: string;
}

export default function MenuSection({ items, className = '' }: MenuSectionProps) {
  return (
    <div className={`flex flex-col gap-[1px] ${className}`}>
      {items.map((item, index) => (
        <MenuItem
          key={index}
          {...item}
          isFirst={index === 0}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
}

