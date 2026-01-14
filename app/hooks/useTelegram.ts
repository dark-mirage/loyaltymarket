"use client";
import { useEffect, useState } from "react";
import type { TelegramWebApp, TelegramUser } from "../types/telegram";

interface UseTelegramReturn {
  tg: TelegramWebApp | null;
  user: TelegramUser | null;
  isReady: boolean;
}

/**
 * Хук для работы с Telegram WebApp SDK
 * Возвращает ссылку на WebApp и user (инициализация делается в TelegramInit)
 *
 * @returns {UseTelegramReturn} Объект с tg, user и isReady
 */
export function useTelegram(): UseTelegramReturn {
  const [tg, setTg] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Проверяем, что код выполняется на клиенте
    if (typeof window === "undefined") {
      return;
    }

    // Проверяем наличие Telegram WebApp SDK
    if (!window.Telegram?.WebApp) {
      console.warn(
        "Telegram WebApp SDK не найден. Убедитесь, что скрипт подключен в layout.tsx"
      );
      return;
    }

    const webApp = window.Telegram.WebApp;

    // Получаем данные пользователя
    const userData = webApp.initDataUnsafe?.user || null;

    // Используем setTimeout для избежания синхронных setState в эффекте
    setTimeout(() => {
      setTg(webApp);
      setUser(userData);
      setIsReady(true);
    }, 0);

    // Очистка при размонтировании (если нужно)
    return () => {
      // Telegram WebApp не требует явной очистки
    };
  }, []);

  return { tg, user, isReady };
}
