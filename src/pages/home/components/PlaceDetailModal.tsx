import { ArrowLeft, Share2, MapPin, Phone, Clock, Navigation, Bus, Info, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MapLocation } from "@/types/location";

interface Badge {
  id: number;
  name: string;
  location: { lat: number; lng: number };
  date: string;
  color: string;
  emoji: string;
  tags: string[];
}

interface PlaceDetailModalProps {
  badge: Badge | null;
  location: MapLocation | null;
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
  theme: "light" | "dark";
}

export function PlaceDetailModal({ badge, location, isOpen, onClose, onVerify, theme }: PlaceDetailModalProps) {
  if (!isOpen || !badge || !location) return null;

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
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between border-b flex-shrink-0 ${
          theme === "dark" ? "border-slate-800" : "border-gray-200"
        }`}>
        <button onClick={onClose} className={theme === "dark" ? "text-white" : "text-black"}>
          <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
        </button>
        <span className={theme === "dark" ? "text-white" : "text-black"}>장소 상세</span>
        <button className={theme === "dark" ? "text-white" : "text-black"}>
          <Share2 className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8" style={{ minHeight: 0 }}>
        {/* Badge image */}
        <div className="mb-8 flex justify-center">
          <div className="relative drop-shadow-lg">
            <div className={`${
              badge.color === 'green' ? 'bg-green-400' :
              badge.color === 'purple' ? 'bg-purple-400' :
              'bg-orange-400'
            } w-40 h-40 rounded-3xl border-2 border-white/50 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.3)] flex items-center justify-center`}>
              <span className="text-7xl filter drop-shadow-sm">{badge.emoji}</span>
            </div>
          </div>
        </div>

          {/* Place information */}
          <div className={`rounded-2xl p-6 border space-y-5 ${
            theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-gray-50 border-gray-200"
          }`}>
          {/* Place name */}
          <div>
            <h2 className={`text-3xl mb-1 ${
              theme === "dark" ? "text-white" : "text-black"
            }`}>
              {badge.name}
            </h2>
          </div>

          {/* Description */}
          <div>
            <p className={`text-sm mb-2 ${
              theme === "dark" ? "text-slate-400" : "text-gray-600"
            }`}>상세설명</p>
            <p className={theme === "dark" ? "text-white leading-relaxed" : "text-black leading-relaxed"}>
              {location.description || location.contsName || "서울의 아름다운 장소"}
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
                {location.address || "서울시"}
              </p>
            </div>
          </div>

          {/* Phone */}
          {location.tel && (
            <div className="flex items-start gap-3">
              <Phone className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                theme === "dark" ? "text-slate-400" : "text-gray-600"
              }`} strokeWidth={1.5} />
              <div>
                <p className={`text-sm mb-0.5 ${
                  theme === "dark" ? "text-slate-400" : "text-gray-600"
                }`}>전화번호</p>
                <p className={theme === "dark" ? "text-white" : "text-black"}>
                  {location.tel}
                </p>
              </div>
            </div>
          )}

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
                {location.type === 'night_view' && "24시간 (야경 추천 일몰 후)"}
                {location.type === 'path' && "24시간 (추천 오전 9시 ~ 오후 6시)"}
                {location.type === 'festival' && "축제 기간에 따라 상이"}
              </p>
            </div>
          </div>

          {/* Theme Name (카테고리) */}
          {location.themeName && (
            <div className="flex items-start gap-3">
              <Navigation className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                theme === "dark" ? "text-slate-400" : "text-gray-600"
              }`} strokeWidth={1.5} />
              <div>
                <p className={`text-sm mb-0.5 ${
                  theme === "dark" ? "text-slate-400" : "text-gray-600"
                }`}>테마</p>
                <p className={theme === "dark" ? "text-white" : "text-black"}>
                  {location.themeName}
                </p>
              </div>
            </div>
          )}

          {/* Date (날짜 정보가 있는 경우) */}
          {location.date && (
            <div className="flex items-start gap-3">
              <Bus className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                theme === "dark" ? "text-slate-400" : "text-gray-600"
              }`} strokeWidth={1.5} />
              <div>
                <p className={`text-sm mb-0.5 ${
                  theme === "dark" ? "text-slate-400" : "text-gray-600"
                }`}>기간</p>
                <p className={theme === "dark" ? "text-white" : "text-black"}>
                  {location.date}
                </p>
              </div>
            </div>
          )}

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
                {badge.tags.map((tag) => (
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
        <div className={`px-6 pb-10 pt-4 border-t flex-shrink-0 ${
          theme === "dark" ? "border-slate-800" : "border-gray-100"
        }`}>
          <Button
            onClick={onVerify}
            className="w-full h-12 rounded-full bg-[#FF6B35] hover:bg-[#E55A2B] text-white"
          >
            인증하기
          </Button>
        </div>
      </div>
    </>
  );
}
