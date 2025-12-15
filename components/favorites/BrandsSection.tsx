'use client'
import React from 'react';
import BrandCard from './BrandCard';

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
      <h2 className="text-[20px] font-semibold leading-[1.06em] tracking-[-0.01em] uppercase text-black mb-[12px]">
        Бренды
      </h2>
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

