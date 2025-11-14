import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Home, Sparkles, TrendingUp } from "lucide-react";

export type ThemeMode = "light" | "dark";

function BottomNav({ theme }: { theme: ThemeMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const showBottomNav = ["/", "/ai-recommend", "/ranking", "/mypage"].includes(currentPath);

  if (!showBottomNav) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 border-t z-50 ${
        theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
      }`}
    >
      <div className="grid grid-cols-4 h-16">
        <button
          onClick={() => navigate("/")}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            currentPath === "/"
              ? theme === "dark"
                ? "text-white"
                : "text-black"
              : theme === "dark"
                ? "text-slate-400 hover:text-slate-300"
                : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Home className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-xs">홈</span>
        </button>

        <button
          onClick={() => navigate("/ai-recommend")}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            currentPath === "/ai-recommend"
              ? theme === "dark"
                ? "text-white"
                : "text-black"
              : theme === "dark"
                ? "text-slate-400 hover:text-slate-300"
                : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Sparkles className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-xs">AI 추천</span>
        </button>

        <button
          onClick={() => navigate("/ranking")}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            currentPath === "/ranking"
              ? theme === "dark"
                ? "text-white"
                : "text-black"
              : theme === "dark"
                ? "text-slate-400 hover:text-slate-300"
                : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <TrendingUp className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-xs">랭킹</span>
        </button>

        <button
          onClick={() => navigate("/mypage")}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            currentPath === "/mypage"
              ? theme === "dark"
                ? "text-white"
                : "text-black"
              : theme === "dark"
                ? "text-slate-400 hover:text-slate-300"
                : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Menu className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-xs">더보기</span>
        </button>
      </div>
    </div>
  );
}

export function AppLayout({ children, theme }: { children: ReactNode; theme: ThemeMode }) {
  return (
    <div className="relative min-h-screen pb-16">
      <div className="pb-16">{children}</div>
      <BottomNav theme={theme} />
    </div>
  );
}
