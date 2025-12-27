'use client'
import React from 'react';
import Link from 'next/link'
import { X, ChevronDown, MoreHorizontal } from "lucide-react";

interface HeaderProps {
  title?: string;
  bgColor?: string; // Пропс для фонового цвета
  titleColor?: 'white' | 'black';
}

export default function Header({ title, bgColor, titleColor }: HeaderProps) {
  return (
    <>
    <div className="flex px-4 pt-[25px] justify-center items-center">
      <h1 className="text-[15px] font-medium leading-[1.06em] tracking-[-0.01em] text-black uppercase" style={{ fontFamily: 'Inter' }}>
        {title}
      </h1>
    </div>
    </>
  );
};
