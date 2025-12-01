'use client'
import React from 'react';
import { Search } from 'lucide-react';

const SearchBar: React.FC = () => {
  return (
    <div className="px-4 py-3 ">
      <div className="bg-[var(--items-background)] rounded-[16px] flex items-center gap-2 rounded-lg px-[16px] py-[15px]">
        <Search size={18} className="text-black" />
        <input 
          type="text" 
          placeholder="Поиск" 
          className="bg-transparent flex-1 outline-none placeholder:text-black text-sm"
        />
      </div>
    </div>
  );
};

export default SearchBar;
