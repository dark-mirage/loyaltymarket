'use client'
import SearchBar from '../components/SearchBar'
import CategoryTabs from '../components/CategoryTabs'
import FriendsSection from '../components/FriendsSection'
import ProductSection from '../components/ProductSection'
import Footer from '../components/layout/Footer'
import { Product } from '../components/types'
import { useState } from 'react'

export default function Home() {
  const [recentProducts, setRecentProducts] = useState<Product[]>([
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
      id: 8, 
      name: 'Футболка Daze', 
      brand: 'Daze',
      price: '8 990 ₽', 
      image: '/products/t-shirt-2.png', 
      isFavorite: false, 
      deliveryDate: 'Послезавтра',
    },
    { 
      id: 9, 
      name: 'Куртка зимняя', 
      brand: 'NoName',
      price: '15 990 ₽', 
      image: '/products/t-shirt-2.png', 
      isFavorite: true,
      deliveryDate: '30 марта',
    },
  ]);

  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([
    { 
      id: 4, 
      name: 'Лонгслив Comme Des Garçons Play', 
      brand: 'Comme Des Garçons',
      price: '2 890 ₽', 
      image: '/products/t-shirt-1.png', 
      isFavorite: false, 
      deliveryDate: 'Послезавтра',
    },
    { 
      id: 5, 
      name: 'Tucker Prado Monolith Brushed Original Bo...', 
      brand: 'Prada',
      price: '112 490 ₽', 
      image: '/products/shoes-1.png', 
      isFavorite: true, 
      deliveryDate: '30 марта',
    },
    { 
      id: 6, 
      name: 'Футболка Gall...', 
      brand: 'Gall',
      price: '2 890 ₽', 
      image: '/products/t-shirt-2.png', 
      isFavorite: false, 
      deliveryDate: '30 марта',
    },
    { 
      id: 7, 
      name: 'Кроссовки Nike Dunk Low', 
      brand: 'Nike',
      price: '12 990 ₽', 
      image: '/products/shoes-2.png', 
      isFavorite: true, 
      deliveryDate: 'Послезавтра',
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
      {/* <Header /> */}
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