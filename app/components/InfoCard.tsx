'use client'
import React from 'react';

const InfoCard: React.FC<{ title: string; }> = ({ title}) => {
  return (
    <div className="rounded-xl h-[112px] w-full max-w-[112px] pt-[12px] pr-[18px] pb-[73px] pl-[13px] bg-[var(--items-background)] flex-1">
      <p className="text-[12px] whitespace-pre-line  leading-[112%] tracking-normal text-black mb-1">
        {title}
      </p>
    </div>
  );
};

export default InfoCard;
