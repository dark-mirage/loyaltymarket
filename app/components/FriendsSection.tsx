'use client'
import React, { useRef, useEffect, useState } from 'react'
import InfoCard from './InfoCard'
import  Link  from "next/link"


const FriendsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>(0)
  const [isPaused, setIsPaused] = useState(false)

  const cards = ['Наша команда', 'Оплата \n и сплит', 'Доставка и отслеживание', 'Возврат и обмен']
  const duplicatedCards = [...cards, ...cards]

  useEffect(() => {
    if (!containerRef.current || isPaused) return

    let position = 0
    const speed = 0 // пикселей за кадр
    
    const animate = () => {
      if (!containerRef.current) return
      
      position += speed
      const container = containerRef.current
      const scrollWidth = container.scrollWidth / 2 // потому что карточек в 2 раза больше
      
      // Если прокрутили весь набор, начинаем сначала
      if (position >= scrollWidth) {
        position = 0
      }
      
      container.style.transform = `translateX(-${position}px)`
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPaused])

  // Avatars referenced from public/icons/home-main
  // Make sure files exist: public/icons/home-main/Ava-1.svg etc.
  const friends = [
    { id: 1, avatar: '/icons/home-main/Ava-1.svg', name: 'Friend1' },
    { id: 2, avatar: '/icons/home-main/Ava-2.svg', name: 'Friend2' },
    { id: 3, avatar: '/icons/home-main/Ava-3.svg', name: 'Friend3' },
  ]

  const [imgErrorMap, setImgErrorMap] = useState<Record<number, boolean>>({})
  return (
    <div className="px-4 py-3 pt-[4px] bg-white">
      {/* Карусель с JS анимацией */}
      <div className="mb-4 overflow-hidden relative">
        <div 
          ref={containerRef}
          className="flex gap-2"
          style={{
            width: 'max-content',
            willChange: 'transform',
            transition: isPaused ? 'none' : 'transform 0s linear'
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {duplicatedCards.map((title, idx) => (
            <div 
              key={idx} 
              className="flex-shrink-0 w-[112px]"
            >
              <InfoCard title={title} />
            </div>
          ))}
        </div>
        
        {/* Градиенты по краям */}
      </div>

      {/* Блоки друзей и баллов */}
      <div className="flex gap-2">
        <Link href="/invite-friends">
        <div className="flex-1 bg-[var(--items-background)] rounded-[16px] p-[12px] pt-[15px] pl-[16px] m-w-[180px]">
          <div className='mb-[19px]'>
            <span className="block text-[15px] font-semibold mb-[-2px]">Зовите друзей</span>
            <span className="block text-[13px] font-normal">Дарим скидку 10%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2 pl-[-1px] gap-[4px]">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="w-[38px] h-[28px] rounded-full flex items-center justify-center text-xs overflow-hidden"
                >
                  {!imgErrorMap[friend.id] ? (
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-full h-full object-cover bg-[rgba(244,243,241,1)]"
                      onError={() => setImgErrorMap(prev => ({ ...prev, [friend.id]: true }))}
                    />
                  ) : (
                    <span className="text-xs">👤</span>
                  )}
                </div>
              ))}
            </div>
            <button className="w-8 h-8 rounded-full bg-white   flex items-center justify-center text-xl ml-3">
              <img src="/icons/home-main/plus.svg" alt="plus" />
            </button>
          </div>
        </div>
        </Link>

        <div className="flex-1 bg-[var(--items-background)] rounded-[16px] p-[12px] pt-[15px] pl-[15px] m-w-[180px]">
          <Link href="/promo">
            <div className="text-sm font-semibold mb-4">
              <span className='block text-[15px] font-semibold mb-[-px]'>Баллы</span>
              <span className="block text-[13px] font-normal">1 балл = 1 ₽ </span>
            </div>
            <div className="flex items-center text-[25px]">
              11
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FriendsSection