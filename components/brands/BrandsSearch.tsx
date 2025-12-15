'use client'
import React from 'react';
import { Search } from 'lucide-react';

interface BrandsSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function BrandsSearch({ value, onChange, placeholder = 'Найти бренд' }: BrandsSearchProps) {
  return (
    <div className="w-full h-[47px] bg-[#F4F3F1] rounded-2xl flex items-center px-4">
      <div className="flex items-center gap-2 flex-1">
        <Search size={17.49} className="text-[#7E7E7E]" strokeWidth={1.92} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[15px] font-medium leading-[1.21em] text-black placeholder:text-black placeholder:opacity-40 outline-none"
        />
      </div>
    </div>
  );
}

