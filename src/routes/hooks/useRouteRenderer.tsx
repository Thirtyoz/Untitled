import { ReactNode, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/store/useAppStore";
import { AppLayout } from "@/layouts/AppLayout";
import { GuardComponents, RouteDefinition, RouteFactoryContext } from "@/routes/types";

function RequireUserGuard({ children }: { children: ReactNode }) {
  const { user, hasCheckedSession } = useAppStore();
  if (!hasCheckedSession) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RedirectIfAuthenticatedGuard({ children }: { children: ReactNode }) {
  const { user, hasCheckedSession } = useAppStore();
  if (!hasCheckedSession) return null;
  if (user) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

const guardComponents: GuardComponents = {
  requireUser: RequireUserGuard,
  redirectIfAuthenticated: RedirectIfAuthenticatedGuard,
};

type GuardKey = keyof typeof guardComponents;

export function useRouteRenderer() {
  const navigate = useNavigate();
  const {
    userNickname,
    userInterests,
    theme,
    setUser,
    setHasCheckedSession,
    setUserNickname,
    setUserInterests,
    setTheme,
  } = useAppStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setHasCheckedSession(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setHasCheckedSession(true);
      if (!session?.user) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setHasCheckedSession, navigate]);

  const routeContext: RouteFactoryContext = {
    theme,
    navigate,
    userNickname,
    userInterests,
    handlers: {
      handleOnboardingComplete: (nickname, interests) => {
        setUserNickname(nickname);
        setUserInterests(interests);
        navigate("/");
      },
      handleLogout: async () => {
        await supabase.auth.signOut();
        setUser(null);
        navigate("/login");
      },
      toggleTheme: () => setTheme(theme === "light" ? "dark" : "light"),
    },
  };

  const guardSequence = (element: ReactNode, guards: string[] = []) =>
    guards.reduceRight((child, guardKey) => {
      const GuardComponent = guardComponents[guardKey as GuardKey];
      if (!GuardComponent) {
        return child;
      }
      return <GuardComponent>{child}</GuardComponent>;
    }, element);

  const renderRouteElement = (definition: RouteDefinition) => {
    const Component = definition.component;
    const componentProps = definition.getProps ? definition.getProps(routeContext) : {};

    let element = <Component {...componentProps} />;
    element = guardSequence(element, definition.guards);

    if (definition.withLayout) {
      element = <AppLayout theme={theme}>{element}</AppLayout>;
    }

    return element;
  };

  return { renderRouteElement };
}
