import { useState } from "react";

interface PointsHistoryItem {
  id: number;
  avatar?: string; // если есть аватарка
  order: string;
  date: string;
  points: number; // положительное или отрицательное
}

export default function PointsHistory() {
  const [history, setHistory] = useState<PointsHistoryItem[]>([
    {
      id: 1,
      avatar: "/avatars/user1.png",
      order: "Заказ 42974781810",
      date: "Май 9, 2025 в 22:20",
      points: 50,
    },
    {
      id: 2,
      order: "Заказ 42974781811",
      date: "Май 10, 2025 в 18:10",
      points: -20,
    },
  ]);

  return (
    <div className="space-y-4">
      {history.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
        >
          {/* Слева: аватарка или цветной прямоугольник */}
          <div className="flex-shrink-0">
            {item.avatar ? (
              <img
                src={item.avatar}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div
                className={`w-12 h-12 rounded-lg ${
                  item.points >= 0 ? "bg-green-400" : "bg-gray-300"
                }`}
              />
            )}
          </div>

          {/* Центр: заказ и дата */}
          <div className="flex-1 ml-4">
            <div className="font-semibold">{item.order}</div>
            <div className="text-sm text-gray-500">{item.date}</div>
          </div>

          {/* Справа: плюс или минус баллы */}
          <div
            className={`font-bold text-lg ${
              item.points >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {item.points > 0 ? `+${item.points}` : item.points}
          </div>
        </div>
      ))}
    </div>
  );
}
