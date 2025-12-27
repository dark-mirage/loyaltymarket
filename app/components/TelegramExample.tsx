'use client'
import { useTelegram } from '../hooks/useTelegram'

/**
 * Пример использования хука useTelegram в клиентском компоненте
 */
export default function TelegramExample() {
  const { tg, user, isReady } = useTelegram()

  // Показываем загрузку, пока WebApp не готов
  if (!isReady) {
    return (
      <div className="p-4">
        <p>Инициализация Telegram WebApp...</p>
      </div>
    )
  }

  // Если WebApp недоступен (например, открыто в обычном браузере)
  if (!tg) {
    return (
      <div className="p-4">
        <p>Telegram WebApp недоступен. Откройте приложение в Telegram.</p>
      </div>
    )
  }

  const handleShowAlert = () => {
    tg?.showAlert('Привет из Telegram WebApp!')
  }

  const handleHapticFeedback = () => {
    tg?.HapticFeedback.impactOccurred('medium')
  }

  const handleClose = () => {
    tg?.close()
  }

  // Используем viewportHeight вместо 100vh для корректной работы в Telegram
  const viewportHeight = tg?.viewportHeight || '100vh'

  return (
    <div 
      className="p-4 space-y-4"
      style={{ minHeight: typeof viewportHeight === 'number' ? `${viewportHeight}px` : viewportHeight }}
    >
      <div className="bg-white rounded-lg p-4 shadow">
        <h2 className="text-xl font-bold mb-4">Информация о Telegram WebApp</h2>
        
        {/* Информация о пользователе */}
        {user ? (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Пользователь:</h3>
            <ul className="text-sm space-y-1">
              <li>ID: {user.id}</li>
              <li>Имя: {user.first_name} {user.last_name || ''}</li>
              {user.username && <li>Username: @{user.username}</li>}
              {user.language_code && <li>Язык: {user.language_code}</li>}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-gray-600 mb-4">Пользователь не авторизован</p>
        )}

        {/* Информация о WebApp */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">WebApp:</h3>
          <ul className="text-sm space-y-1">
            <li>Версия: {tg.version}</li>
            <li>Платформа: {tg.platform}</li>
            <li>Цветовая схема: {tg.colorScheme}</li>
            <li>Высота viewport: {tg.viewportHeight}px</li>
            <li>Развернут: {tg.isExpanded ? 'Да' : 'Нет'}</li>
          </ul>
        </div>

        {/* Кнопки для тестирования */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleShowAlert}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Показать Alert
          </button>
          
          <button
            onClick={handleHapticFeedback}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Тактильная обратная связь
          </button>
          
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Закрыть приложение
          </button>
        </div>
      </div>
    </div>
  )
}

