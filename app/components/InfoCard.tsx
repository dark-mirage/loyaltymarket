'use client'
import React from 'react';

const InfoCard: React.FC<{ title: string; }> = ({ title}) => {
  return (
    <div className="rounded-xl h-[112px] w-full max-w-[112px] pt-[14px] pr-[18px] pb-[73px] pl-[13px] bg-[var(--items-background)] flex-1">
      <p className="text-[13px] text-400 whitespace-pre-line w-[70px] leading-[100%] text-black mb-1">
        {title}
      </p>
    </div>
  );
};

export default InfoCard;
