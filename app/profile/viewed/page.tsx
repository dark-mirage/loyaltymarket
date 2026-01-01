'use client'
import Header from "../../../components/layout/Header"
import ProductSection from "../../../components/ProductSection"
import { useState } from "react"
import { Product } from "../../../components/types"

export default function ViewedPage() { 
  const [viewedProducts, setViewedProducts] = useState<Product[]>([
    
    {
      id: 1,
      name: 'Туфли Prada Monolith Brushed Original Bla...',
      brand: 'Prada',
      price: '112 490 ₽',
      image: '/products/shoes-1.png',
      isFavorite: false,
      deliveryDate: '30 марта',
    },
    {
      id: 2,
      name: 'Лонгслив Comme Des Garcons Play',
      brand: 'Comme Des Garcons',
      price: '12 990 ₽',
      image: '/products/t-shirt-1.png',
      isFavorite: false,
      deliveryDate: 'Послезавтра',
    },
    {
      id: 3,
      name: 'Футболка Daze',
      brand: 'Daze',
      price: '2 890 ₽',
      image: '/products/t-shirt-2.png',
      isFavorite: false,
      deliveryDate: '30 марта',
    },
    {
      id: 4,
      name: 'Футболка Daze',
      brand: 'Daze',
      price: '8 990 ₽',
      image: '/products/t-shirt-2.png',
      isFavorite: false,
      deliveryDate: '30 марта',
    },
    {
      id: 5,
      name: 'Куртка зимняя',
      brand: 'NoName',
      price: '15 990 ₽',
      image: '/products/t-shirt-2.png',
      isFavorite: false,
      deliveryDate: '30 марта',
    },
    {
      id: 6,
      name: 'Куртка зимняя',
      brand: 'NoName',
      price: '15 990 ₽',
      image: '/products/t-shirt-2.png',
      isFavorite: false,
      deliveryDate: 'Послезавтра',
    },
  ])

  const toggleViewedProduct = (id: number) => {
    setViewedProducts(prev => prev.map(product => product.id === id ? { ...product, isFavorite: !product.isFavorite } : product))
  }

  const date = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'long' })

  return (
    <div>
      <Header title="Просмотренное"></Header>
      <main className="min-h-screen bg-[#F4F3F1]">
        <div className="px-4 py-4 pt-[7px] pl-[16px] pb-[12px] !pl-0 pr-[0] bg-white">
          <div className="mb-[15px] pr-[15px] bg-[#F4F3F1] rounded-xl p-1 pl-[16px]">
            <span className="text-[15px] font-medium leading-[1.21em] text-black">
              {date}
            </span>
          </div>
          <ProductSection
          
          onToggleFavorite={toggleViewedProduct}
          products={viewedProducts} 
          />
        </div>
      </main>
    </div>
  )
 }