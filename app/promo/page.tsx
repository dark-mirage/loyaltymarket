'use client'
import Header from "../../components/layout/Header"
import Footer from "../../components/layout/Footer"
import PointsHistory from "../../components/promo/promo-points"
import PromoInfoModal from "../../components/promo/PromoInfoModal"
import { useState } from "react"

export default function PromoPage() {
  // В реальном проекте здесь данные будут приходить с API
  const [isInfoOpen, setIsInfoOpen] = useState(false)

  return (
    <>
    <Header title="Баллы" bgColor="#A8A8A8"  titleColor="white"></Header>
    <main className="">
    <section className="mb-[18px] bg-[#A8A8A8] pt-[20px]"> 
        <div className="px-4 py-3 pb-[18px]">
        <div className='flex justify-center gap-4 mb-[46px]'>
            <div className='flex flex-col text-[100px] text-white items-center font-bold'>
                <span className="text-[73px] font-bold font-bebas">600</span>
                <span className="text-[15px]">Баллов</span>
            </div>
            <div className='flex flex-col text-white font-bold items-center '>
                <span className="text-[73px] font-bold font-bebas">200</span>
                <span className="text-[15px]">подарочных баллов</span>
            </div>
        </div>
        <button
          type="button"
          onClick={() => setIsInfoOpen(true)}
          className="flex w-full py-[14px] rounded-[16px] px-[20px] bg-white items-center justify-between text-left shadow-sm"
        >
          <div>
            <h3 className="text-base font-semibold leading-none">1 балл = 1 ₽</h3>
            <span className="text-sm text-gray-600">Как это работает?</span>
          </div>
          <img src="/icons/global/arrow.svg" alt="arrow" className="w-4 h-4 ml-4" />
        </button>
        </div>
    </section>
    <section className="px-4">
    <article className="bg-[#F4F3F1] p-4 mb-[17px] rounded-[16px]">
        <table className="w-full text-sm">
            <thead>
            <tr>
                <th className="py-2 px-3 text-left font-medium text-gray-700">
                Уровень
                </th>
                <th className="py-2 px-3 text-left font-medium text-gray-700">
                Заказов
                </th>
                <th className="py-2 px-3 text-left font-medium text-gray-700">
                Оплата
                </th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td className="py-2 px-3">Стартовый</td>
                <td className="py-2 px-3 text-gray-600">0-3</td>
                <td className="py-2 px-3 text-gray-600">до 10%</td>
            </tr>
            <tr>
                <td className="py-2 px-3">Продвинутый</td>
                <td className="py-2 px-3 text-gray-600">3-6</td>
                <td className="py-2 px-3 text-gray-600">до 15%</td>
            </tr>
            <tr>
                <td className="py-2 px-3">Премиум</td>
                <td className="py-2 px-3 text-gray-600">от 6</td>
                <td className="py-2 px-3 text-gray-600">до 20%</td>
            </tr>
            </tbody>
        </table>
    </article>
    </section>
    <PointsHistory />
    <PromoInfoModal open={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </main>
    <Footer></Footer>
    </>
  )
}
