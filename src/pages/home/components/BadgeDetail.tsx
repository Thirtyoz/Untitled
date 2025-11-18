import { MapPin, User, ChevronUp, ArrowLeft, Share2, Phone, Clock, Navigation, Bus, Info, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Tag } from "lucide-react";
import seoulMapImage from "figma:asset/abc96f1f08e4b34243edea143bbf3d188381c4b6.png";

interface Badge {
  id: number;
  name: string;
  location: { lat: number; lng: number };
  date: string;
  color: string;
  emoji: string;
  tags: string[];
  category: string;
  isCollected: boolean;
}

interface HomeMapScreenProps {
  onNavigate: (screen: string) => void;
  userNickname: string;
  theme: "light" | "dark";
}

const MOCK_BADGES: Badge[] = [
  // 내 배지 (수집한 배지)
  {
    id: 1,
    name: "망원 한강공원",
    location: { lat: 37.551, lng: 126.894 },
    date: "2024.03.15",
    color: "bg-amber-400",
    emoji: "🌅",
    tags: ["#한강", "#일몰"],
    category: "내 배지",
    isCollected: true,
  },
  {
    id: 2,
    name: "북촌 한옥마을",
    location: { lat: 37.582, lng: 126.983 },
    date: "2024.03.10",
    color: "bg-rose-400",
    emoji: "🏠",
    tags: ["#한옥", "#전통"],
    category: "내 배지",
    isCollected: true,
  },
  // AI 추천
  {
    id: 3,
    name: "성수 카페거리",
    location: { lat: 37.544, lng: 127.055 },
    date: "",
    color: "bg-teal-400",
    emoji: "☕",
    tags: ["#카페", "#힙지로"],
    category: "AI 추천",
    isCollected: false,
  },
  {
    id: 4,
    name: "익선동 한옥거리",
    location: { lat: 37.572, lng: 126.986 },
    date: "",
    color: "bg-cyan-400",
    emoji: "🎨",
    tags: ["#골목", "#감성"],
    category: "AI 추천",
    isCollected: false,
  },
  // 야경
  {
    id: 5,
    name: "남산타워",
    location: { lat: 37.551, lng: 126.988 },
    date: "",
    color: "bg-purple-400",
    emoji: "🗼",
    tags: ["#야경", "#랜드마크"],
    category: "야경",
    isCollected: false,
  },
  {
    id: 6,
    name: "반포 한강공원",
    location: { lat: 37.517, lng: 127.003 },
    date: "",
    color: "bg-indigo-400",
    emoji: "🌉",
    tags: ["#야경", "#분수"],
    category: "야경",
    isCollected: false,
  },
  // 단풍길
  {
    id: 7,
    name: "덕수궁 돌담길",
    location: { lat: 37.566, lng: 126.975 },
    date: "",
    color: "bg-orange-400",
    emoji: "🍂",
    tags: ["#단풍", "#산책"],
    category: "단풍길",
    isCollected: false,
  },
  {
    id: 8,
    name: "경복궁",
    location: { lat: 37.579, lng: 126.977 },
    date: "",
    color: "bg-red-400",
    emoji: "🍁",
    tags: ["#단풍", "#궁궐"],
    category: "단풍길",
    isCollected: false,
  },
  // 축제
  {
    id: 9,
    name: "여의도 벚꽃축제",
    location: { lat: 37.528, lng: 126.924 },
    date: "",
    color: "bg-pink-400",
    emoji: "🌸",
    tags: ["#축제", "#벚꽃"],
    category: "축제",
    isCollected: false,
  },
  {
    id: 10,
    name: "서울랜드",
    location: { lat: 37.436, lng: 127.017 },
    date: "",
    color: "bg-lime-400",
    emoji: "🎡",
    tags: ["#축제", "#놀이공원"],
    category: "축제",
    isCollected: false,
  },
];

const CATEGORIES = ["내 배지", "AI 추천", "야경", "단풍길", "축제"];

// Category colors for pin icons
const CATEGORY_COLORS: Record<string, string> = {
  "내 배지": "bg-[#FF6B35]",
  "AI 추천": "bg-blue-500",
  "야경": "bg-purple-500",
  "단풍길": "bg-orange-500",
  "축제": "bg-pink-500",
};

export function HomeMapScreen({ onNavigate, userNickname, theme }: HomeMapScreenProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Badge | null>(null);

  const filteredBadges = selectedCategory 
    ? MOCK_BADGES.filter((badge) => badge.category === selectedCategory)
    : MOCK_BADGES;

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
          <img
            src={seoulMapImage}
            alt="Seoul map"
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        {/* Category tags */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200 border ${
                  selectedCategory === category
                    ? "bg-[#FF6B35] text-white border-[#FF6B35]"
                    : theme === "dark"
                    ? "bg-slate-900/95 text-slate-300 border-slate-700 hover:border-slate-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Badge pins on map */}
        <div className="absolute inset-0">
          {filteredBadges.map((badge) => (
            <button
              key={badge.id}
              onClick={() => {
                if (badge.isCollected) {
                  onNavigate("badge-detail");
                } else {
                  setSelectedPlace(badge);
                }
              }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110"
              style={{
                left: `${((badge.location.lng - 126.8) / 0.4) * 100}%`,
                top: `${100 - ((badge.location.lat - 37.45) / 0.2) * 100}%`,
              }}
            >
              {/* Pin icon with category color */}
              <div className={`relative ${
                theme === "dark" ? "drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" : "drop-shadow-lg"
              }`}>
                {/* Circle background with category color */}
                <div className={`${CATEGORY_COLORS[badge.category]} w-12 h-12 rounded-full flex items-center justify-center border-2 border-white shadow-lg transform transition-all hover:scale-105 ${
                  !badge.isCollected ? "opacity-70" : ""
                }`}>
                  <MapPin className="w-7 h-7 text-white" strokeWidth={2} fill="white" />
                </div>
                
                {/* Pin shadow */}
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-2 rounded-full blur-sm ${
                  theme === "dark" ? "bg-black/40" : "bg-black/20"
                }`} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom sheet for badge list */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-30 transition-all duration-300 ease-out ${
          sheetExpanded ? "h-[70vh]" : "h-[140px]"
        } ${
          theme === "dark" ? "bg-[#0a0e1a]" : "bg-white"
        } rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)]`}
      >
        {/* Drag handle */}
        <button 
          onClick={() => setSheetExpanded(!sheetExpanded)}
          className="w-full py-4 flex flex-col items-center"
        >
          <div className={`w-12 h-1 rounded-full mb-3 ${
            theme === "dark" ? "bg-slate-700" : "bg-gray-300"
          }`} />
          <div className="flex items-center gap-2">
            {sheetExpanded ? (
              <ChevronDown className={`w-5 h-5 ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`} strokeWidth={1.5} />
            ) : (
              <ChevronUp className={`w-5 h-5 ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`} strokeWidth={1.5} />
            )}
            <span className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
              {sheetExpanded ? "접기" : "배지 목록 보기"}
            </span>
          </div>
        </button>

        {/* Badge count */}
        <div className="px-6 pb-3">
          <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
            총 {filteredBadges.length}개의 배지
          </p>
        </div>

        {/* Badge list */}
        <div className="overflow-y-auto px-6 pb-6" style={{ height: sheetExpanded ? "calc(70vh - 140px)" : "40px" }}>
          <div className="space-y-3">
            {filteredBadges.map((badge) => (
              <button
                key={badge.id}
                onClick={() => {
                  if (badge.isCollected) {
                    onNavigate("badge-detail");
                  } else {
                    setSelectedPlace(badge);
                  }
                }}
                className={`w-full rounded-2xl p-4 flex items-center gap-4 transition-all border ${
                  theme === "dark"
                    ? "bg-slate-900 hover:bg-slate-800 border-slate-800"
                    : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                }`}
              >
                {/* Badge icon */}
                <div className={`${badge.color} w-16 h-16 rounded-2xl border-2 border-white/50 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.3)] flex items-center justify-center flex-shrink-0`}>
                  <span className="text-3xl filter drop-shadow-sm">{badge.emoji}</span>
                </div>

                {/* Badge info */}
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`truncate ${theme === "dark" ? "text-white" : "text-black"}`}>
                      {badge.name}
                    </h3>
                    {badge.isCollected && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-[#FF6B35] text-white flex-shrink-0">
                        수집완료
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      badge.category === "내 배지" ? "bg-[#FF6B35]/10 text-[#FF6B35]" :
                      badge.category === "AI 추천" ? "bg-blue-500/10 text-blue-500" :
                      badge.category === "야경" ? "bg-purple-500/10 text-purple-500" :
                      badge.category === "단풍길" ? "bg-orange-500/10 text-orange-500" :
                      "bg-pink-500/10 text-pink-500"
                    }`}>
                      {badge.category}
                    </span>
                    {badge.date && (
                      <span className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
                        {badge.date}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1 mt-1">
                    {badge.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs ${theme === "dark" ? "text-slate-500" : "text-gray-500"}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrow icon */}
                <div className={theme === "dark" ? "text-slate-600" : "text-gray-400"}>
                  ›
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Place detail modal for uncollected badges */}
      {selectedPlace && (
        <div className={`fixed inset-0 z-50 flex flex-col ${
          theme === "dark" ? "bg-[#0a0e1a]" : "bg-white"
        }`}>
          {/* Header */}
          <div className={`px-6 py-4 flex items-center justify-between border-b ${
            theme === "dark" 
              ? "border-slate-800 bg-[#0a0e1a]" 
              : "border-gray-200 bg-white"
          }`}>
            <button onClick={() => setSelectedPlace(null)} className={theme === "dark" ? "text-white" : "text-black"}>
              <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
            </button>
            <span className={theme === "dark" ? "text-white" : "text-black"}>장소 상세</span>
            <button className={theme === "dark" ? "text-white" : "text-black"}>
              <Share2 className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-8 pb-32">
            {/* Badge image */}
            <div className="mb-8 flex justify-center">
              <div className="relative drop-shadow-lg">
                <div className={`${selectedPlace.color} w-40 h-40 rounded-3xl border-2 border-white/50 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.3)] flex items-center justify-center`}>
                  <span className="text-7xl filter drop-shadow-sm">{selectedPlace.emoji}</span>
                </div>
              </div>
            </div>

            {/* Place information */}
            <div className={`rounded-2xl p-6 border space-y-5 ${
              theme === "dark"
                ? "bg-slate-900 border-slate-800"
                : "bg-gray-50 border-gray-200"
            }`}>
              {/* Place name */}
              <div>
                <h2 className={`text-3xl mb-1 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}>
                  {selectedPlace.name}
                </h2>
              </div>

              {/* Description */}
              <div>
                <p className={`text-sm mb-2 ${
                  theme === "dark" ? "text-slate-400" : "text-gray-600"
                }`}>상세설명</p>
                <p className={theme === "dark" ? "text-white leading-relaxed" : "text-black leading-relaxed"}>
                  {selectedPlace.category === "AI 추천" && "AI가 추천하는 서울의 핫플레이스"}
                  {selectedPlace.category === "야경" && "서울의 아름다운 야경 명소"}
                  {selectedPlace.category === "단풍길" && "가을 단풍이 아름다운 산책로"}
                  {selectedPlace.category === "축제" && "서울의 대표 축제 장소"}
                </p>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  theme === "dark" ? "text-slate-400" : "text-gray-600"
                }`} strokeWidth={1.5} />
                <div>
                  <p className={`text-sm mb-0.5 ${
                    theme === "dark" ? "text-slate-400" : "text-gray-600"
                  }`}>주소</p>
                  <p className={theme === "dark" ? "text-white" : "text-black"}>
                    {selectedPlace.name === "성수 카페거리" && "서울시 성동구 성수동 2가"}
                    {selectedPlace.name === "익선동 한옥거리" && "서울시 종로구 익선동"}
                    {selectedPlace.name === "남산타워" && "서울시 용산구 용산동2가 산1-3"}
                    {selectedPlace.name === "반포 한강공원" && "서울시 서초구 반포동"}
                    {selectedPlace.name === "덕수궁 돌담길" && "서울시 중구 정동"}
                    {selectedPlace.name === "경복궁" && "서울시 종로구 사직로 161"}
                    {selectedPlace.name === "여의도 벚꽃축제" && "서울시 영등포구 여의도동"}
                    {selectedPlace.name === "서울랜드" && "서울시 과천시 광명로 181"}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  theme === "dark" ? "text-slate-400" : "text-gray-600"
                }`} strokeWidth={1.5} />
                <div>
                  <p className={`text-sm mb-0.5 ${
                    theme === "dark" ? "text-slate-400" : "text-gray-600"
                  }`}>전화번호</p>
                  <p className={theme === "dark" ? "text-white" : "text-black"}>
                    {selectedPlace.name === "남산타워" && "02-3455-9277"}
                    {selectedPlace.name === "경복궁" && "02-3700-3900"}
                    {selectedPlace.name === "서울랜드" && "02-509-6000"}
                    {!["남산타워", "경복궁", "서울랜드"].includes(selectedPlace.name) && "-"}
                  </p>
                </div>
              </div>

              {/* Operating hours */}
              <div className="flex items-start gap-3">
                <Clock className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  theme === "dark" ? "text-slate-400" : "text-gray-600"
                }`} strokeWidth={1.5} />
                <div>
                  <p className={`text-sm mb-0.5 ${
                    theme === "dark" ? "text-slate-400" : "text-gray-600"
                  }`}>이용시간</p>
                  <p className={theme === "dark" ? "text-white" : "text-black"}>
                    {selectedPlace.category === "야경" && "24시간 (야경 추천 일몰 후)"}
                    {selectedPlace.category === "단풍길" && "24시간 (추천 오전 9시 ~ 오후 6시)"}
                    {selectedPlace.category === "축제" && "축제 기간에 따라 상이"}
                    {selectedPlace.category === "AI 추천" && "매장별 상이"}
                  </p>
                </div>
              </div>

              {/* Detailed address */}
              <div className="flex items-start gap-3">
                <Navigation className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  theme === "dark" ? "text-slate-400" : "text-gray-600"
                }`} strokeWidth={1.5} />
                <div>
                  <p className={`text-sm mb-0.5 ${
                    theme === "dark" ? "text-slate-400" : "text-gray-600"
                  }`}>상세주소</p>
                  <p className={theme === "dark" ? "text-white" : "text-black"}>
                    {selectedPlace.name === "성수 카페거리" && "성수역 3번 출구 도보 5분"}
                    {selectedPlace.name === "익선동 한옥거리" && "종로3가역 4번 출구 도보 3분"}
                    {selectedPlace.name === "남산타워" && "명동역 케이블카 이용 또는 순환버스"}
                    {selectedPlace.name === "반포 한강공원" && "고속터미널역 8-1번 출구 도보 10분"}
                    {selectedPlace.name === "덕수궁 돌담길" && "시청역 2번 출구 도보 2분"}
                    {selectedPlace.name === "경복궁" && "경복궁역 5번 출구 바로 앞"}
                    {selectedPlace.name === "여의도 벚꽃축제" && "여의나루역 3번 출구 도보 3분"}
                    {selectedPlace.name === "서울랜드" && "대공원역 2번 출구 셔틀버스"}
                  </p>
                </div>
              </div>

              {/* Transportation */}
              <div className="flex items-start gap-3">
                <Bus className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  theme === "dark" ? "text-slate-400" : "text-gray-600"
                }`} strokeWidth={1.5} />
                <div>
                  <p className={`text-sm mb-0.5 ${
                    theme === "dark" ? "text-slate-400" : "text-gray-600"
                  }`}>교통정보</p>
                  <p className={theme === "dark" ? "text-white" : "text-black"}>
                    {selectedPlace.name === "성수 카페거리" && "지하철 2호선 성수역"}
                    {selectedPlace.name === "익선동 한옥거리" && "지하철 1,3,5호선 종로3가역"}
                    {selectedPlace.name === "남산타워" && "지하철 4호선 명동역, 버스 05번"}
                    {selectedPlace.name === "반포 한강공원" && "지하철 3,7,9호선 고속터미널역"}
                    {selectedPlace.name === "덕수궁 돌담길" && "지하철 1,2호선 시청역"}
                    {selectedPlace.name === "경복궁" && "지하철 3호선 경복궁역"}
                    {selectedPlace.name === "여의도 벚꽃축제" && "지하철 5호선 여의나루역"}
                    {selectedPlace.name === "서울랜드" && "지하철 4호선 대공원역"}
                  </p>
                </div>
              </div>

              {/* Source */}
              <div className="flex items-start gap-3">
                <Info className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  theme === "dark" ? "text-slate-400" : "text-gray-600"
                }`} strokeWidth={1.5} />
                <div>
                  <p className={`text-sm mb-0.5 ${
                    theme === "dark" ? "text-slate-400" : "text-gray-600"
                  }`}>출처</p>
                  <p className={theme === "dark" ? "text-white" : "text-black"}>
                    서울관광재단 / Visit Seoul
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex items-start gap-3">
                <Tag className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  theme === "dark" ? "text-slate-400" : "text-gray-600"
                }`} strokeWidth={1.5} />
                <div className="flex-1">
                  <p className={`text-sm mb-2 ${
                    theme === "dark" ? "text-slate-400" : "text-gray-600"
                  }`}>키워드</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlace.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-3 py-1 rounded-full text-sm border ${
                          theme === "dark"
                            ? "bg-slate-800 text-slate-300 border-slate-700"
                            : "bg-white text-gray-700 border-gray-300"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom button */}
          <div className={`px-6 pb-10 pt-4 border-t z-10 ${
            theme === "dark" ? "border-slate-800 bg-[#0a0e1a]" : "border-gray-100 bg-white"
          }`}>
            <Button
              onClick={() => {
                setSelectedPlace(null);
                onNavigate("create-badge");
              }}
              className="w-full h-12 rounded-full bg-[#FF6B35] hover:bg-[#E55A2B] text-white"
            >
              인증하기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}