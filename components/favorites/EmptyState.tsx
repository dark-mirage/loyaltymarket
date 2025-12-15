'use client'
import React from 'react';

export default function EmptyState() {
  return (
    <div className="bg-white rounded-b-[25px] px-4 py-[160px]">
      <div className="flex flex-col items-center gap-[9px] max-w-[273px] mx-auto">
        <h2 className="text-[20px] font-semibold leading-[1.06em] tracking-[-0.01em] uppercase text-black text-center">
          В избранном пока пусто
        </h2>
        <p className="text-[14px] font-normal leading-[1.21em] text-black text-center">
          Добавляйте товары в избранное, чтобы купить их позже
        </p>
      </div>
    </div>
  );
}