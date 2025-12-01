'use client'
import React from 'react';
import { Product, ProductCardVariant } from './types';

interface Props {
  product: Product;
  onToggleFavorite: (id: number) => void;
  variant?: ProductCardVariant;
}

const ProductCard: React.FC<Props> = ({ product, onToggleFavorite, variant = 'normal' }) => {
  const widthClass = variant === 'compact' ? 'w-[143px]' : 'w-[180px]';
  
  return (
    <div className={`${widthClass} flex-shrink-0`}>
      <div className="relative bg-gray-100 rounded-xl overflow-hidden mb-2" style={{ aspectRatio: '3/4' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          {typeof product.image === 'string' && /\.(png|jpe?g|svg|webp|avif)$/i.test(product.image) ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover bg-[var(--items-background)]" />
          ) : (
            <div className="text-4xl">{product.image}</div>
          )}
        </div>
        <button
          onClick={() => onToggleFavorite(product.id)}
          className="absolute top-2 right-2 w-[19px] h-[18px] rounded-full flex items-center justify-center"
          aria-pressed={product.isFavorite}
        >
          <img
            src={product.isFavorite ? '/icons/global/active-heart.svg' : '/icons/global/not-active-heart.svg'}
            alt={product.isFavorite ? 'liked' : 'not liked'}
            className="w-4 h-4 bg-[rgba(244,243,241,1)]"
          />
        </button>
      </div>
      
      <div className="text-sm font-semibold mb-[5px] font-inter font-semibold text-[16px] leading-[100%] tracking-[-0.04em]">
        {product.price}
      </div>
      
      <div className="text-[12px] line-clamp-2 text-black font-inter font-normal text-[12px] leading-[120%] tracking-[0] mb-[6px]">
        {product.name}
      </div>
      
      {product.size && (
        <div className="flex gap-[4px] text-xs text-black font-inter font-semibold text-[11px] leading-[106%] tracking-[0]">
          <img src="/icons/global/gray-dot.svg" alt="dot" />
          {product.size},
          {(product.country || product.pickupPoint) && (
            <span className="text-gray-400 font-normal">
               {product.country || product.pickupPoint}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCard;