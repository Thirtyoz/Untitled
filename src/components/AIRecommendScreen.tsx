import { ArrowLeft, MapPin, Star, Navigation, Bookmark, Map, List } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Recommendation {
  id: string;
  name: string;
  location: string;
  tags: string[];
  description: string;
  image: string;
  isNew: boolean;
  position: { top: string; left: string };
  color: string;
  bookmarked: boolean;
}

interface AIRecommendScreenProps {
  onBack: () => void;
}

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: "r1",
    name: "망원 한강공원",
    location: "마포구 망원동",
    tags: ["#한강", "#야경", "#산책"],
    description: "한강뷰가 멋진 일몰 명소",
    image: "https://images.unsplash.com/photo-1652172176566-5d69fc9d9961?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIYW4lMjBSaXZlciUyMFNlb3VsfGVufDF8fHx8MTc2MzAzNTY0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    isNew: true,
    position: { top: "45%", left: "38%" },
    color: "bg-[#FF6B35]",
    bookmarked: false,
  },
  {
    id: "r2",
    name: "연남동 골목",
    location: "마포구 연남동",
    tags: ["#골목탐방", "#카페투어", "#힙한동네"],
    description: "골목 감성이 좋은 로컬 동네",
    image: "https://images.unsplash.com/photo-1552723690-81d6a52f37de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLb3JlYW4lMjBjYWZlJTIwYWVzdGhldGljfGVufDF8fHx8MTc2MzAzNTY0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    isNew: true,
    position: { top: "40%", left: "42%" },
    color: "bg-[#FF6B35]",
    bookmarked: false,
  },
  {
    id: "r3",
    name: "경의선숲길",
    location: "마포구 연남동",
    tags: ["#산책", "#사진명소", "#데이트"],
    description: "도심 속 힐링 산책로",
    image: "https://images.unsplash.com/photo-1698738744199-73bae29362bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTZW91bCUyMGxhbmRtYXJrfGVufDF8fHx8MTc2MzAzNTY0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    isNew: true,
    position: { top: "38%", left: "44%" },
    color: "bg-[#FF6B35]",
    bookmarked: false,
  },
  {
    id: "r4",
    name: "북촌 한옥마을",
    location: "종로구 북촌동",
    tags: ["#한옥", "#사진명소", "#전통"],
    description: "전통미 가득한 서울의 명소",
    image: "https://images.unsplash.com/photo-1552568165-02cfdb51bc7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTZW91bCUyMHNreWxpbmUlMjBuaWdodHxlbnwxfHx8fDE3NjI5NjA5NjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    isNew: true,
    position: { top: "42%", left: "50%" },
    color: "bg-[#FF6B35]",
    bookmarked: false,
  },
  // Existing visited badges
  {
    id: "e1",
    name: "남산타워",
    location: "용산구",
    tags: [],
    description: "",
    image: "",
    isNew: false,
    position: { top: "48%", left: "52%" },
    color: "bg-gray-300",
    bookmarked: false,
  },
  {
    id: "e2",
    name: "성수동",
    location: "성동구",
    tags: [],
    description: "",
    image: "",
    isNew: false,
    position: { top: "42%", left: "62%" },
    color: "bg-gray-300",
    bookmarked: false,
  },
];

export function AIRecommendScreen({ onBack }: AIRecommendScreenProps) {
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [selectedSpot, setSelectedSpot] = useState<Recommendation | null>(null);
  const [activeTab, setActiveTab] = useState("전체");
  const [spots, setSpots] = useState(RECOMMENDATIONS);

  const tabs = ["전체", "가까운 곳", "새로운 동네", "인기 스팟"];

  const toggleBookmark = (id: string) => {
    setSpots(spots.map((spot) => (spot.id === id ? { ...spot, bookmarked: !spot.bookmarked } : spot)));
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white z-20">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="text-black">
            <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
          </button>
          <div className="flex-1">
            <h2 className="text-black">AI 추천</h2>
            <p className="text-gray-600 text-xs">내 배지 기록을 바탕으로 골라봤어요</p>
          </div>
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("map")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "map" ? "bg-white text-black shadow-sm" : "text-gray-500"
              }`}
            >
              <Map className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list" ? "bg-white text-black shadow-sm" : "text-gray-500"
              }`}
            >
              <List className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Tabs - only show in list view */}
        {viewMode === "list" && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm transition-all ${
                  activeTab === tab
                    ? "bg-black text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map View */}
      {viewMode === "map" && (
        <>
          <div className="flex-1 relative bg-gray-50">
            {/* Map background - Seoul map photo */}
            <div className="absolute inset-0">
              <ImageWithFallback
                src="https://images.unsplash.com/flagged/photo-1580051720305-a944536881fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTZW91bCUyMG1hcCUyMGFlcmlhbHxlbnwxfHx8fDE3NjMwMzgyNjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Seoul map"
                className="w-full h-full object-cover opacity-30"
              />
            </div>

            {/* Legend */}
            <div className="absolute top-4 right-4 bg-white border border-gray-200 rounded-xl p-3 text-xs z-10 space-y-2 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#FF6B35] rounded-full" />
                <span className="text-black">AI 추천</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full" />
                <span className="text-gray-600">방문 완료</span>
              </div>
            </div>

            {/* Pins on map */}
            {RECOMMENDATIONS.map((spot) => (
              <button
                key={spot.id}
                onClick={() => setSelectedSpot(spot)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10"
                style={{ top: spot.position.top, left: spot.position.left }}
              >
                {spot.isNew ? (
                  <div className="relative">
                    <div
                      className={`w-12 h-12 ${spot.color} rounded-full shadow-sm transition-all duration-200 group-hover:scale-110 flex items-center justify-center`}
                    >
                      <Star className="w-6 h-6 text-white" fill="white" strokeWidth={1.5} />
                    </div>
                  </div>
                ) : (
                  <div className={`w-8 h-8 ${spot.color} rounded-full opacity-50 flex items-center justify-center`}>
                    <MapPin className="w-4 h-4 text-gray-600" fill="currentColor" strokeWidth={1.5} />
                  </div>
                )}
              </button>
            ))}

            {/* Selected spot popup */}
            {selectedSpot && selectedSpot.isNew && (
              <div className="absolute bottom-24 left-4 right-4 bg-white rounded-2xl p-4 shadow-lg border border-gray-200 z-20">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-12 h-12 ${selectedSpot.color} rounded-xl flex-shrink-0 flex items-center justify-center`}>
                    <Star className="w-6 h-6 text-white" fill="white" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-black mb-1">{selectedSpot.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{selectedSpot.location}</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedSpot.tags.map((tag) => (
                        <span key={tag} className="text-xs text-gray-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 h-10 bg-black hover:bg-gray-800 text-white rounded-xl text-sm">
                    자세히 보기
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 px-4 bg-white border-gray-300 text-black hover:bg-gray-50 rounded-xl"
                  >
                    <Navigation className="w-4 h-4" strokeWidth={1.5} />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom sheet with list */}
          <div className="bg-white border-t border-gray-200 h-48">
            <div className="w-full py-3 flex items-center justify-center">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>
            <div className="px-6 pb-3 flex items-center justify-between mb-3">
              <h3 className="text-black">AI 추천 장소</h3>
              <span className="text-gray-600 text-sm">
                {RECOMMENDATIONS.filter((r) => r.isNew).length}개
              </span>
            </div>
            <div className="px-6 pb-6 space-y-2 overflow-y-auto max-h-32">
              {RECOMMENDATIONS.filter((r) => r.isNew).map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => setSelectedSpot(spot)}
                  className="w-full bg-gray-50 rounded-xl p-3 flex items-center gap-3 hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <div className={`w-10 h-10 ${spot.color} rounded-lg flex-shrink-0`} />
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-black text-sm truncate">{spot.name}</p>
                    <p className="text-gray-600 text-xs">{spot.location}</p>
                  </div>
                  <Star className="w-4 h-4 text-[#FF6B35]" strokeWidth={1.5} />
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 pb-24">
          {spots.filter((s) => s.isNew).map((spot) => (
            <div
              key={spot.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all"
            >
              {/* Image */}
              <div className="relative h-48">
                <ImageWithFallback src={spot.image} alt={spot.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <button
                  onClick={() => toggleBookmark(spot.id)}
                  className="absolute top-3 right-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <Bookmark
                    className={`w-5 h-5 ${spot.bookmarked ? "text-[#FF6B35] fill-[#FF6B35]" : "text-black"}`}
                    strokeWidth={1.5}
                  />
                </button>
                <div className="absolute top-3 left-3 bg-black px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 text-white" fill="white" strokeWidth={1.5} />
                  <span className="text-white text-xs">AI 추천</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-black text-lg mb-1">{spot.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{spot.location}</p>
                <p className="text-gray-700 text-sm mb-3">{spot.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {spot.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex-1 h-10 bg-black hover:bg-gray-800 text-white rounded-xl">
                    지도에서 보기
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toggleBookmark(spot.id)}
                    className={`h-10 px-4 rounded-xl ${
                      spot.bookmarked
                        ? "bg-[#FF6B35]/10 border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35]/20"
                        : "bg-white border-gray-300 text-black hover:bg-gray-50"
                    }`}
                  >
                    {spot.bookmarked ? "저장됨" : "가보고 싶어요"}
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Load more */}
          <Button
            variant="outline"
            className="w-full h-12 bg-white border-gray-300 text-black hover:bg-gray-50 rounded-xl"
          >
            추천 더 불러오기
          </Button>
        </div>
      )}
    </div>
  );
}