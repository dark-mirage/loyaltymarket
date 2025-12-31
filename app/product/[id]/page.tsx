'use client'
import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '../../../components/layout/Header'
import Footer from '../../../components/layout/Footer'
import ProductImageGallery from '../../../components/product/ProductImageGallery'
import ProductInfo from '../../../components/product/ProductInfo'
import ProductColors from '../../../components/product/ProductColors'
import ProductSizes from '../../../components/product/ProductSizes'
import ProductPrice from '../../../components/product/ProductPrice'
import ProductDelivery from '../../../components/product/ProductDelivery'
import ProductAddToCart from '../../../components/product/ProductAddToCart'

export default function ProductPage() {
  const params = useParams()
  const productId = params?.id as string

  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedColor, setSelectedColor] = useState<string>('#000000')
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const productImages = [
    '/products/shoes-1.png',
    '/products/shoes-1.png',
    '/products/shoes-1.png',
  ]

  const colors = [
    { name: 'Черный', value: '#000000', available: true },
    { name: 'Белый', value: '#FFFFFF', available: true },
    { name: 'Серый', value: '#808080', available: true },
    { name: 'Красный', value: '#FF0000', available: false },
  ]

  const sizes = ['XS', 'S', 'M', 'L', 'XL']
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL']

  const handleAddToCart = () => {
    console.log('Добавлено в корзину:', {
      productId,
      color: selectedColor,
      size: selectedSize,
      quantity
    })
  }

  const handleBuyNow = () => {
    console.log('Купить сейчас:', {
      productId,
      color: selectedColor,
      size: selectedSize,
      quantity
    })
  }

  return (
    <>
      <main className="min-h-screen pb-32 md:pb-20 bg-white">
        {/* Галерея изображений */}
        <ProductImageGallery
          images={productImages}
          productName="Кофта Supreme"
          isFavorite={isFavorite}
          onToggleFavorite={() => setIsFavorite(!isFavorite)}
          currentImageIndex={currentImageIndex}
          onImageChange={setCurrentImageIndex}
        />

        {/* Информация о товаре */}
        <ProductInfo
          productName="Кофта Supreme"
          brand="Supreme"
          brandLink="/brands/supreme"
          images={productImages}
          currentImageIndex={currentImageIndex}
          onImageChange={setCurrentImageIndex}
        />

        {/* Выбор размера */}
        <ProductSizes
          sizes={sizes}
          availableSizes={availableSizes}
          onSizeSelect={(size: string) => setSelectedSize(size)}
        />

        {/* Цена и оплата */}
        <ProductPrice
          price="127 899 ₽"
          deliveryInfo="Доставка из Китая до РФ 0₽"
          splitPayment={{
            count: 4,
            amount: '880',
            text: 'без переплаты'
          }}
        />

        {/* Доставка */}
        <ProductDelivery
          deliveryDate="30 марта"
          country="из Китая"
          pickupPrice="99₽"
        />

        {/* Кнопка добавления в корзину (фиксированная внизу на mobile) */}
        <ProductAddToCart
          quantity={quantity}
          onQuantityChange={setQuantity}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      </main>
      <Footer />
    </>
  )
}
