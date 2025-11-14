import { useState, useEffect } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { HomeMapScreen } from "./components/HomeMapScreen";
import { CreateBadgeScreen } from "./components/CreateBadgeScreen";
import { BadgeResultScreen } from "./components/BadgeResultScreen";
import { AIRecommendScreen } from "./components/AIRecommendScreen";
import { MyPageScreen } from "./components/MyPageScreen";
import { RankingScreen } from "./components/RankingScreen";
import { Menu, Home, Sparkles, TrendingUp } from "lucide-react";
import { supabase } from "./supabaseClient";
import { useAppStore } from "./store/useAppStore";

type Screen =
  | "login"
  | "onboarding"
  | "home"
  | "create-badge"
  | "badge-result"
  | "ai-recommend"
  | "mypage"
  | "ranking";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [userNickname, setUserNickname] = useState("서울수집가");
  const [userInterests, setUserInterests] = useState<string[]>(["#카페투어", "#야경", "#한강"]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { setUser } = useAppStore();

  // Check for existing session on mount and handle OAuth callback
  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);

        // Check if onboarding is completed in localStorage
        const onboardingData = localStorage.getItem("onboarding_completed");

        if (onboardingData) {
          // Onboarding already completed, load data and go to home
          try {
            const { nickname, interests } = JSON.parse(onboardingData);
            setUserNickname(nickname);
            setUserInterests(interests);
            setCurrentScreen("home");
          } catch (e) {
            // If parsing fails, show onboarding again
            setCurrentScreen("onboarding");
          }
        } else {
          // First time login, show onboarding
          if (currentScreen === "login") {
            setCurrentScreen("onboarding");
          }
        }
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);

        // Check if onboarding is completed
        const onboardingData = localStorage.getItem("onboarding_completed");

        if (onboardingData) {
          // Already completed onboarding
          try {
            const { nickname, interests } = JSON.parse(onboardingData);
            setUserNickname(nickname);
            setUserInterests(interests);
            setCurrentScreen("home");
          } catch (e) {
            setCurrentScreen("onboarding");
          }
        } else {
          // When user logs in for the first time, go to onboarding
          if (currentScreen === "login") {
            setCurrentScreen("onboarding");
          }
        }
      } else {
        setUser(null);
        setCurrentScreen("login");
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = () => {
    setCurrentScreen("onboarding");
  };

  const handleOnboardingComplete = (nickname: string, interests: string[]) => {
    setUserNickname(nickname);
    setUserInterests(interests);

    // Save to localStorage to prevent showing onboarding again
    localStorage.setItem(
      "onboarding_completed",
      JSON.stringify({ nickname, interests })
    );

    setCurrentScreen("home");
  };

  const handleBadgeCreated = () => {
    setCurrentScreen("badge-result");
  };

  const handleBadgeSaved = () => {
    setCurrentScreen("home");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    // Clear onboarding data on logout
    localStorage.removeItem("onboarding_completed");
    setCurrentScreen("login");
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "login":
        return <LoginScreen onLogin={handleLogin} theme={theme} />;
      case "onboarding":
        return <OnboardingScreen onComplete={handleOnboardingComplete} theme={theme} />;
      case "home":
        return <HomeMapScreen onNavigate={setCurrentScreen} userNickname={userNickname} theme={theme} />;
      case "create-badge":
        return <CreateBadgeScreen onBack={() => setCurrentScreen("home")} onComplete={handleBadgeCreated} theme={theme} />;
      case "badge-result":
        return (
          <BadgeResultScreen onSave={handleBadgeSaved} onRegenerate={() => setCurrentScreen("create-badge")} theme={theme} />
        );
      case "ai-recommend":
        return <AIRecommendScreen onBack={() => setCurrentScreen("home")} theme={theme} />;
      case "mypage":
        return (
          <MyPageScreen
            onBack={() => setCurrentScreen("home")}
            onLogout={handleLogout}
            userNickname={userNickname}
            userInterests={userInterests}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        );
      case "ranking":
        return <RankingScreen onBack={() => setCurrentScreen("home")} currentUserNickname={userNickname} theme={theme} />;
      default:
        return <HomeMapScreen onNavigate={setCurrentScreen} userNickname={userNickname} theme={theme} />;
    }
  };

  const showBottomNav = ["home", "ai-recommend", "ranking"].includes(currentScreen);

  return (
    <div className="relative">
      {renderScreen()}

      {/* Bottom Navigation */}
      {showBottomNav && (
        <div className={`fixed bottom-0 left-0 right-0 border-t z-50 ${
          theme === "dark" 
            ? "bg-slate-900 border-slate-800" 
            : "bg-white border-gray-200"
        }`}>
          <div className="grid grid-cols-4 h-16">
            <button
              onClick={() => setCurrentScreen("home")}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                currentScreen === "home" 
                  ? theme === "dark" ? "text-white" : "text-black"
                  : theme === "dark" ? "text-slate-400 hover:text-slate-300" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Home className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-xs">홈</span>
            </button>

            <button
              onClick={() => setCurrentScreen("ai-recommend")}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                currentScreen === "ai-recommend"
                  ? theme === "dark" ? "text-white" : "text-black"
                  : theme === "dark" ? "text-slate-400 hover:text-slate-300" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Sparkles className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-xs">AI 추천</span>
            </button>

            <button
              onClick={() => setCurrentScreen("ranking")}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                currentScreen === "ranking" 
                  ? theme === "dark" ? "text-white" : "text-black"
                  : theme === "dark" ? "text-slate-400 hover:text-slate-300" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <TrendingUp className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-xs">랭킹</span>
            </button>

            <button
              onClick={() => setCurrentScreen("mypage")}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                currentScreen === "mypage" 
                  ? theme === "dark" ? "text-white" : "text-black"
                  : theme === "dark" ? "text-slate-400 hover:text-slate-300" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Menu className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-xs">더보기</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}