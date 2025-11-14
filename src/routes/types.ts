import { ComponentType, ReactNode } from "react";
import { NavigateFunction } from "react-router-dom";
import { ThemeMode } from "@/layouts/AppLayout";

export type RouteHandlers = {
  handleOnboardingComplete: (nickname: string, interests: string[]) => void;
  handleLogout: () => Promise<void>;
  toggleTheme: () => void;
};

export type RouteFactoryContext = {
  theme: ThemeMode;
  navigate: NavigateFunction;
  userNickname: string;
  userInterests: string[];
  handlers: RouteHandlers;
};

export type GuardComponents = Record<string, ComponentType<{ children: ReactNode }>>;

export type RouteDefinition<TProps = any> = {
  path: string;
  component: ComponentType<TProps>;
  withLayout?: boolean;
  guards?: string[];
  getProps?: (context: RouteFactoryContext) => TProps;
};
