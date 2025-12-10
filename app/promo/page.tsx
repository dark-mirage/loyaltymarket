
export default function PromoPage() {
  // В реальном проекте здесь данные будут приходить с API

  return (
    <>
    <div className="mb-[18px]">
        <div className="px-4 py-3 bg-[#8C8C8C] ">
        <span className='flex justify-center text-[15px] mb-[49px]'>Баллы</span>

        <div className='flex justify-between mb-[46px]'>
            <div className='flex flex-col text-[25px] font-bold'>
                <span className="text-[73px]">600</span>
                <span className="text-[15px]">Баллов</span>
            </div>
            <div className='flex flex-col text-[25px] font-bold'>
                <span className="text-[73px]">200</span>
                <span className="text-[15px]">подарочных баллов</span>
            </div>
        </div>

        <div className="flex bg-white py-[14px] rounded-[16px] px-[20px]">
            <div>
                <h3>1 балл = 1 ₽</h3>
                <span>Как это работает?</span>
            </div>
            <img src="/icons/global/arrow.svg" alt="arrow" className="w-3 h-3" />
        </div>
        </div>
    </div>
    <div className="px-4">
    <div className="bg-[#F4F3F1] p-4 rounded-[16px]">
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
    </div>
    </div>
    </>
  )
}
