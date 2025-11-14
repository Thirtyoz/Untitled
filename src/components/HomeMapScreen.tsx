import { MapPin, Plus, User, Sparkles, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Badge {
  id: number;
  name: string;
  location: { lat: number; lng: number };
  date: string;
  color: string;
  emoji: string;
  tags: string[];
}

interface HomeMapScreenProps {
  onNavigate: (screen: string) => void;
  userNickname: string;
  theme: "light" | "dark";
}

const MOCK_BADGES: Badge[] = [
  {
    id: 1,
    name: "망원 한강공원",
    location: { lat: 37.551, lng: 126.894 },
    date: "2024.03.15",
    color: "bg-amber-400",
    emoji: "🌅",
    tags: ["#한강", "#일몰"],
  },
  {
    id: 2,
    name: "북촌 한옥마을",
    location: { lat: 37.582, lng: 126.983 },
    date: "2024.03.10",
    color: "bg-rose-400",
    emoji: "🏠",
    tags: ["#한옥", "#전통"],
  },
  {
    id: 3,
    name: "성수 카페거리",
    location: { lat: 37.544, lng: 127.055 },
    date: "2024.03.08",
    color: "bg-teal-400",
    emoji: "☕",
    tags: ["#카페", "#힙지로"],
  },
  {
    id: 4,
    name: "남산타워",
    location: { lat: 37.551, lng: 126.988 },
    date: "2024.03.05",
    color: "bg-purple-400",
    emoji: "🗼",
    tags: ["#야경", "#랜드마크"],
  },
  {
    id: 5,
    name: "이태원 경리단길",
    location: { lat: 37.534, lng: 126.994 },
    date: "2024.03.01",
    color: "bg-blue-400",
    emoji: "🍜",
    tags: ["#맛집", "#다이닝"],
  },
];

export function HomeMapScreen({ onNavigate, userNickname, theme }: HomeMapScreenProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [sheetExpanded, setSheetExpanded] = useState(false);

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${
      theme === "dark" ? "bg-[#0a0e1a]" : "bg-white"
    }`}>
      {/* Top app bar */}
      <div className={`px-6 py-4 flex items-center justify-between border-b z-20 ${
        theme === "dark" 
          ? "border-slate-800 bg-[#0a0e1a]" 
          : "border-gray-200 bg-white"
      }`}>
        <div className="flex items-center gap-2">
          <MapPin className={`w-6 h-6 ${theme === "dark" ? "text-white" : "text-black"}`} strokeWidth={1.5} />
          <span className={`text-xl ${theme === "dark" ? "text-white" : "text-black"}`}>PinSeoul</span>
        </div>
        <button
          onClick={() => onNavigate("mypage")}
          className={`w-9 h-9 rounded-full flex items-center justify-center ${
            theme === "dark" ? "bg-white text-black" : "bg-black text-white"
          }`}
        >
          <User className="w-5 h-5" />
        </button>
      </div>

      {/* Map area */}
      <div className={`flex-1 relative ${theme === "dark" ? "bg-slate-900" : "bg-gray-50"}`}>
        {/* Map background - Seoul map photo */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/flagged/photo-1580051720305-a944536881fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTZW91bCUyMG1hcCUyMGFlcmlhbHxlbnwxfHx8fDE3NjMwMzgyNjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Seoul map"
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        {/* AI Recommendation banner */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className={`rounded-2xl p-3 flex items-center gap-3 shadow-sm border ${
            theme === "dark"
              ? "bg-slate-900/95 border-slate-700"
              : "bg-white border-gray-200"
          }`}>
            <Sparkles className="w-5 h-5 text-[#FF6B35] flex-shrink-0" strokeWidth={1.5} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${theme === "dark" ? "text-white" : "text-black"}`}>
                AI 추천: 오늘은 <span className="font-medium">'망원 한강공원'</span> 어때요?
              </p>
            </div>
            <button
              onClick={() => onNavigate("ai-recommend")}
              className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-colors ${
                theme === "dark"
                  ? "bg-slate-800 hover:bg-slate-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-black"
              }`}
            >
              보기
            </button>
          </div>
        </div>

        {/* Badge pins on map */}
        <div className="absolute inset-0">
          {MOCK_BADGES.map((badge) => (
            <button
              key={badge.id}
              onClick={() => onNavigate("badge-detail")}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110"
              style={{
                left: `${((badge.location.lng - 126.8) / 0.4) * 100}%`,
                top: `${100 - ((badge.location.lat - 37.45) / 0.2) * 100}%`,
              }}
            >
              {/* Fridge magnet style badge */}
              <div className={`relative ${
                theme === "dark" ? "drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" : "drop-shadow-lg"
              }`}>
                {/* Badge container with 3D effect */}
                <div className={`${badge.color} w-16 h-16 rounded-2xl flex flex-col items-center justify-center border-2 border-white/50 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.3)] transform transition-all hover:rotate-2`}>
                  {/* Emoji */}
                  <span className="text-2xl filter drop-shadow-sm">{badge.emoji}</span>
                </div>
                
                {/* Pin shadow */}
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-2 rounded-full blur-sm ${
                  theme === "dark" ? "bg-black/40" : "bg-black/20"
                }`} />
              </div>
            </button>
          ))}
        </div>

        {/* Floating action button */}
        <button
          onClick={() => onNavigate("create-badge")}
          className="absolute bottom-24 right-6 w-14 h-14 rounded-full bg-[#FF6B35] shadow-sm flex items-center justify-center group hover:bg-[#E55A2B] transition-all duration-200"
        >
          <Plus className="w-7 h-7 text-white group-hover:rotate-90 transition-transform duration-300" strokeWidth={1.5} />
        </button>
      </div>

      {/* Bottom sheet with recent badges */}
      <div
        className={`relative rounded-t-3xl border-t-2 shadow-2xl transition-all duration-300 ${
          sheetExpanded ? "h-96" : "h-64"
        } ${
          theme === "dark"
            ? "bg-slate-900 border-slate-700"
            : "bg-white border-gray-200"
        }`}
      >
        {/* Drag handle */}
        <button
          onClick={() => setSheetExpanded(!sheetExpanded)}
          className="w-full py-3 flex items-center justify-center"
        >
          <div className={`w-12 h-1 rounded-full ${
            theme === "dark" ? "bg-slate-600" : "bg-gray-300"
          }`} />
        </button>

        {/* Sheet header */}
        <div className="px-6 pb-3 flex items-center justify-between">
          <h3 className={theme === "dark" ? "text-white" : "text-black"}>최근 수집한 배지</h3>
          <span className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>{MOCK_BADGES.length}개</span>
        </div>

        {/* Badge list */}
        <div className="px-6 pb-6 space-y-3 overflow-y-auto" style={{ maxHeight: sheetExpanded ? "280px" : "140px" }}>
          {MOCK_BADGES.map((badge) => (
            <div
              key={badge.id}
              onClick={() => onNavigate("badge-detail")}
              className={`w-full rounded-xl p-3 flex items-center gap-3 transition-colors border cursor-pointer ${
                theme === "dark"
                  ? "bg-slate-800/50 hover:bg-slate-800 border-slate-700"
                  : "bg-white hover:bg-gray-50 border-gray-200"
              }`}
            >
              {/* Badge image */}
              <div className={`${badge.color} w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-white/50 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.3)]`}>
                <span className="text-2xl">{badge.emoji}</span>
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className={`text-sm mb-1 truncate ${theme === "dark" ? "text-white" : "text-black"}`}>{badge.name}</p>
                <p className={`text-xs mb-1 ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>{badge.date}</p>
                <div className="flex gap-2 flex-wrap">
                  {badge.tags.map((tag) => (
                    <span key={tag} className={`text-xs ${theme === "dark" ? "text-slate-500" : "text-gray-500"}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}