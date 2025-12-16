'use client';
import { useState } from "react";
// import { Product } from "@/components/types";
import Header from "../../../components/layout/Header";
import ProductSection from "@/components/ProductSection";

export default function PurchasedPage() { 
  const [purchasedProducts, setPurchasedProducts ] = useState<Product[]> ([
    {
      id: 1,
      name: 'Лонгслив Comme Des Garcons Play',
      image: '/products/t-shirt-1.png',
      price: '12 990 ₽',
    },
  ])

  const togglePurchasedProduct = (id: number) => {
    setPurchasedProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === id
          ? { ...product, isPurchased: !product.isPurchased }
          : product
      )
    )
  }

  return (
   <>
   <Header title="Купленные товары"/>
    <main className="p-4">
      <div className="!h-[70px]">
        <ProductSection 
          variant = "horizontal"
          onTogglePurchased={togglePurchasedProduct}
          products={purchasedProducts}
        />
      </div>
    </main>
   </>
  )
}