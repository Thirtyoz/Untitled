import { ArrowLeft, User, MapPin, Award, Settings, LogOut, Edit2, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

interface MyPageScreenProps {
  onBack: () => void;
  onLogout: () => void;
  userNickname: string;
  userInterests: string[];
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function MyPageScreen({ onBack, onLogout, userNickname, userInterests, theme, onToggleTheme }: MyPageScreenProps) {
  return (
    <div className={`min-h-screen flex flex-col ${
      theme === "dark" ? "bg-[#0a0e1a]" : "bg-white"
    }`}>
      {/* Header */}
      <div className={`px-6 py-4 flex items-center gap-3 border-b ${
        theme === "dark" 
          ? "border-slate-800 bg-[#0a0e1a]" 
          : "border-gray-200 bg-white"
      }`}>
        <button onClick={onBack} className={theme === "dark" ? "text-white" : "text-black"}>
          <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
        </button>
        <span className={theme === "dark" ? "text-white" : "text-black"}>마이페이지</span>
      </div>

      {/* Profile section */}
      <div className={`px-6 py-8 border-b ${
        theme === "dark" ? "border-slate-800" : "border-gray-100"
      }`}>
        <div className="flex items-start gap-4 mb-6">
          {/* Avatar */}
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
            theme === "dark" ? "bg-white" : "bg-black"
          }`}>
            <User className={`w-10 h-10 ${theme === "dark" ? "text-black" : "text-white"}`} strokeWidth={1.5} />
          </div>

          {/* User info */}
          <div className="flex-1">
            <h2 className={`text-2xl mb-1 ${theme === "dark" ? "text-white" : "text-black"}`}>{userNickname}</h2>
            <p className={`text-sm mb-3 ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>서울을 수집하는 중입니다.</p>
            <button className={`text-sm flex items-center gap-1 transition-colors ${
              theme === "dark" 
                ? "text-white hover:text-slate-300" 
                : "text-black hover:text-gray-600"
            }`}>
              <Edit2 className="w-3 h-3" strokeWidth={1.5} />
              프로필 수정
            </button>
          </div>
        </div>

        {/* Interest tags */}
        <div>
          <p className={`text-sm mb-3 ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>관심사</p>
          <div className="flex flex-wrap gap-2">
            {userInterests.map((tag) => (
              <span
                key={tag}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  theme === "dark"
                    ? "bg-slate-800 text-slate-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className={`px-6 py-6 border-b ${
        theme === "dark" ? "border-slate-800" : "border-gray-100"
      }`}>
        <h3 className={`mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}>나의 서울 컬렉션</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Stat card 1 */}
          <div className={`rounded-2xl p-4 border ${
            theme === "dark"
              ? "bg-slate-900 border-slate-800"
              : "bg-gray-50 border-gray-200"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Award className={`w-5 h-5 ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`} strokeWidth={1.5} />
              <span className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>모은 배지</span>
            </div>
            <p className={`text-2xl ${theme === "dark" ? "text-white" : "text-black"}`}>12개</p>
          </div>

          {/* Stat card 2 */}
          <div className={`rounded-2xl p-4 border ${
            theme === "dark"
              ? "bg-slate-900 border-slate-800"
              : "bg-gray-50 border-gray-200"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className={`w-5 h-5 ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`} strokeWidth={1.5} />
              <span className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>방문한 구</span>
            </div>
            <p className={`text-2xl ${theme === "dark" ? "text-white" : "text-black"}`}>8곳</p>
          </div>
        </div>
      </div>

      {/* Account info section */}
      <div className={`px-6 py-6 border-b ${
        theme === "dark" ? "border-slate-800" : "border-gray-100"
      }`}>
        <h3 className={`mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}>계정 정보</h3>
        <div className={`rounded-2xl p-4 border ${
          theme === "dark"
            ? "bg-slate-900 border-slate-800"
            : "bg-gray-50 border-gray-200"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded flex items-center justify-center border ${
              theme === "dark"
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-gray-200"
            }`}>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs mb-0.5 ${theme === "dark" ? "text-slate-500" : "text-gray-600"}`}>Google 계정</p>
              <p className={`text-sm truncate ${theme === "dark" ? "text-white" : "text-black"}`}>pinseoul@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings section */}
      <div className="flex-1 px-6 py-6">
        <h3 className={`mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}>설정</h3>
        <div className="space-y-3">
          {/* Theme toggle */}
          <button 
            onClick={onToggleTheme}
            className={`w-full rounded-xl p-4 flex items-center justify-between transition-colors border ${
              theme === "dark"
                ? "bg-slate-900 hover:bg-slate-800 border-slate-800"
                : "bg-white hover:bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
              ) : (
                <Sun className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
              )}
              <span className={theme === "dark" ? "text-white" : "text-black"}>
                {theme === "dark" ? "다크 모드" : "라이트 모드"}
              </span>
            </div>
            <div className={`w-11 h-6 rounded-full relative transition-colors ${
              theme === "dark" ? "bg-[#FF6B35]" : "bg-gray-300"
            }`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                theme === "dark" ? "translate-x-6" : "translate-x-1"
              }`} />
            </div>
          </button>

          {/* Settings items */}
          <button className={`w-full rounded-xl p-4 flex items-center justify-between transition-colors border ${
            theme === "dark"
              ? "bg-slate-900 hover:bg-slate-800 border-slate-800"
              : "bg-white hover:bg-gray-50 border-gray-200"
          }`}>
            <div className="flex items-center gap-3">
              <Edit2 className={`w-5 h-5 ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`} strokeWidth={1.5} />
              <span className={theme === "dark" ? "text-white" : "text-black"}>관심사 편집</span>
            </div>
            <span className={theme === "dark" ? "text-slate-600" : "text-gray-400"}>›</span>
          </button>

          <button className={`w-full rounded-xl p-4 flex items-center justify-between transition-colors border ${
            theme === "dark"
              ? "bg-slate-900 hover:bg-slate-800 border-slate-800"
              : "bg-white hover:bg-gray-50 border-gray-200"
          }`}>
            <div className="flex items-center gap-3">
              <Settings className={`w-5 h-5 ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`} strokeWidth={1.5} />
              <span className={theme === "dark" ? "text-white" : "text-black"}>계정 관리</span>
            </div>
            <span className={theme === "dark" ? "text-slate-600" : "text-gray-400"}>›</span>
          </button>
        </div>
      </div>

      {/* Logout button */}
      <div className={`px-6 pb-10 pt-4 border-t ${
        theme === "dark" ? "border-slate-800" : "border-gray-100"
      }`}>
        <Button
          onClick={onLogout}
          variant="outline"
          className={`w-full h-12 rounded-xl ${
            theme === "dark"
              ? "bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
              : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-black"
          }`}
        >
          <LogOut className="w-4 h-4 mr-2" strokeWidth={1.5} />
          로그아웃
        </Button>
      </div>
    </div>
  );
}