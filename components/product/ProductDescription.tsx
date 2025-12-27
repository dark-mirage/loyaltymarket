'use client'
import React, { useState } from 'react'

interface ProductDescriptionProps {
  description: string
  features?: string[]
}

/**
 * Компонент секции "О товаре"
 */
export default function ProductDescription({ description, features }: ProductDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="px-4 py-4 bg-white border-t border-[#F4F3F1]">
      <h2 className="text-[18px] font-semibold mb-3 text-black">О товаре</h2>
      
      <div className="space-y-3">
        <p className={`text-[14px] font-normal leading-[140%] text-[#7E7E7E] ${
          !isExpanded ? 'line-clamp-4' : ''
        }`}>
          {description}
        </p>

        {features && features.length > 0 && (
          <div className="space-y-2 mt-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-[14px] text-[#7E7E7E] mt-1">•</span>
                <span className="text-[14px] font-normal leading-[140%] text-[#7E7E7E] flex-1">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        )}

        {description.length > 200 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[14px] font-medium text-black mt-2"
          >
            {isExpanded ? 'Свернуть' : 'Развернуть'}
          </button>
        )}
      </div>
    </div>
  )
}

