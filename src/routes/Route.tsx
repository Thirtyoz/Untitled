import { Routes, Route } from "react-router-dom";
import {
  LoginScreen,
  OnboardingScreen,
  Home,
  BadgeDetailScreen,
  CreateBadgeScreen,
  BadgeResultScreen,
  AIRecommendScreen,
  MyPageScreen,
  RankingScreen,
} from "@/pages";
import { RouteDefinition } from "@/routes/types";
import { useRouteRenderer } from "@/routes/hooks/useRouteRenderer";
import { CollectionScreen } from "@/pages/collection/CollectionScreen";

const routeDefinitions: RouteDefinition[] = [
  {
    path: "/login",
    component: LoginScreen,
    // guards: ["redirectIfAuthenticated"],
    getProps: ({ theme, navigate }) => ({
      theme,
      onLogin: () => navigate("/"),
    }),
  },
  {
    path: "/onboarding",
    component: OnboardingScreen,
    // guards: ["requireUser"],
    getProps: ({ theme, handlers }) => ({
      theme,
      onComplete: handlers.handleOnboardingComplete,
    }),
  },
  {
    path: "/",
    component: Home,
    withLayout: true,
    guards: ["requireUser"],
    getProps: ({ theme, navigate, userInfo }) => ({
      theme,
      userNickname: userInfo.nickname,
      onNavigate: (screen: string) => navigate(`/${screen}`),
    }),
  },
  {
    path: "/badge-detail",
    component: BadgeDetailScreen,
    // guards: ["requireUser"],
    getProps: ({ theme, navigate }) => ({
      theme,
      onBack: () => navigate("/"),
    }),
  },
  {
    path: "/create-badge",
    component: CreateBadgeScreen,
    // guards: ["requireUser"],
    getProps: ({ theme, navigate }) => ({
      theme,
      onBack: () => navigate("/"),
      onComplete: (badgeData: {
        imageUrl: string;
        description: string;
        tags: string[];
        location: string;
      }) => navigate("/badge-result", { state: badgeData }),
    }),
  },
  {
    path: "/badge-result",
    component: BadgeResultScreen,
    // guards: ["requireUser"],
    getProps: ({ theme, navigate }) => ({
      theme,
      onSave: () => navigate("/"),
      onRegenerate: () => navigate("/create-badge"),
    }),
  },
  {
    path: "/collection",
    component: CollectionScreen,
    withLayout: true,
    // guards: ["requireUser"],
    getProps: ({ theme, navigate }) => ({
      theme,
      onBack: () => navigate("/"),
    }),
  },
  {
    path: "/mypage",
    component: MyPageScreen,
    withLayout: true,
    guards: ["requireUser"],
    getProps: ({ theme, navigate, userInfo, handlers }) => ({
      theme,
      onBack: () => navigate("/"),
      onLogout: handlers.handleLogout,
      userNickname: userInfo.nickname,
      userInterests: userInfo.interests,
      userEmail: userInfo.email,
      onToggleTheme: handlers.toggleTheme,
    }),
  },
  {
    path: "/ranking",
    component: RankingScreen,
    withLayout: true,
    guards: ["requireUser"],
    getProps: ({ theme, navigate, userInfo }) => ({
      theme,
      onBack: () => navigate("/"),
      currentUserNickname: userInfo.nickname,
    }),
  },
];

export function AppContent() {
  const { renderRouteElement } = useRouteRenderer();

  return (
    <Routes>
      {routeDefinitions.map((definition) => (
        <Route key={definition.path} path={definition.path} element={renderRouteElement(definition)} />
      ))}
    </Routes>
  );
}
