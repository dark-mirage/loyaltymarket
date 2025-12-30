'use client'
import React from 'react'
import ProductInfoBlock from '../../../components/product/ProductInfoBlock'

export default function ProductPage() {
  return (
    <div className="w-full">
      <ProductInfoBlock
        images={[
          '/products/shoes-1.png',
          '/products/shoes-1.png',
          '/products/shoes-1.png',
        ]}
        productName="Кофта supreme"
        brand="Supreme"
        categories={['Одежда, обувь и аксессуары', 'Одежда', 'Зип худи', 'diesel']}
        colors={[
          { name: 'Черный', value: '#000000' },
          { name: 'Белый', value: '#FFFFFF' },
          { name: 'Серый', value: '#808080' },
        ]}
        sizes={['XS', 'S', 'M', 'L', 'XL']}
        availableSizes={['XS', 'S', 'M', 'L', 'XL']}
      />
    </div>
  )
}