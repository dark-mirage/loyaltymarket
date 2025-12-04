'use client'
import React from 'react';
import { Search } from 'lucide-react';

const SearchBar: React.FC = () => {
  return (
    <div className="px-4 py-3 pb-[0] ">
      <div className="bg-[var(--items-background)] rounded-[16px] flex items-center gap-2 rounded-lg pt-[15px] pb-[15px] pr-[40px] pl-[14px] ">
        <Search size={21} className="text-black" />
        <input 
          type="text" 
          placeholder="Поиск" 
          className="bg-transparent flex-1 outline-none placeholder:text-black placeholder:pl-[1px] placeholder:text-[17px] text-sm"
        />
      </div>
    </div>
  );
};

export default SearchBar;
