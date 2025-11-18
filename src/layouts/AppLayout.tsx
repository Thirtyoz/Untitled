import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Home, Grid3x3, TrendingUp } from "lucide-react";

export type ThemeMode = "light" | "dark";

function BottomNav({ theme }: { theme: ThemeMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const showBottomNav = ["/", "/collection", "/ranking", "/mypage"].includes(currentPath);

  if (!showBottomNav) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 border-t z-50 ${
        theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
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
          onClick={() => navigate("/collection")}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            currentPath === "/collection"
              ? theme === "dark"
                ? "text-white"
                : "text-black"
              : theme === "dark"
                ? "text-slate-400 hover:text-slate-300"
                : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Grid3x3 className="w-5 h-5" strokeWidth={1.5} />
          <span className="text-xs">컬렉션</span>
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
  const contentPaddingBottom = "calc(4.5rem + env(safe-area-inset-bottom, 0px))";

  return (
    <div className="relative min-h-screen">
      <main className="min-h-screen" style={{ paddingBottom: contentPaddingBottom }}>
        {children}
      </main>
      <BottomNav theme={theme} />
    </div>
  );
}
