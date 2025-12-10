export interface InvitedUser {
  id: number;
  name: string;
  avatar: string;
  invitedAt: string;
  status: "invited" | "active";
}

interface InviteHistoryProps {
  users: InvitedUser[];
}

export default function InviteHistory({ users }: InviteHistoryProps) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">История приглашений</h3>

      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
          >
            {/* аватар + имя */}
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-medium">{user.name}</span>
            </div>

            {/* дата */}
            <span className="text-sm text-gray-500">{user.invitedAt}</span>

            {/* статус */}
            <span
              className={
                user.status === "active"
                  ? "text-green-600 font-medium"
                  : "text-orange-600 font-medium"
              }
            >
              {user.status === "active" ? "Пользуется" : "Приглашён"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
