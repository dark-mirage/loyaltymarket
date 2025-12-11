'use client'
import React, { useState } from 'react';


const BottomNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  // Базовый путь к иконкам — поправьте здесь, если иконки лежат не в public/icons/footer
  const ICONS_PATH = '/icons/footer';

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="flex py-2 pb-[40px] pl-[23px]">
        <button
          onClick={() => setActiveTab('home')}
          className="flex flex-col items-center py-1 mr-[40px]"
        >
          <img 
            src={`${ICONS_PATH}/Home.svg`}
            alt="home" 
            className={`w-6 h-6 ${
              activeTab === 'home' 
                ? 'filter brightness-0' 
                : 'opacity-60'
            }`}
          />
        </button>
        
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
        
        <button
          onClick={() => setActiveTab('search')}
          className="flex flex-col items-center py-1 pt-[6px] mr-[44px]"
        >
          <img
            src={`${ICONS_PATH}/Search.svg`} 
            style={{ width: '32px', height: '18px'}}
            alt="Search" 
            className={`w-6 h-6 ${
              activeTab === 'search' 
                ? 'filter brightness-0'
                : 'opacity-60'
            }`}
          />
        </button>

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
      </div>
    </div>
  );
};

export default BottomNavigation;