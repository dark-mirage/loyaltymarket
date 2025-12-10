'use client'
import Header from './components/layout/Header'
import SearchBar from './components/SearchBar'
import CategoryTabs from './components/CategoryTabs'
import FriendsSection from './components/FriendsSection'
import ProductSection from './components/ProductSection'
import Footer from './components/layout/Footer'
import { useState } from 'react'
import { Product } from './components/types'

export default function Home() {
  const [recentProducts, setRecentProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Туфли Prada Monolith Brushed Original Bla...',
      price: '112 490 ₽',
      image: '/products/shoes-1.png',
      isFavorite: false,
      size: 'с 30 мар',
      country: "из Китая"
    },
    {
      id: 2, 
      name: 'Лонгслив Comme Des Garcons Play', 
      price: '12 990 ₽', 
      image: '/products/t-shirt-1.png', 
      isFavorite: true,
      size: 'от 2 дней',
      country: "из наличия"
    },
    {
      id: 3, 
      name: 'Футболка Daze', 
      price: '2 890 ₽', 
      image: '/products/t-shirt-2.png', 
      isFavorite: false, 
      size: 'C 30 мар',
      pickupPoint: "из наличия"
    },
    { 
      id: 8, 
      name: 'Футболка Daze', 
      price: '8 990 ₽', 
      image: '/products/t-shirt-2.png', 
      isFavorite: false, 
      size: 'С 30 мар',
      pickupPoint: "из наличия"
    },
    { 
      id: 9, 
      name: 'Куртка зимняя', 
      price: '15 990 ₽', 
      image: '/products/t-shirt-2.png', 
      isFavorite: true,
      size: 'С 30 мар',
      pickupPoint: "из наличия"
    },
  ]);

  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([
    { 
      id: 4, 
      name: 'Лонгслив Comme Des Garçons Play', 
      price: '2 890 ₽', 
      image: '/products/t-shirt-1.png', 
      isFavorite: false, 
      size: 'От 2 дней',
      pickupPoint: "из наличия"
    },
    { 
      id: 5, 
      name: 'Tucker Prado Monolith Brushed Original Bo...', 
      price: '112 490 ₽', 
      image: '/products/shoes-1.png', 
      isFavorite: true, 
      size: 'С 30 мар',
      country: 'из Китая'
    },
    { 
      id: 6, 
      name: 'Футболка Gall...', 
      price: '2 890 ₽', 
      image: '/products/t-shirt-2.png', 
      isFavorite: false, 
      size: 'С 30 мар',
      country: 'из Китая'
    },
    { 
      id: 7, 
      name: 'Кроссовки Nike Dunk Low', 
      price: '12 990 ₽', 
      image: '/products/shoes-2.png', 
      isFavorite: true, 
      size: 'От 2 дней',
      pickupPoint: "из наличия"
    },
  ]);

  const toggleFavorite = (id: number) => {
    setRecentProducts(prev =>
      prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)
    );
    setRecommendedProducts(prev =>
      prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)
    );
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-20">
      <Header />
      <SearchBar />
      <CategoryTabs />
      <FriendsSection />
      
      <ProductSection
        // variant="compact"
        title="Только что купили"
        products={recentProducts}
        onToggleFavorite={toggleFavorite}
        layout="horizontal"
      />
      
      <ProductSection
      //  variant="normal"
        title="Для вас"
        products={recommendedProducts}
        onToggleFavorite={toggleFavorite}
        layout="grid"
      />
      
      <Footer />
    </div>
  );
}