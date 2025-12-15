'use client'
import React, { useState } from 'react';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import FavoriteBrandsSection from '../../../components/brands/FavoriteBrandsSection';
import BrandsFilter from '../../../components/brands/BrandsFilter';
import BrandsSearch from '../../../components/brands/BrandsSearch';
import AllBrandsList from '../../../components/brands/AllBrandsList';
import Link from 'next/link';

interface Brand {
  id: number;
  name: string;
  image?: string;
  isFavorite?: boolean;
}

export default function BrandsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | undefined>();

  const [favoriteBrands, setFavoriteBrands] = useState<Brand[]>([
    {
      id: 1,
      name: 'Supreme',
      image: '/icons/favourites/brands/supreme.svg',
      isFavorite: true,
    },
    {
      id: 2,
      name: 'Adidas',
      image: '/icons/favourites/brands/adidas.svg',
      isFavorite: true,
    },
    {
      id: 3,
      name: 'Stone Island',
      image: '/icons/favourites/brands/stone-island.svg',
      isFavorite: true,
    },
    {
      id: 4,
      name: 'Nike',
      image: '/icons/favourites/brands/supreme.svg',
      isFavorite: true,
    },
    {
      id: 5,
      name: 'Puma',
      image: '/icons/favourites/brands/adidas.svg',
      isFavorite: true,
    },
  ]);

  const [allBrands, setAllBrands] = useState<Brand[]>([
    {
      id: 6,
      name: 'Supreme',
      image: '/icons/favourites/brands/supreme.svg',
      isFavorite: false,
    },
    {
      id: 7,
      name: 'Adidas',
      image: '/icons/favourites/brands/adidas.svg',
      isFavorite: false,
    },
    {
      id: 8,
      name: 'Stone Island',
      image: '/icons/favourites/brands/stone-island.svg',
      isFavorite: false,
    },
    {
      id: 9,
      name: 'Nike',
      image: '/icons/favourites/brands/supreme.svg',
      isFavorite: false,
    },
  ]);

  const filterLetters = ['А', 'Б'];

  const handleToggleFavorite = (id: number) => {
    const brand = allBrands.find(b => b.id === id);
    if (brand) {
      if (brand.isFavorite) {
        // Удаляем из избранных
        setAllBrands(allBrands.map(b => b.id === id ? { ...b, isFavorite: false } : b));
        setFavoriteBrands(favoriteBrands.filter(b => b.id !== id));
      } else {
        // Добавляем в избранные
        setAllBrands(allBrands.map(b => b.id === id ? { ...b, isFavorite: true } : b));
        setFavoriteBrands([...favoriteBrands, { ...brand, isFavorite: true }]);
      }
    }
  };

  // Фильтрация брендов по поиску
  const filteredBrands = allBrands.filter(brand => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header title="Бренды" />
      <main className="min-h-screen bg-[#F4F3F1] pb-20">
        {/* Секция избранных брендов */}
        {favoriteBrands.length > 0 && (
          <FavoriteBrandsSection brands={favoriteBrands} />
        )}

        {/* Секция всех брендов */}
        <div className="bg-white rounded-t-[25px] mt-2 px-4 pt-[19px] mb-[24px]">
          <Link href="/favorites/brands"> 
            <h2 className="text-[20px] font-bold leading-[1.06em] tracking-[-0.01em] text-black mb-[14px]">
              Все
            </h2>
          </Link>

          {/* Поисковая строка */}
          <div className="mb-[14px]">
            <BrandsSearch 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Найти бренд"
            />
          </div>

          {/* Фильтры и список брендов */}
          <div className="flex flex-col gap-[14px]">
            {/* Фильтры по буквам */}
            <BrandsFilter 
              letters={filterLetters}
              selectedLetter={selectedLetter}
              onSelectLetter={setSelectedLetter}
            />

            {/* Список брендов */}
            <AllBrandsList 
              brands={filteredBrands}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

