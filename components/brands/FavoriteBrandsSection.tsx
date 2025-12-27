'use client'
import React from 'react';
import BrandCard from './BrandCard';

interface Brand {
  id: number;
  name: string;
  image?: string;
  isFavorite?: boolean;
}

interface FavoriteBrandsSectionProps {
  brands: Brand[];
  onBrandClick?: (id: number) => void;
}

export default function FavoriteBrandsSection({ brands, onBrandClick }: FavoriteBrandsSectionProps) {
  return (
    <div className="bg-white rounded-[25px] mt-8 px-4 pt-[19px] pb-[24px]">
      <h2 className="text-[20px] font-bold leading-[1.06em] tracking-[-0.01em] text-black mb-[14px]">
        Избранные
      </h2>
      <ul className="flex flex-col gap-[8px]">
        {brands.map((brand) => (
          <BrandCard
            key={brand.id}
            id={brand.id}
            name={brand.name}
            image={brand.image}
            isFavorite={brand.isFavorite}
            onClick={onBrandClick}
          />
        ))}
      </ul>
    </div>
  );
}

