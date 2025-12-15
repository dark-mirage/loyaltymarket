'use client'
import { useState } from "react";

interface PointsHistoryItem {
  id: number;
  order: string;
  date: string;
  points: number; // положительное или отрицательное
  isInvite?: boolean; // флаг для приглашения
}

export default function PointsHistory() {
  const [history] = useState<PointsHistoryItem[]>([
    {
      id: 1,
      order: "42974781810",
      date: "Май 10, 2025 в 21:20",
      points: -200,
    },
    {
      id: 2,
      order: "42974781809",
      date: "Май 9, 2025 в 22:20",
      points: 200,
    },
    {
      id: 3,
      order: "42974781820",
      date: "Май 8, 2025 в 22:20",
      points: 200,
      isInvite: true,
    },
  ]);

  return (
    <div className="px-4 pt-3 pb-4">
      {/* Заголовок */}
      <h2 className="text-[12px] font-normal  text-[#7E7E7E] mb-[17px] leading-[0.87em]">
        История баллов:
      </h2>

      {/* Список записей */}
      <div className="flex flex-col gap-[9px]">
        {history.map((item, index) => (
          <div key={item.id} className="relative w-full">
            {/* Контейнер записи */}
            <div className="relative flex items-start gap-3 w-full">
              {/* Левая часть: аватар и информация */}
              <div className="relative flex items-center gap-[11px] flex-shrink-0">
                {/* Аватар */}
                <div className="relative w-11 h-11 rounded-full bg-[#F4F3F1] overflow-hidden flex-shrink-0">
                  <img
                    src={item.points < 0 ? "/icons/promo/box-grey.svg" : "/icons/promo/box-colored.svg"}
                    alt="the box"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Информация о заказе */}
                <div className="flex flex-col gap-1">
                  <div className="text-[15px] font-medium leading-[1.21em] text-black">
                    Заказ {item.order}
                  </div>
                  <div className="text-[12px] font-normal leading-[1.21em] text-[#7E7E7E]">
                    {item.date}
                  </div>
                </div>
              </div>

              {/* Сумма баллов (справа) */}
              <div className="absolute right-0 top-[13px] text-[15px] font-medium  leading-[1.21em] tracking-[-0.01em] whitespace-nowrap text-black">
                {item.points > 0 ? `+${item.points}` : item.points}
              </div>
            </div>

            {/* Линия-разделитель (кроме последнего элемента) */}
            {index < history.length - 1 && (
              <div
                className="absolute left-[55px] bottom-[-4.5px] h-[0.5px] bg-[#CDCDCD]"
                style={{ width: "calc(100% - 55px)", maxWidth: "315px" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
