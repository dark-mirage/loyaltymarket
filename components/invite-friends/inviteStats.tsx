interface InviteStatsProps {
  stats: {
    invitedCount: number;
    launchedApp: number;
    promoGiven: number;
  };
}

export default function InviteStats({ stats }: InviteStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 my-6">
      <div className="p-3 bg-gray-100 rounded-lg text-center">
        <p className="text-xl font-bold">{stats.invitedCount}</p>
        <p className="text-sm text-gray-500">Перешло по ссылке</p>
      </div>

      <div className="p-3 bg-gray-100 rounded-lg text-center">
        <p className="text-xl font-bold">{stats.launchedApp}</p>
        <p className="text-sm text-gray-500">Запустило приложение</p>
      </div>

      <div className="p-3 bg-gray-100 rounded-lg text-center">
        <p className="text-xl font-bold">{stats.promoGiven}</p>
        <p className="text-sm text-gray-500">Получено промокодов</p>
      </div>
    </div>
  );
}
