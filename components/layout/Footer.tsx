'use client'
import React, { useState } from 'react';
import Link from 'next/link';

const BottomNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  // Базовый путь к иконкам — поправьте здесь, если иконки лежат не в public/icons/footer
  const ICONS_PATH = '/icons/footer';
  const HomeIcon = '/icons/footer/Home.svg';
  const PoizonIcon = '/icons/footer/Poizon.svg';
  const SearchIcon = '/icons/footer/Search.svg';
  const HeartIcon = '/icons/footer/Heart.svg';
  const TrashIcon = '/icons/footer/Trach.svg';
  const UserIcon = '/icons/footer/User.svg';

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="flex py-2 pb-[40px] justify-center">
       
      <Link href="/">
        <button
          onClick={() => setActiveTab('home')}
          className="flex flex-col items-center py-1 mr-[40px]"
        >
          <img 
            src={HomeIcon}
            alt="home" 
            className={`w-6 h-6 ${
              activeTab === 'home' 
                ? 'filter brightness-0' 
                : 'opacity-60'
            }`}
          />
        </button>
        </Link>

        <Link href="/poizon">
        <button
          onClick={() => setActiveTab('poizon')}
          className="flex flex-col items-center py-1  mr-[45px]"
        >
          <img 
            src={`${ICONS_PATH}/Poizon.svg`} 
            alt="Poizon" 
            className={`w-4 h-6 ${
              activeTab === 'poizon' 
                ? 'filter brightness-0'
                : 'opacity-60'
            }`}
          />
        </button>
        </Link>

        <Link href="/сatalog"> 
        <button
          onClick={() => setActiveTab('catalog')}
          className="flex flex-col items-center py-1 pt-[6px] mr-[44px]"
        >
          <img
            src={`${ICONS_PATH}/Search.svg`} 
            style={{ width: '32px', height: '18px'}}
            alt="catalog" 
            className={`w-6 h-6 ${
              activeTab === 'catalog' 
                ? 'filter brightness-0'
                : 'opacity-60'
            }`}
          />
        </button>
        </Link>

        <Link href="/favorites">  
          <button
            onClick={() => setActiveTab('heart')}
            className="flex flex-col items-center py-1 pt-[5px]  mr-[48px]"
          >
            <img 
              src={`${ICONS_PATH}/Heart.svg`} 
              style={{  height: '20px'}}
              alt="heart" 
              className={`w-5 h-6 ${
                activeTab === 'heart' 
                  ? 'filter brightness-0'
                  : 'opacity-60'
              }`}
            />
          </button>
        </Link>
        
        <Link href="/trash">
          <button
            onClick={() => setActiveTab('trash')}
            className="flex flex-col items-center py-1  mr-[47px]"
          >
            <img 
              src={`${ICONS_PATH}/Trach.svg`} 
              alt="trach" 
              className={`w-5 h-6 ${
                activeTab === 'trash' 
                  ? 'filter brightness-0'
                  : 'opacity-60'
              }`}
            />
          </button>
         </Link>
        
        <Link href="/profile">
          <button
            onClick={() => setActiveTab('user')}
            className="flex flex-col items-center py-1"
          >
            <img 
              src={`${ICONS_PATH}/User.svg`} 
              alt="user" 
              className={`w-5 h-6 ${
                activeTab === 'user' 
                  ? 'filter brightness-0'
                  : 'opacity-60'
              }`}
            />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;