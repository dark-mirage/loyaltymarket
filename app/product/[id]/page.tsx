'use client'
import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Footer from '../../../components/layout/Footer'
import ProductImageGallery from '../../../components/product/ProductImageGallery'
import ProductInfo from '../../../components/product/ProductInfo'
import ProductSizes from '../../../components/product/ProductSizes'
import ProductPrice from '../../../components/product/ProductPrice'
import ProductDelivery from '../../../components/product/ProductDelivery'
import ProductAddToCart from '../../../components/product/ProductAddToCart'
import ProductReviews from '../../../components/product/ProductReviews'

export default function ProductPage() {
  const params = useParams()
  const productId = params?.id as string

  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const productImages = [
    '/products/shoes-1.png',
    '/products/shoes-1.png',
    '/products/shoes-1.png',
  ]

  const sizes = ['XS', 'S', 'M', 'L', 'XL']
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL']

  // Данные для отзывов
  const reviews = [
    {
      id: 1,
      userName: 'Анастасия',
      avatar: 'https://i.pravatar.cc/150?img=1',
      date: '21 апреля',
      rating: 5,
      productName: 'Кофта Sup...',
      pros: 'стильно, классика которую можно носить под разный стиль одежды...',
      cons: 'клей на подошве. ПОшив..',
    },
    {
      id: 2,
      userName: 'fasffafdfa',
      avatar: 'https://i.pravatar.cc/150?img=2',
      date: '21 апреля',
      rating: 4,
      pros: 'стильно, классика которую можно носить под разный стиль одежды...',
      cons: 'их не',
    },
  ]

  // Распределение рейтингов (для расчета среднего)
  const ratingDistribution = {
    5: 60,
    4: 20,
    3: 12,
    2: 6,
    1: 2,
  }

  const handleAddToCart = () => {
    console.log('Добавлено в корзину:', {
      productId,
      size: selectedSize,
      quantity
    })
  }

  const handleBuyNow = () => {
    console.log('Купить сейчас:', {
      productId,
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

        {/* Отзывы */}
        <ProductReviews
          brandName="Supreme"
          reviews={reviews}
          ratingDistribution={ratingDistribution}
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
