import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface OnboardingScreenProps {
  onComplete: (nickname: string, interests: string[]) => void;
  theme: "light" | "dark";
}

const INTEREST_TAGS = [
  "#카페투어",
  "#야경",
  "#한강",
  "#산책",
  "#전시",
  "#힙한동네",
  "#골목탐방",
  "#맛집",
  "#뷰맛집",
  "#서울숲",
  "#한옥",
  "#루프탑",
  "#데이트",
  "#사진명소",
  "#야시장",
];

export function OnboardingScreen({ onComplete, theme }: OnboardingScreenProps) {
  const [nickname, setNickname] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (tag: string) => {
    if (selectedInterests.includes(tag)) {
      setSelectedInterests(selectedInterests.filter((t) => t !== tag));
    } else {
      setSelectedInterests([...selectedInterests, tag]);
    }
  };

  const handleComplete = () => {
    if (nickname.trim()) {
      onComplete(nickname, selectedInterests);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === "dark" ? "bg-[#0a0e1a]" : "bg-white"
      }`}
    >
      {/* Progress indicator */}
      <div className="px-8 pt-8">
        <div className="flex gap-2">
          <div className={`h-0.5 flex-1 rounded-full ${
            theme === "dark" ? "bg-white" : "bg-black"
          }`} />
          <div className={`h-0.5 flex-1 rounded-full ${
            theme === "dark" ? "bg-slate-700" : "bg-gray-200"
          }`} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-8 py-12 overflow-y-auto">
        {/* Nickname section */}
        <div className="mb-12">
          <h2 className={`text-3xl mb-2 ${
            theme === "dark" ? "text-white" : "text-black"
          }`}>
            닉네임을 정해주세요
          </h2>
          <p className={`text-sm mb-8 ${
            theme === "dark" ? "text-slate-400" : "text-gray-600"
          }`}>
            서울을 수집하는 나만의 이름이에요
          </p>
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="예: 서울수집가"
            className={`h-12 rounded-xl focus:ring-0 ${
              theme === "dark"
                ? "bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-white"
                : "bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-black"
            }`}
            maxLength={12}
          />
          <p className={`text-xs mt-2 ${
            theme === "dark" ? "text-slate-500" : "text-gray-500"
          }`}>
            {nickname.length}/12
          </p>
        </div>

        {/* Interest tags section */}
        <div>
          <h2 className={`text-3xl mb-2 ${
            theme === "dark" ? "text-white" : "text-black"
          }`}>
            관심사를 선택해주세요
          </h2>
          <p className={`text-sm mb-8 ${
            theme === "dark" ? "text-slate-400" : "text-gray-600"
          }`}>
            AI가 맞춤 장소를 추천해드려요
          </p>
          <div className="flex flex-wrap gap-2">
            {INTEREST_TAGS.map((tag) => {
              const isSelected = selectedInterests.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleInterest(tag)}
                  className={`px-4 py-2.5 rounded-full text-sm transition-all duration-200 ${
                    isSelected
                      ? "bg-[#FF6B35] text-white"
                      : theme === "dark"
                      ? "bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
          {selectedInterests.length > 0 && (
            <p className={`text-xs mt-4 ${
              theme === "dark" ? "text-slate-400" : "text-gray-600"
            }`}>
              {selectedInterests.length}개 선택됨
            </p>
          )}
        </div>
      </div>

      {/* Bottom button */}
      <div className={`px-8 pb-10 pt-4 border-t ${
        theme === "dark" ? "border-slate-800" : "border-gray-100"
      }`}>
        <Button
          onClick={handleComplete}
          disabled={!nickname.trim()}
          className={`w-full h-12 rounded-full shadow-sm disabled:opacity-30 disabled:cursor-not-allowed ${
            theme === "dark"
              ? "bg-white hover:bg-gray-100 text-black"
              : "bg-black hover:bg-gray-800 text-white"
          }`}
        >
          다음으로
        </Button>
      </div>
    </div>
  );
}