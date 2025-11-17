import {
  MapPin,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { Header } from "@/components/common/Header";
import { Card } from "@/components/common/Card";
import { Tag } from "@/components/common/Tag";
import { StyledButton } from "@/components/common/StyledButton";
import { Textarea } from "@/components/ui/textarea";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { cn } from "@/components/ui/utils";
import { generateBadgeImage, createBadgePrompt } from "@/services/geminiImageService";

interface CreateBadgeScreenProps {
  onBack: () => void;
  onComplete: (badgeData: {
    imageUrl: string;
    description: string;
    tags: string[];
    location: string;
  }) => void;
  theme?: "light" | "dark";
}

const SUGGESTED_TAGS = [
  "#카페투어",
  "#야경",
  "#데이트",
  "#산책",
  "#뷰맛집",
  "#한강",
  "#골목산책",
];

export function CreateBadgeScreen({
  onBack,
  onComplete,
  theme = "light",
}: CreateBadgeScreenProps) {
  const [gpsVerified, setGpsVerified] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [imageGenerating, setImageGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    // Create object URL for preview
    const objectUrl = URL.createObjectURL(file);
    setUploadedImageUrl(objectUrl);
  };

  const canSubmit = gpsVerified && uploadedImageUrl && description.trim();

  const handleSubmit = async () => {
    if (!uploadedImageUrl) {
      alert("사진을 먼저 업로드해주세요!");
      return;
    }

    setImageGenerating(true);
    setGenerationProgress("업로드된 사진을 기반으로 AI 배지 생성 중...");

    try {
      const prompt = createBadgePrompt(description, selectedTags, true);
      console.log("=== AI 배지 생성 프롬프트 ===");
      console.log(prompt);
      console.log("=========================");

      const result = await generateBadgeImage({
        prompt,
        sourceImageUrl: uploadedImageUrl,
        onProgress: (message) => {
          setGenerationProgress(message);
        },
      });

      onComplete({
        imageUrl: result.dataUrl,
        description: description,
        tags: selectedTags,
        location: "서울시 마포구 합정동",
      });
    } catch (error) {
      console.error("Image generation failed:", error);
      alert("이미지 생성에 실패했습니다. 다시 시도해주세요.");
      setImageGenerating(false);
      setGenerationProgress("");
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col transition-colors",
        theme === "dark" ? "bg-[#0a0e1a]" : "bg-white"
      )}
    >
      <Header title="새 배지 만들기" onBack={onBack} theme={theme} />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Step 1: GPS Verification */}
        <Card theme={theme} className="p-5" aria-label="위치 인증 단계">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                theme === "dark"
                  ? "bg-white text-black"
                  : "bg-black text-white"
              )}
              aria-hidden="true"
            >
              01
            </div>
            <h3
              className={cn(
                "text-base font-semibold",
                theme === "dark" ? "text-white" : "text-black"
              )}
            >
              위치 인증
            </h3>
          </div>

          {!gpsVerified ? (
            <>
              <Card
                theme={theme}
                className="p-4 mb-4"
                aria-label="GPS 위치 확인"
              >
                <div className="flex items-center gap-3">
                  <MapPin
                    className={cn(
                      "w-5 h-5",
                      theme === "dark" ? "text-slate-400" : "text-gray-500"
                    )}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <div className="flex-1">
                    {gpsLoading ? (
                      <p
                        className={cn(
                          "text-sm",
                          theme === "dark" ? "text-white" : "text-black"
                        )}
                      >
                        GPS로 현재 위치 확인중...
                      </p>
                    ) : (
                      <p
                        className={cn(
                          "text-sm",
                          theme === "dark"
                            ? "text-slate-400"
                            : "text-gray-600"
                        )}
                      >
                        현재 위치를 확인해주세요
                      </p>
                    )}
                  </div>
                  {gpsLoading && (
                    <Loader2
                      className={cn(
                        "w-5 h-5 animate-spin",
                        theme === "dark" ? "text-white" : "text-black"
                      )}
                      strokeWidth={1.5}
                      aria-label="로딩 중"
                    />
                  )}
                </div>
              </Card>
              <StyledButton
                onClick={handleGPSVerify}
                disabled={gpsLoading}
                variant="secondary"
                theme={theme}
                fullWidth
              >
                위치 인증하기
              </StyledButton>
            </>
          ) : (
            <Card
              theme={theme}
              className="p-4 flex items-center gap-3"
              aria-label="위치 인증 완료"
            >
              <CheckCircle2
                className="w-5 h-5 text-[#FF6B35]"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <div className="flex-1">
                <p
                  className={cn(
                    "text-sm font-medium mb-1",
                    theme === "dark" ? "text-white" : "text-black"
                  )}
                >
                  위치 인증 완료 ✓
                </p>
                <p
                  className={cn(
                    "text-xs",
                    theme === "dark" ? "text-slate-400" : "text-gray-600"
                  )}
                >
                  서울시 마포구 합정동
                </p>
              </div>
            </Card>
          )}
        </Card>

        {/* Step 2: Photo Upload */}
        <Card theme={theme} className="p-5" aria-label="사진 업로드 단계">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                theme === "dark"
                  ? "bg-white text-black"
                  : "bg-black text-white"
              )}
              aria-hidden="true"
            >
              02
            </div>
            <h3
              className={cn(
                "text-base font-semibold",
                theme === "dark" ? "text-white" : "text-black"
              )}
            >
              사진 업로드
            </h3>
          </div>

          <div className="space-y-3">
              <div
                className={cn(
                  "aspect-[4/3] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 relative",
                  theme === "dark"
                    ? "bg-slate-800/50 border-slate-600"
                    : "bg-white border-gray-300"
                )}
                aria-label="사진 업로드 영역"
              >
                {uploadedImageUrl ? (
                  <>
                    <ImageWithFallback
                      src={uploadedImageUrl}
                      alt="업로드된 사진"
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <button
                      onClick={() => {
                        setUploadedImageUrl(null);
                      }}
                      className={cn(
                        "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md transition-all duration-200",
                        "outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2",
                        theme === "dark"
                          ? "bg-slate-800 text-white hover:bg-slate-700"
                          : "bg-white text-black hover:bg-gray-100"
                      )}
                      aria-label="사진 삭제"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <>
                    <ImageIcon
                      className={cn(
                        "w-12 h-12",
                        theme === "dark" ? "text-slate-500" : "text-gray-400"
                      )}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <p
                      className={cn(
                        "text-sm",
                        theme === "dark" ? "text-slate-400" : "text-gray-500"
                      )}
                    >
                      사진을 추가해주세요
                    </p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                disabled={imageGenerating}
                id="file-upload-input"
              />
              <StyledButton
                onClick={() => document.getElementById('file-upload-input')?.click()}
                variant="secondary"
                theme={theme}
                fullWidth
                disabled={imageGenerating}
                aria-label="앨범에서 선택"
              >
                <ImageIcon className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                앨범에서 선택
              </StyledButton>
            </div>
        </Card>

        {/* Step 3: Description & Keywords */}
        <Card
          theme={theme}
          className="p-5"
          aria-label="설명 및 키워드 입력 단계"
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                theme === "dark"
                  ? "bg-white text-black"
                  : "bg-black text-white"
              )}
              aria-hidden="true"
            >
              03
            </div>
            <h3
              className={cn(
                "text-base font-semibold",
                theme === "dark" ? "text-white" : "text-black"
              )}
            >
              설명 & 키워드
            </h3>
          </div>

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="이 순간을 한 줄로 기록해보세요."
            className={cn(
              "mb-4 rounded-xl resize-none outline-none transition-all duration-200",
              "focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2",
              theme === "dark"
                ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-white focus:bg-slate-900"
                : "bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-black"
            )}
            rows={3}
            aria-label="배지 설명 입력"
          />

          <div>
            <p
              className={cn(
                "text-sm font-medium mb-3",
                theme === "dark" ? "text-slate-400" : "text-gray-600"
              )}
            >
              추천 키워드
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <Tag
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    theme={theme}
                    selected={isSelected}
                    aria-pressed={isSelected}
                    aria-label={`${tag} 키워드`}
                  >
                    {tag}
                  </Tag>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom button */}
      <div
        className={cn(
          "px-6 pb-10 pt-4 border-t",
          theme === "dark" ? "border-slate-800" : "border-gray-100"
        )}
      >
        <StyledButton
          onClick={handleSubmit}
          disabled={!canSubmit || imageGenerating}
          variant="primary"
          fullWidth
          className="h-12"
        >
          {imageGenerating ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {generationProgress || "AI 배지 생성 중..."}
            </div>
          ) : (
            "AI 배지 생성하기"
          )}
        </StyledButton>
      </div>
    </div>
  );
}
