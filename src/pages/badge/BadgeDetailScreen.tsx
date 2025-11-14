import { ArrowLeft, Share2, MapPin, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Badge {
  id: number;
  name: string;
  location: { lat: number; lng: number };
  date: string;
  color: string;
  emoji: string;
  tags: string[];
}

interface BadgeDetailScreenProps {
  badge: Badge | null;
  isOpen: boolean;
  onClose: () => void;
  theme: "light" | "dark";
}

export function BadgeDetailScreen({ badge, isOpen, onClose, theme }: BadgeDetailScreenProps) {
  if (!isOpen || !badge) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        style={{ zIndex: 9998 }}
        onClick={onClose}
      />

      {/* Modal Sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 rounded-t-3xl shadow-2xl transition-transform duration-300 flex flex-col ${
          theme === "dark" ? "bg-slate-900" : "bg-white"
        }`}
        style={{ zIndex: 9999, maxHeight: '85vh' }}
      >
        {/* Drag handle */}
        <div className="w-full py-3 flex items-center justify-center flex-shrink-0">
          <div className={`w-12 h-1 rounded-full ${
            theme === "dark" ? "bg-slate-600" : "bg-gray-300"
          }`} />
        </div>

        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between border-b flex-shrink-0 ${
          theme === "dark" ? "border-slate-800" : "border-gray-200"
        }`}>
          <button onClick={onClose} className={theme === "dark" ? "text-white" : "text-black"}>
            <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
          </button>
          <span className={theme === "dark" ? "text-white" : "text-black"}>배지 상세</span>
          <button className={theme === "dark" ? "text-white" : "text-black"}>
            <Share2 className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8" style={{ minHeight: 0 }}>
          {/* Badge card */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className={`w-64 h-64 ${badge.color} rounded-3xl shadow-sm flex items-center justify-center border-2 border-white/50 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.3)]`}>
                <div className="text-center">
                  <span className="text-8xl filter drop-shadow-lg">{badge.emoji}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Badge information */}
          <div className={`rounded-2xl p-6 border space-y-5 ${
            theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-gray-50 border-gray-200"
          }`}>
            {/* Location name */}
            <div>
              <h2 className={`text-3xl mb-1 ${theme === "dark" ? "text-white" : "text-black"}`}>
                {badge.name}
              </h2>
            </div>

            {/* Location info */}
            <div className="flex items-start gap-3">
              <MapPin className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                theme === "dark" ? "text-slate-400" : "text-gray-600"
              }`} strokeWidth={1.5} />
              <div>
                <p className={`text-sm mb-0.5 ${
                  theme === "dark" ? "text-slate-400" : "text-gray-600"
                }`}>위치</p>
                <p className={theme === "dark" ? "text-white" : "text-black"}>서울시 용산구 남산동</p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-start gap-3">
              <Calendar className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                theme === "dark" ? "text-slate-400" : "text-gray-600"
              }`} strokeWidth={1.5} />
              <div>
                <p className={`text-sm mb-0.5 ${
                  theme === "dark" ? "text-slate-400" : "text-gray-600"
                }`}>방문일</p>
                <p className={theme === "dark" ? "text-white" : "text-black"}>{badge.date}</p>
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
                  {badge.tags.map((tag) => (
                    <span key={tag} className={`px-3 py-1 rounded-full text-sm border ${
                      theme === "dark"
                        ? "bg-slate-700 text-slate-300 border-slate-600"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* User memo */}
            <div className={`pt-4 border-t ${
              theme === "dark" ? "border-slate-700" : "border-gray-200"
            }`}>
              <p className={`text-sm mb-2 ${
                theme === "dark" ? "text-slate-400" : "text-gray-600"
              }`}>나의 기록</p>
              <p className={`leading-relaxed ${
                theme === "dark" ? "text-white" : "text-black"
              }`}>
                서울에서 가장 멋진 야경을 볼 수 있는 곳! 저녁 노을이 질 때 방문하니 정말 환상적이었다. 다음엔 밤에 와봐야지.
              </p>
            </div>
          </div>

          {/* Mini map */}
          <div className={`mt-6 rounded-2xl p-4 border ${
            theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-gray-50 border-gray-200"
          }`}>
            <p className={`text-sm mb-3 ${theme === "dark" ? "text-white" : "text-black"}`}>지도에서 보기</p>
            <div className={`h-32 border rounded-xl relative overflow-hidden ${
              theme === "dark" ? "bg-slate-700 border-slate-600" : "bg-white border-gray-200"
            }`}>
              <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full" viewBox="0 0 300 150">
                  <path
                    d="M 50 50 Q 100 30 150 50 T 250 50 L 250 120 Q 150 140 100 120 T 50 120 Z"
                    fill="#000000"
                  />
                </svg>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className={`w-10 h-10 ${badge.color} rounded-full shadow-sm flex items-center justify-center`}>
                  <span className="text-2xl">{badge.emoji}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom actions */}
        <div className={`px-6 pb-10 pt-4 border-t space-y-3 flex-shrink-0 ${
          theme === "dark" ? "border-slate-800" : "border-gray-100"
        }`}>
          <Button className={`w-full h-12 rounded-full ${
            theme === "dark"
              ? "bg-white hover:bg-gray-200 text-black"
              : "bg-black hover:bg-gray-800 text-white"
          }`}>
            <Share2 className="w-4 h-4 mr-2" strokeWidth={1.5} />
            SNS에 공유하기
          </Button>
        </div>
      </div>
    </>
  );
}
