import { ArrowLeft, MapPin, Camera, Image as ImageIcon, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";

interface CreateBadgeScreenProps {
  onBack: () => void;
  onComplete: () => void;
}

const SUGGESTED_TAGS = ["#카페투어", "#야경", "#데이트", "#산책", "#뷰맛집", "#한강", "#골목산책"];

export function CreateBadgeScreen({ onBack, onComplete }: CreateBadgeScreenProps) {
  const [gpsVerified, setGpsVerified] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleGPSVerify = () => {
    setGpsLoading(true);
    setTimeout(() => {
      setGpsVerified(true);
      setGpsLoading(false);
    }, 1500);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const canSubmit = gpsVerified && photoUploaded && description.trim();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-3 border-b border-gray-200 bg-white">
        <button onClick={onBack} className="text-black">
          <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
        </button>
        <span className="text-black text-lg">새 배지 만들기</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Step 1: GPS Verification */}
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-sm">
              01
            </div>
            <h3 className="text-black">위치 인증</h3>
          </div>

          {!gpsVerified ? (
            <>
              <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
                  <div className="flex-1">
                    {gpsLoading ? (
                      <p className="text-black text-sm">GPS로 현재 위치 확인중...</p>
                    ) : (
                      <p className="text-gray-600 text-sm">현재 위치를 확인해주세요</p>
                    )}
                  </div>
                  {gpsLoading && <Loader2 className="w-5 h-5 text-black animate-spin" strokeWidth={1.5} />}
                </div>
              </div>
              <Button
                onClick={handleGPSVerify}
                disabled={gpsLoading}
                className="w-full bg-gray-900 hover:bg-black text-white rounded-xl"
              >
                위치 인증하기
              </Button>
            </>
          ) : (
            <div className="bg-white border border-gray-300 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#FF6B35]" strokeWidth={1.5} />
              <div className="flex-1">
                <p className="text-black text-sm mb-1">위치 인증 완료 ✓</p>
                <p className="text-gray-600 text-xs">서울시 마포구 합정동</p>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Photo Upload */}
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-sm">
              02
            </div>
            <h3 className="text-black">사진 업로드</h3>
          </div>

          {!photoUploaded ? (
            <div className="space-y-3">
              <div className="aspect-[4/3] bg-white rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-3">
                <ImageIcon className="w-12 h-12 text-gray-400" strokeWidth={1.5} />
                <p className="text-gray-500 text-sm">사진을 추가해주세요</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setPhotoUploaded(true)}
                  className="bg-gray-900 hover:bg-black text-white rounded-xl h-11"
                >
                  <Camera className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  사진 찍기
                </Button>
                <Button
                  onClick={() => setPhotoUploaded(true)}
                  className="bg-gray-900 hover:bg-black text-white rounded-xl h-11"
                >
                  <ImageIcon className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  앨범에서 선택
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-gray-200">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1552723690-81d6a52f37de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLb3JlYW4lMjBjYWZlJTIwYWVzdGhldGljfGVufDF8fHx8MTc2MzAzNTY0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Uploaded photo"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => setPhotoUploaded(false)}
                className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-black text-sm hover:bg-gray-100 shadow-sm"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Step 3: Description & Keywords */}
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-sm">
              03
            </div>
            <h3 className="text-black">설명 & 키워드</h3>
          </div>

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="이 순간을 한 줄로 기록해보세요."
            className="mb-4 bg-white border-gray-300 text-black placeholder:text-gray-400 rounded-xl resize-none focus:border-black focus:ring-0"
            rows={3}
          />

          <div>
            <p className="text-gray-600 text-sm mb-3">추천 키워드</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      isSelected
                        ? "bg-black text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom button */}
      <div className="px-6 pb-10 pt-4 border-t border-gray-100">
        <Button
          onClick={onComplete}
          disabled={!canSubmit}
          className="w-full h-12 bg-[#FF6B35] hover:bg-[#E55A2B] text-white rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
        >
          AI 배지 생성하기
        </Button>
      </div>
    </div>
  );
}