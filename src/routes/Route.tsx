import { Routes, Route } from "react-router-dom";
import {
  LoginScreen,
  OnboardingScreen,
  HomeMapScreen,
  BadgeDetailScreen,
  CreateBadgeScreen,
  BadgeResultScreen,
  AIRecommendScreen,
  MyPageScreen,
  RankingScreen,
} from "@/pages";
import { RouteDefinition } from "@/routes/types";
import { useRouteRenderer } from "@/routes/hooks/useRouteRenderer";

const routeDefinitions: RouteDefinition[] = [
  {
    path: "/login",
    component: LoginScreen,
    guards: ["redirectIfAuthenticated"],
    getProps: ({ theme, navigate }) => ({
      theme,
      onLogin: () => navigate("/onboarding"),
    }),
  },
  {
    path: "/onboarding",
    component: OnboardingScreen,
    guards: ["requireUser"],
    getProps: ({ theme, handlers }) => ({
      theme,
      onComplete: handlers.handleOnboardingComplete,
    }),
  },
  {
    path: "/",
    component: HomeMapScreen,
    withLayout: true,
    guards: ["requireUser"],
    getProps: ({ theme, navigate, userNickname }) => ({
      theme,
      userNickname,
      onNavigate: (screen: string) => navigate(`/${screen}`),
    }),
  },
  {
    path: "/badge-detail",
    component: BadgeDetailScreen,
    guards: ["requireUser"],
    getProps: ({ theme, navigate }) => ({
      theme,
      onBack: () => navigate("/"),
    }),
  },
  {
    path: "/create-badge",
    component: CreateBadgeScreen,
    guards: ["requireUser"],
    getProps: ({ theme, navigate }) => ({
      theme,
      onBack: () => navigate("/"),
      onComplete: () => navigate("/badge-result"),
    }),
  },
  {
    path: "/badge-result",
    component: BadgeResultScreen,
    guards: ["requireUser"],
    getProps: ({ theme, navigate }) => ({
      theme,
      onSave: () => navigate("/"),
      onRegenerate: () => navigate("/create-badge"),
    }),
  },
  {
    path: "/ai-recommend",
    component: AIRecommendScreen,
    withLayout: true,
    guards: ["requireUser"],
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
    getProps: ({ theme, navigate, userNickname, userInterests, handlers }) => ({
      theme,
      onBack: () => navigate("/"),
      onLogout: handlers.handleLogout,
      userNickname,
      userInterests,
      onToggleTheme: handlers.toggleTheme,
    }),
  },
  {
    path: "/ranking",
    component: RankingScreen,
    withLayout: true,
    guards: ["requireUser"],
    getProps: ({ theme, navigate, userNickname }) => ({
      theme,
      onBack: () => navigate("/"),
      currentUserNickname: userNickname,
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
