'use client'
import React from 'react'
import ProductCard from './ProductCard'
import { Product } from './types'

interface ProductSectionProps {
  title: string
  products: Product[]
  onToggleFavorite: (id: number) => void
  layout?: 'horizontal' | 'grid' // Меняем на horizontal для ручного скролла
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  products,
  onToggleFavorite,
  layout = 'grid'
}) => {
  if (layout === 'horizontal') {
    return (
      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button className="text-[12px] text-[#7E7E7E] flex items-center justify-center gap-1 font-medium">
            <span>все</span>
            <img className="w-[14px] h-[16px]" src="/icons/global/arrow.svg" alt="arrow" />
          </button>
        </div>
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {products.map((product) => (
              <ProductCard 
                key={product.id}
                product={product}
                onToggleFavorite={onToggleFavorite}
                variant="compact" // ← Добавить variant
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 gap-y-[21px]">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onToggleFavorite={onToggleFavorite}
            variant="normal" // ← Добавить variant
          />
        ))}
      </div>
    </section>
  )
}

export default ProductSection