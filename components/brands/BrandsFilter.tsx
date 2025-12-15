'use client'
import React from 'react';

interface BrandsFilterProps {
  letters: string[];
  selectedLetter?: string;
  onSelectLetter?: (letter: string) => void;
}

export default function BrandsFilter({ letters, selectedLetter, onSelectLetter }: BrandsFilterProps) {
  return (
    <div className="flex flex-col gap-[14px]">
      {letters.map((letter, index) => (
        <button
          key={index}
          onClick={() => onSelectLetter?.(letter)}
          className={`w-full h-[29px] bg-[#F4F3F1] rounded-[6px] flex items-center  px-[7px] py-[5px] ${
            selectedLetter === letter ? 'bg-black' : ''
          }`}
        >
          <span className={`text-[12px] font-medium leading-[1.061em]  ${
            selectedLetter === letter ? 'text-white' : 'text-[#7E7E7E]'
          }`}>
            {letter}
          </span>
        </button>
      ))}
    </div>
  );
}

