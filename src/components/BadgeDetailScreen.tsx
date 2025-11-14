import { ArrowLeft, Share2, MapPin, Calendar, Tag } from "lucide-react";
import { Button } from "./ui/button";

interface BadgeDetailScreenProps {
  onBack: () => void;
}

export function BadgeDetailScreen({ onBack }: BadgeDetailScreenProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 bg-white">
        <button onClick={onBack} className="text-black">
          <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
        </button>
        <span className="text-black">배지 상세</span>
        <button className="text-black">
          <Share2 className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {/* Badge card */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-64 h-64 bg-[#FF6B35] rounded-3xl shadow-sm flex items-center justify-center">
              <div className="text-center text-white">
                <MapPin className="w-24 h-24 mx-auto mb-4" fill="white" strokeWidth={1.5} />
                <p className="text-xl">남산 서울타워</p>
              </div>
            </div>
          </div>
        </div>

        {/* Badge information */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-5">
          {/* Location name */}
          <div>
            <h2 className="text-3xl text-black mb-1">
              남산 서울타워
            </h2>
          </div>

          {/* Location info */}
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
            <div>
              <p className="text-gray-600 text-sm mb-0.5">위치</p>
              <p className="text-black">서울시 용산구 남산동</p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
            <div>
              <p className="text-gray-600 text-sm mb-0.5">방문일</p>
              <p className="text-black">2024년 11월 10일</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-start gap-3">
            <Tag className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
            <div className="flex-1">
              <p className="text-gray-600 text-sm mb-2">키워드</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm border border-gray-300">
                  #야경
                </span>
                <span className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm border border-gray-300">
                  #랜드마크
                </span>
                <span className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm border border-gray-300">
                  #데이트
                </span>
              </div>
            </div>
          </div>

          {/* User memo */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm mb-2">나의 기록</p>
            <p className="text-black leading-relaxed">
              서울에서 가장 멋진 야경을 볼 수 있는 곳! 저녁 노을이 질 때 방문하니 정말 환상적이었다. 다음엔 밤에 와봐야지.
            </p>
          </div>
        </div>

        {/* Mini map */}
        <div className="mt-6 bg-gray-50 rounded-2xl p-4 border border-gray-200">
          <p className="text-black text-sm mb-3">지도에서 보기</p>
          <div className="h-32 bg-white border border-gray-200 rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full" viewBox="0 0 300 150">
                <path
                  d="M 50 50 Q 100 30 150 50 T 250 50 L 250 120 Q 150 140 100 120 T 50 120 Z"
                  fill="#000000"
                />
              </svg>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-10 h-10 bg-[#FF6B35] rounded-full shadow-sm flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" fill="white" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-6 pb-10 pt-4 border-t border-gray-100 space-y-3">
        <Button className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-full">
          <Share2 className="w-4 h-4 mr-2" strokeWidth={1.5} />
          SNS에 공유하기
        </Button>
      </div>
    </div>
  );
}