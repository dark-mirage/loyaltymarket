'use client'
import React, { useState } from 'react';

const BottomNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="flex justify-around py-2 pb-[38px]">
        <button
          onClick={() => setActiveTab('home')}
          className="flex flex-col items-center gap-1 px-4 py-1"
        >
          <img 
            src="/icons/footer/Home.svg" 
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
          className="flex flex-col items-center gap-1 px-4 py-1"
        >
          <img 
            src="/icons/footer/Poizon.svg" 
            alt="Poizon" 
            className={`w-6 h-6 ${
              activeTab === 'poizon' 
                ? 'filter brightness-0'
                : 'opacity-60'
            }`}
          />
        </button>
        
        <button
          onClick={() => setActiveTab('search')}
          className="flex flex-col items-center gap-1 px-4 py-1"
        >
          <img 
            src="/icons/footer/Search.svg" 
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
          className="flex flex-col items-center gap-1 px-4 py-1"
        >
          <img 
            src="/icons/footer/Heart.svg" 
            alt="heart" 
            className={`w-6 h-6 ${
              activeTab === 'heart' 
                ? 'filter brightness-0'
                : 'opacity-60'
            }`}
          />
        </button>
        
        <button
          onClick={() => setActiveTab('trash')}
          className="flex flex-col items-center gap-1 px-4 py-1"
        >
          <img 
            src="/icons/footer/trach.svg" 
            alt="trash" 
            className={`w-6 h-6 ${
              activeTab === 'trash' 
                ? 'filter brightness-0'
                : 'opacity-60'
            }`}
          />
        </button>
        
        <button
          onClick={() => setActiveTab('user')}
          className="flex flex-col items-center gap-1 px-4 py-1"
        >
          <img 
            src="/icons/footer/User.svg" 
            alt="user" 
            className={`w-6 h-6 ${
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