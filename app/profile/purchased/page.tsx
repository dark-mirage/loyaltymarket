'use client'
import Header from "../../../components/layout/Header"
import Footer from "../../../components/layout/Footer"
import ProductSection from "../../../components/ProductSection"
import { useState } from "react"
import { Product } from "../../../components/types"

export default function PurchasedPage() { 
  const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([
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
      isFavorite: true,
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
      name: 'Кроссовки Nike Dunk Low',
      brand: 'Nike',
      price: '12 990 ₽',
      image: '/products/shoes-2.png',
      isFavorite: true,
      deliveryDate: 'Послезавтра',
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
      name: 'Лонгслив Comme Des Garçons Play',
      brand: 'Comme Des Garcons',
      price: '2 890 ₽',
      image: '/products/t-shirt-1.png',
      isFavorite: false,
      deliveryDate: 'Послезавтра',
    },
  ])

  const toggleFavorite = (id: number) => {
    setPurchasedProducts(prev => 
      prev.map(product => 
        product.id === id 
          ? { ...product, isFavorite: !product.isFavorite } 
          : product
      )
    )
  }

  return (
    <>
      <Header title="Купленные товары" />
      <main className="min-h-screen bg-[#F4F3F1] pb-20">
        <div className="bg-white rounded-t-[25px] mt-2">
          <ProductSection
            products={purchasedProducts}
            onToggleFavorite={toggleFavorite}
            layout="grid"
          />
        </div>
      </main>
      <Footer />
    </>
  )
}