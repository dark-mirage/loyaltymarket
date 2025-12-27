'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import Header from '../../../components/layout/Header'
import Footer from '../../../components/layout/Footer'
import ProductImageGallery from '../../../components/product/ProductImageGallery'
import ProductSizes from '../../../components/product/ProductSizes'
import ProductBrandDelivery from '../../../components/product/ProductBrandDelivery'
import ProductActions from '../../../components/product/ProductActions'
import ProductDescription from '../../../components/product/ProductDescription'
import ProductReviews from '../../../components/product/ProductReviews'
import ProductSection from '../../../components/ProductSection'
import { Product } from '../../../components/types'
import FriendsSection from '../../../components/FriendsSection'
import ProductDeliveryCard from '../../../components/product/ProductDeliveryCard'
import ProductPriceCard from '../../../components/product/ProductPriceCard'
import ProductProgramCard from '../../../components/product/ProductProgramCard'
import BrandCard from '../../../components/brands/BrandCard'

interface Brand {
  id: number;
  name: string;
  image?: string;
  isFavorite?: boolean;
}

export default function ProductPage() {
  const params = useParams()
  const productId = params?.id as string

  const [brand, setBrand] = useState<Brand>({
    id: 1,
    name: 'Supreme',
    image: '/icons/global/logo-icon.svg',
    isFavorite: false,
  })

  // В реальном приложении данные будут приходить с API по productId
  const [product, setProduct] = useState<Product>({
    id: parseInt(productId) || 1,
    name: 'Туфли Prada Monolith Brushed Original Black',
    price: '112 490 ₽',
    brand: 'Supreme',
    image: '/products/shoes-1.png',
    isFavorite: false,
    size: '42',
    country: 'Италия',
    pickupPoint: 'Москва, ул. Тверская, 10',
    deliveryDate: '30 марта',
  })

  // Галерея изображений товара
  const productImages = [
    '/products/shoes-1.png',
    '/products/shoes-1.png',
    '/products/shoes-1.png',
  ]

  // Похожие товары (используем ProductSection)
  const [similarProducts, setSimilarProducts] = useState<Product[]>([
    {
      id: 2,
      name: 'Лонгслив Comme Des Garcons Play',
      price: '12 990 ₽',
      image: '/products/t-shirt-1.png',
      brand: 'Comme Des Garcons',
      isFavorite: false,
      deliveryDate: 'Послезавтра',
    },
    {
      id: 3,
      name: 'Футболка Daze',
      price: '2 890 ₽',
      image: '/products/t-shirt-2.png',
      brand: 'Daze',
      isFavorite: false,
      deliveryDate: '30 марта',
    },
    {
      id: 4,
      name: 'Кроссовки Nike Dunk Low',
      price: '12 990 ₽',
      image: '/products/shoes-2.png',
      brand: 'Nike',
      isFavorite: true,
      deliveryDate: 'Послезавтра',
    },
    {
      id: 5,
      name: 'Куртка зимняя',
      price: '15 990 ₽',
      image: '/products/t-shirt-2.png',
      brand: 'NoName',
      isFavorite: false,
      deliveryDate: '30 марта',
    },
  ])

  const handleToggleFavorite = () => {
    setProduct(prev => ({ ...prev, isFavorite: !prev.isFavorite }))
  }

  const handleToggleSimilarFavorite = (id: number) => {
    setSimilarProducts(prev =>
      prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)
    )
  }

  const handleAddToCart = () => {
    // Логика добавления в корзину
    console.log('Добавлено в корзину:', product)
  }

  const handleBuy = () => {
    // Логика покупки
    console.log('Купить:', product)
  }

  return (
    <>
      <Header/>
      <main className="min-h-screen pb-20">
        {/* Галерея изображений */}
        <ProductImageGallery 
          images={productImages} 
          productName={product.name}
          productBrand={product.brand}
        />

        {/* Размеры */}
        <ProductSizes
          sizes={['XS', 'S', 'M', 'L', 'XL']}
          availableSizes={['XS', 'S', 'M', 'L', 'XL']}
          onSizeSelect={(size) => {
            setProduct(prev => ({ ...prev, size }))
          }}
        />

        {/* Блок доставки бренда */}
        <ProductBrandDelivery
          brand="Prada"
          country={product.country}
          pickupPoint={product.pickupPoint}
          deliveryDate={product.deliveryDate}
        />

        {/* Кнопки действий */}
        <ProductActions
          isFavorite={product.isFavorite}
          onToggleFavorite={handleToggleFavorite}
          onAddToCart={handleAddToCart}
          onBuy={handleBuy}
        />
от
        <ProductPriceCard
          price="127 899 ₽"
          description="Доставка из Китая до РФ 0₽"
          paymentMethod="4 × 880 ₽"
          paymentAmount="112 490 ₽"
        />

        <ProductDeliveryCard
          deliveryDate="30 марта"
          deliveryPlace="Москва, ул. Тверская, 10"
          pickupPrice="112 490 ₽"
        />

        <BrandCard
          id={brand.id}
          name={brand.name}
          image={brand.image}
          isFavorite={brand.isFavorite}
        />

        <FriendsSection />

        {/* Описание товара */}

        {/* Отзывы */}
        <ProductReviews />

        <ProductDescription
          description="Премиальные туфли от итальянского бренда Prada. Классический дизайн в черном цвете с оригинальной отделкой. Идеально подходят для деловых встреч и особых случаев. Выполнены из высококачественной кожи с вниманием к деталям."
          features={[
            'Материал: натуральная кожа',
            'Подошва: кожаная',
            'Страна производства: Италия',
            'Сезон: всесезонные',
          ]}
        />
        {/* Похожие товары - используем существующий компонент ProductSection */}
        <div className="mt-4">
          <ProductSection
            title="Похожие товары"
            products={similarProducts}
            onToggleFavorite={handleToggleSimilarFavorite}
            layout="grid"
          />
        </div>
      </main>
      <Footer />
    </>
  )
}

