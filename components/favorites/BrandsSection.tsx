'use client'
import React from 'react';
import BrandCard from './BrandCard';
import Link from 'next/link';

interface Brand {
  id: number;
  name: string;
  image?: string;
  isFavorite?: boolean;
}

interface BrandsSectionProps {
  brands: Brand[];
  onToggleFavorite?: (id: number) => void;
}

export default function BrandsSection({ brands, onToggleFavorite }: BrandsSectionProps) {
  return (
    <div className="bg-white rounded-t-[25px] px-4 py-[19px]">
      <div className="flex items-center  justify-between mb-[12px]">
      <h2 className="text-[20px] font-semibold leading-[1.06em] tracking-[-0.01em] text-black ">
        Бренды
      </h2>

      <Link href="/favorites/brands">
        <span className="flex items-center gap-1 text-[15px] font-medium leading-[1.06em] tracking-[-0.01em] text-black">
          все 
          <img className=" w-[10px] h-[12px]" src="/icons/global/arrow.svg" alt="arrow" />
        </span>
        </Link>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {brands.map((brand) => (
          <BrandCard
            key={brand.id}
            name={brand.name}
            image={brand.image}
            isFavorite={brand.isFavorite}
            onToggleFavorite={() => onToggleFavorite?.(brand.id)}
          />
        ))}
      </div>
    </div>
  );
}

