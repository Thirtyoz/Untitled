import {
  ArrowLeft,
  Grid3x3,
  MapPin,
  Calendar,
  TrendingUp,
  Award,
  Star,
  Sparkles,
} from "lucide-react";

interface Badge {
  id: number;
  name: string;
  color: string;
  emoji?: string;
  image?: string;
  date: string;
  rotation?: number;
}

interface CollectionScreenProps {
  onBack: () => void;
  onBadgeClick: () => void;
  theme: "light" | "dark";
}

const MY_BADGES: Badge[] = [
  {
    id: 1,
    name: "서울대공원 동물원",
    color: "bg-amber-400",
    image: "/images/badges/capybara.png",
    date: "2023.11.15",
    rotation: -3,
  },
  {
    id: 2,
    name: "중구 반려동물 축제",
    color: "bg-pink-400",
    image: "/images/badges/dog.png",
    date: "2024.03.10",
    rotation: 2,
  },
  {
    id: 3,
    name: "어린이대공원",
    color: "bg-blue-400",
    image: "/images/badges/penguin.png",
    date: "2024.03.08",
    rotation: -1,
  },
  {
    id: 4,
    name: "한강공원 데이트",
    color: "bg-cyan-400",
    image: "/images/badges/jeju.png",
    date: "2024.03.05",
    rotation: 3,
  },
  {
    id: 5,
    name: "서울 야경 DDP",
    color: "bg-indigo-400",
    image: "/images/badges/seoul-night.png",
    date: "2024.03.01",
    rotation: -2,
  },
  {
    id: 6,
    name: "창덕궁 가을",
    color: "bg-green-400",
    image: "/images/badges/chandeokgung.png",
    date: "2024.02.28",
    rotation: 1,
  },
  {
    id: 7,
    name: "여의도 한강공원",
    color: "bg-green-400",
    emoji: "🚴",
    date: "2024.02.25",
    rotation: -3,
  },
  {
    id: 8,
    name: "경복궁",
    color: "bg-red-400",
    emoji: "🏯",
    date: "2024.02.20",
    rotation: 2,
  },
  {
    id: 9,
    name: "명동 거리",
    color: "bg-yellow-400",
    emoji: "🛍️",
    date: "2024.02.15",
    rotation: -1,
  },
  {
    id: 10,
    name: "강남역",
    color: "bg-indigo-400",
    emoji: "🌃",
    date: "2024.02.10",
    rotation: 3,
  }
];

export function CollectionScreen({
  onBack,
  onBadgeClick,
  theme,
}: CollectionScreenProps) {
  const totalBadges = 50; // 전체 배지 수
  const collectionRate = Math.round(
    (MY_BADGES.length / totalBadges) * 100,
  );

  return (
    <div
      className={`min-h-screen flex flex-col pb-16 ${
        theme === "dark" ? "bg-[#0a0e1a]" : "bg-white"
      }`}
    >
      {/* Header */}
      <div
        className={`px-6 py-4 flex items-center justify-between border-b ${
          theme === "dark"
            ? "border-slate-800 bg-[#0a0e1a]"
            : "border-gray-200 bg-white"
        }`}
      >
        <div className="flex items-center gap-3">
          <Grid3x3
            className={`w-6 h-6 ${theme === "dark" ? "text-white" : "text-black"}`}
            strokeWidth={1.5}
          />
          <span
            className={`text-xl ${theme === "dark" ? "text-white" : "text-black"}`}
          >
            나의 컬렉션
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-6">
        {/* Combined badge count and achievement card */}
        <div
          className={`rounded-2xl p-6 border-2 shadow-lg ${
            theme === "dark"
              ? "bg-gradient-to-br from-slate-900 to-slate-800 border-[#FF6B35]"
              : "bg-gradient-to-br from-[#FF6B35]/10 to-[#FF6B35]/5 border-[#FF6B35]"
          }`}
        >
          <div className="flex items-start gap-4 mb-4">
            {/* Left: Rank Icon */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#94a3b8" }}
            >
              <Star className="w-7 h-7 text-white" strokeWidth={1.5} />
            </div>

            {/* Right: Achievement info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={`${theme === "dark" ? "text-white" : "text-black"}`}>
                  서울 초보 탐험가
                </h4>
                <span className="px-2 py-0.5 bg-[#FF6B35] text-white text-xs rounded-full">
                  현재
                </span>
              </div>
              <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
                {MY_BADGES.length}개의 배지 수집
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
                다음 등급까지
              </span>
              <span className={`text-sm ${theme === "dark" ? "text-white" : "text-black"}`}>
                {MY_BADGES.length} / 10
              </span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${
              theme === "dark" ? "bg-slate-800" : "bg-gray-200"
            }`}>
              <div
                className="h-full bg-[#FF6B35] transition-all"
                style={{
                  width: `${Math.min((MY_BADGES.length / 10) * 100, 100)}%`
                }}
              />
            </div>
            <p className={`text-xs mt-2 ${theme === "dark" ? "text-slate-500" : "text-gray-500"}`}>
              {10 - MY_BADGES.length > 0 ? `${10 - MY_BADGES.length}개 더 모으면 서울 탐험가 등급!` : "곧 다음 등급으로 승급!"}
            </p>
          </div>
        </div>
      </div>

      {/* Collection Grid */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div
          className={`rounded-3xl p-6 ${
            theme === "dark"
              ? "bg-slate-900/50"
              : "bg-gradient-to-b from-gray-50/80 to-white/80"
          }`}
        >
          <div className="grid grid-cols-2 gap-6">
            {MY_BADGES.map((badge) => (
              <button
                key={badge.id}
                onClick={onBadgeClick}
                className={`relative group transition-all duration-300 hover:scale-105 ${
                  theme === "dark"
                    ? "hover:drop-shadow-[0_8px_16px_rgba(255,107,53,0.3)]"
                    : "hover:drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)]"
                }`}
                style={{
                  transform: `rotate(${badge.rotation}deg)`,
                }}
              >
                {/* Scrapbook-style background */}
                <div
                  className={`absolute inset-0 rounded-2xl ${
                    theme === "dark"
                      ? "bg-slate-800"
                      : "bg-white"
                  } border-2 ${
                    theme === "dark"
                      ? "border-slate-700"
                      : "border-gray-200"
                  } shadow-lg`}
                  style={{
                    transform: `rotate(${-(badge.rotation || 0)}deg)`,
                  }}
                />

                {/* Content */}
                <div className="relative p-4 flex flex-col items-center gap-3">
                  {/* Badge with enhanced magnet effect */}
                  <div className="relative drop-shadow-xl">
                    <div
                      className={`${badge.color} w-28 h-28 rounded-2xl border-3 border-white/60 shadow-[inset_0_-3px_6px_rgba(0,0,0,0.15),inset_0_3px_6px_rgba(255,255,255,0.4),0_8px_16px_rgba(0,0,0,0.2)] flex items-center justify-center transform transition-transform group-hover:rotate-6 overflow-hidden`}
                    >
                      {badge.image ? (
                        <img
                          src={badge.image}
                          alt={badge.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-5xl filter drop-shadow-md">
                          {badge.emoji}
                        </span>
                      )}
                    </div>
                    {/* Magnet highlight */}
                    <div
                      className={`absolute top-2 left-2 right-2 h-8 ${badge.color} opacity-30 blur-sm rounded-t-xl`}
                    />
                  </div>

                  {/* Location info */}
                  <div className="text-center w-full px-2">
                    <p
                      className={`text-sm truncate mb-1 ${
                        theme === "dark"
                          ? "text-white"
                          : "text-black"
                      }`}
                    >
                      {badge.name}
                    </p>
                    <p
                      className={`text-xs ${
                        theme === "dark"
                          ? "text-slate-500"
                          : "text-gray-500"
                      }`}
                    >
                      {badge.date}
                    </p>
                  </div>
                </div>

                {/* Tape effect on corners */}
                <div
                  className={`absolute -top-2 -left-2 w-12 h-6 opacity-40 ${
                    theme === "dark"
                      ? "bg-slate-600"
                      : "bg-gray-300"
                  } transform -rotate-45`}
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 85% 100%, 15% 100%)",
                  }}
                />
                <div
                  className={`absolute -top-2 -right-2 w-12 h-6 opacity-40 ${
                    theme === "dark"
                      ? "bg-slate-600"
                      : "bg-gray-300"
                  } transform rotate-45`}
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 85% 100%, 15% 100%)",
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Empty state if no badges */}
        {MY_BADGES.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64">
            <Grid3x3
              className={`w-16 h-16 mb-4 ${
                theme === "dark"
                  ? "text-slate-700"
                  : "text-gray-300"
              }`}
              strokeWidth={1.5}
            />
            <p
              className={`text-center ${
                theme === "dark"
                  ? "text-slate-400"
                  : "text-gray-600"
              }`}
            >
              아직 수집한 배지가 없어요
              <br />
              서울을 여행하고 배지를 모아보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
