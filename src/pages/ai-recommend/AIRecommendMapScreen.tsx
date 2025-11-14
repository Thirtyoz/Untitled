import { ArrowLeft, MapPin, Star, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Recommendation {
  id: string;
  name: string;
  location: string;
  tags: string[];
  isNew: boolean;
  position: { top: string; left: string };
  color: string;
}

interface AIRecommendMapScreenProps {
  onBack: () => void;
}

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: "r1",
    name: "망원 한강공원",
    location: "마포구 망원동",
    tags: ["#한강", "#야경", "#산책"],
    isNew: true,
    position: { top: "45%", left: "38%" },
    color: "bg-[#FF6B35]",
  },
  {
    id: "r2",
    name: "연남동 골목",
    location: "마포구 연남동",
    tags: ["#골목탐방", "#카페투어"],
    isNew: true,
    position: { top: "40%", left: "42%" },
    color: "bg-[#FF6B35]",
  },
  {
    id: "r3",
    name: "경의선숲길",
    location: "마포구 연남동",
    tags: ["#산책", "#사진명소"],
    isNew: true,
    position: { top: "38%", left: "44%" },
    color: "bg-[#FF6B35]",
  },
  // Existing visited badges
  {
    id: "e1",
    name: "남산타워",
    location: "용산구",
    tags: [],
    isNew: false,
    position: { top: "48%", left: "52%" },
    color: "bg-gray-300",
  },
  {
    id: "e2",
    name: "성수동",
    location: "성동구",
    tags: [],
    isNew: false,
    position: { top: "42%", left: "62%" },
    color: "bg-gray-300",
  },
];

export function AIRecommendMapScreen({ onBack }: AIRecommendMapScreenProps) {
  const [selectedSpot, setSelectedSpot] = useState<Recommendation | null>(null);

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white z-20">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-black">
            <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
          </button>
          <div className="flex-1">
            <h2 className="text-black">AI 추천 스팟 지도</h2>
            <p className="text-gray-600 text-xs">내 배지를 바탕으로 새 장소를 추천해요</p>
          </div>
        </div>
      </div>

      {/* Map area */}
      <div className="flex-1 relative bg-gray-50">
        {/* Map background */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 400 600">
            <path
              d="M 100 200 Q 150 150 200 180 T 300 200 L 320 400 Q 250 450 200 420 T 100 400 Z"
              fill="none"
              stroke="#000000"
              strokeWidth="1"
            />
            <circle cx="200" cy="250" r="100" fill="none" stroke="#000000" strokeWidth="1" />
          </svg>
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
    </div>
  );
}