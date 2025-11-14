import { ArrowLeft, Crown, Award, User } from "lucide-react";

interface RankingScreenProps {
  onBack: () => void;
  currentUserNickname: string;
}

interface RankUser {
  rank: number;
  nickname: string;
  badgeCount: number;
  isCurrentUser?: boolean;
}

const RANKING_DATA: RankUser[] = [
  { rank: 1, nickname: "서울탐험가", badgeCount: 47 },
  { rank: 2, nickname: "야경러버", badgeCount: 42 },
  { rank: 3, nickname: "카페투어러", badgeCount: 38 },
  { rank: 4, nickname: "한강지킴이", badgeCount: 35 },
  { rank: 5, nickname: "힙스터123", badgeCount: 32 },
  { rank: 6, nickname: "골목탐험대", badgeCount: 28 },
  { rank: 7, nickname: "성수덕후", badgeCount: 25 },
  { rank: 8, nickname: "익선동단골", badgeCount: 23 },
  { rank: 9, nickname: "남산러버", badgeCount: 21 },
  { rank: 10, nickname: "뷰맛집헌터", badgeCount: 19 },
];

export function RankingScreen({ onBack, currentUserNickname }: RankingScreenProps) {
  const currentUserRank = 15;
  const currentUserBadges = 12;

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack} className="text-black">
            <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
          </button>
          <div className="flex-1">
            <h2 className="text-black">PinSeoul 랭킹</h2>
            <p className="text-gray-600 text-xs">누가 가장 많은 서울을 수집했을까요?</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          <button className="px-4 py-2 bg-black text-white rounded-full text-sm">전체</button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full text-sm hover:border-gray-400">
            친구
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full text-sm hover:border-gray-400">
            이번 달
          </button>
        </div>
      </div>

      {/* My rank card - sticky */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 sticky top-[140px] z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <p className="text-black">{currentUserNickname}</p>
            <p className="text-gray-600 text-sm">내 랭킹</p>
          </div>
          <div className="text-right">
            <p className="text-black text-xl">{currentUserRank}위</p>
            <p className="text-gray-600 text-xs">{currentUserBadges}개 배지</p>
          </div>
        </div>
      </div>

      {/* Ranking list */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
        {RANKING_DATA.map((user) => {
          const isTop3 = user.rank <= 3;
          const rankEmoji = getRankIcon(user.rank);
          
          return (
            <div
              key={user.rank}
              className={`rounded-2xl p-4 flex items-center gap-4 transition-all ${
                isTop3
                  ? "bg-gray-50 border-2 border-black"
                  : "bg-white border border-gray-200"
              }`}
            >
              {/* Rank badge */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isTop3
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {rankEmoji ? (
                  <span className="text-2xl">{rankEmoji}</span>
                ) : (
                  <span className="text-sm">{user.rank}</span>
                )}
              </div>

              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isTop3
                    ? "bg-black"
                    : "bg-gray-200"
                }`}
              >
                <User className={`w-5 h-5 ${isTop3 ? "text-white" : "text-gray-600"}`} strokeWidth={1.5} />
              </div>

              {/* User info */}
              <div className="flex-1 min-w-0">
                <p className="truncate text-black">
                  {user.nickname}
                </p>
                <p className="text-sm text-gray-600">
                  {user.badgeCount}개 배지
                </p>
              </div>
            </div>
          );
        })}

        {/* Motivational message */}
        <div className="mt-8 text-center py-6">
          <p className="text-gray-600 text-sm leading-relaxed">
            더 많은 서울을 수집하고
            <br />
            <span className="text-black">랭킹을 올려보세요!</span>
          </p>
        </div>
      </div>
    </div>
  );
}