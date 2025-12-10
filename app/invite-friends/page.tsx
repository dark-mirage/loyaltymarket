import Footer from '../components/layout/Footer'

export default function InviteFriends() {
  // В реальном проекте здесь данные будут приходить с API
  const stats = {
    visited: 1000,
    started: 850,
    promocodes: 720,
  };

  const invitedUsers = [
    {
      id: 1,
      name: "antwap",
      avatar: "https://i.pravatar.cc/150?img=3",
      date: "Май 9,2025 в 21:20",
      status: "Приглашён",
    },
    {
      id: 2,
      name: "Егор",
      avatar: "https://i.pravatar.cc/150?img=5",
      date: "Май 9,2025 в 21:20",
      status: "Приглашён",
    },
    {
      id: 3,
      name: "Vika",
      avatar: "https://i.pravatar.cc/150?img=5",
      date: "Май 9,2025 в 21:20",
      status: "Уже пользуется",
    },
  ];

  return (
    <div className='px-4 py-3 pb-20'>
      <span className='text-center text-[15px]'>Зовите друзей</span>

      <h1 className='text-[25px] font-bold'>
        Зовите друзей и получайте скидку
      </h1>

      <p className='text-[20px] mb-5'>
        Пригласите в приложение 3 друзей по своей ссылке и мы подарим вам промокод
        на скидку 10%
      </p>

      {/* ССЫЛКА ДЛЯ ПРИГЛАШЕНИЙ */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">
          Ваша ссылка для приглашений
        </h3>

        <div className="flex flex-col items-center gap-2 mb-3">
          <input
            type="text"
            value="https://example.com/invite/12345"
            readOnly
            className="flex-1 w-full px-3 py-2 border rounded-lg text-sm bg-gray-50"
          />

          <button className="px-3 py-2 w-full bg-black text-white text-sm rounded-lg hover:bg-gray-300">
            Поделиться
          </button>
        </div>
      </div>

      {/* БЛОК СТАТИСТИКИ */}
      <div className="bg-gray-100 rounded-xl p-4 mb-8">
        <h3 className="text-lg font-semibold mb-3">Статистика</h3>

        <div className="space-y-2">
          <div className="flex justify-between text-[16px]">
            <span>Перешли по ссылке</span>
            <span className="font-semibold">{stats.visited}</span>
          </div>

          <div className="flex justify-between text-[16px]">
            <span>Запустили приложение</span>
            <span className="font-semibold">{stats.started}</span>
          </div>

          <div className="flex justify-between text-[16px]">
            <span>Получено промокодов</span>
            <span className="font-semibold">{stats.promocodes}</span>
          </div>
        </div>
      </div>

      {/* ИСТОРИЯ ПРИГЛАШЁННЫХ */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-4">История приглашений:</h3>

        <div className="space-y-3">
          {invitedUsers.map(user => (
            <div
              key={user.id}
              className="flex items-center bg-gray-50 rounded-xl p-3 shadow-sm"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full mr-3"
              />

              <div className="flex-1">
                <div className="font-semibold">{user.name}</div>
                <div className="text-sm text-gray-500">{user.date}</div>
              </div>


             <div className="flex flex-col items-center text-sm font-medium">
                <span className="mr-2">
                    {user.status === "Уже пользуется" ? "✅" : "➖"}
                </span>
                <span
                    className={
                    user.status === "Уже пользуется"
                        ? "text-green-600"
                        : "text-blue-600"
                    }
                >
                    {user.status}
                </span>
                </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
