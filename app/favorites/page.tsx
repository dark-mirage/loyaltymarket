'use client'
import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import BrandsSection from '../../components/favorites/BrandsSection';
import EmptyState from '../../components/favorites/EmptyState';
import ProductSection from '../../components/ProductSection';
import { Product } from '../../components/types';

interface Brand {
  id: number;
  name: string;
  image?: string;
  isFavorite?: boolean;
}

export default function FavoritesPage() {
  const [brands, setBrands] = useState<Brand[]>([
    {
      id: 1,
      name: 'Supreme',
      image: 'icons/favourites/brands/supreme.svg',
      isFavorite: true,
    },
    {
      id: 2,
      name: 'Adidas',
      image: 'icons/favourites/brands/adidas.svg',
      isFavorite: true,
    },
    {
      id: 3,
      name: 'Stonik',
      image: 'icons/favourites/brands/stone-island.svg',
      isFavorite: true,
    },
  ]);

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Лонгслив Comme des Garcons Play',
      price: '2 890 ₽',
      image: '/products/t-shirt-1.png',
      isFavorite: true,
      deliveryDate: '30 марта',
    },
    {
      id: 2,
      name: 'Туфли Prada Monolith Brushed Original Bla...',
      price: '112 490 ₽',
      image: '/products/shoes-1.png',
      isFavorite: true,
      deliveryDate: 'Послезавтра',
    },
    {
      id: 3,
      name: 'Футболка Daze',
      price: '2 890 ₽',
      image: '/products/t-shirt-2.png',
      isFavorite: true,
      deliveryDate: 'Послезавтра',
    },
    {
      id: 4,
      name: 'Кроссовки Nike Dunk Low',
      price: '12 990 ₽',
      image: '/products/shoes-2.png',
      isFavorite: true,
      deliveryDate: '30 марта',
    },
  ]);

  const handleToggleBrandFavorite = (id: number) => {
    setBrands(brands.map(brand => 
      brand.id === id ? { ...brand, isFavorite: !brand.isFavorite } : brand
    ));
  };

  const handleToggleProductFavorite = (id: number) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, isFavorite: !product.isFavorite } : product
    ).filter(product => product.isFavorite));
  };

  const hasFavorites = products.length > 0 || brands.some(b => b.isFavorite);

  return (
    <>
      <Header title="Избранное" />
      <main className="min-h-screen bg-[#F4F3F1] pb-20">
        {/* Секция брендов */}
        {brands.some(b => b.isFavorite) && (
          <BrandsSection 
            brands={brands.filter(b => b.isFavorite)}
            onToggleFavorite={handleToggleBrandFavorite}
          />
        )}

        {/* Пустое состояние или товары */}
        {!hasFavorites ? (
          <EmptyState />
        ) : (
          <>
            {/* Секция товаров */}
            {products.length > 0 && (
              <div className="bg-white rounded-t-[25px] mt-2">
                <ProductSection
                  title="Для вас"
                  products={products}
                  onToggleFavorite={handleToggleProductFavorite}
                  layout="grid"
                  showDeliveryButton={true}
                />
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

