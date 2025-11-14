import { MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { supabase } from "../supabaseClient";
import { useState } from "react";

interface LoginScreenProps {
  onLogin: () => void;
  theme: "light" | "dark";
}

export function LoginScreen({ onLogin, theme }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });

      if (error) {
        console.error('Login error:', error);
        setError(error.message);
      } else {
        console.log('Login initiated:', data);
        // OAuth will redirect automatically, then onLogin will be called
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col">
      {/* Background - Seoul Namsan Tower night photo */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1645451350581-2aebd3932286?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTZW91bCUyME5hbXNhbiUyMFRvd2VyJTIwbmlnaHR8ZW58MXx8fHwxNzYzMDM4MjU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Seoul Namsan Tower at night"
          className="w-full h-full object-cover"
        />
        <div
          className={`absolute inset-0 ${
            theme === "dark"
              ? "bg-gradient-to-b from-[#0a0e1a]/60 via-[#0a0e1a]/70 to-[#0a0e1a]/90"
              : "bg-gradient-to-b from-black/40 via-black/50 to-black/70"
          }`}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
        {/* Logo and branding */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <MapPin className="w-8 h-8 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl mb-4 tracking-tight text-white">
            PinSeoul
          </h1>
          <p className="text-white text-lg mb-2">
            AI로 기록하는 나의 서울
          </p>
          <p className="text-white/80 max-w-xs mx-auto leading-relaxed">
            서울의 명소를 방문하고,
            <br />
            나만의 AI 배지를 수집하세요
          </p>
        </div>
      </div>

      {/* Bottom section with login button */}
      <div className="relative z-10 px-8 pb-12">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-red-200 text-sm text-center">{error}</p>
          </div>
        )}

        <Button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full h-14 rounded-full bg-white hover:bg-gray-100 text-black shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              로그인 중...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google로 계속하기
            </>
          )}
        </Button>

        <div className="mt-6 text-center text-xs text-white/60 space-x-4">
          <a href="#" className="hover:text-white transition-colors">
            이용약관
          </a>
          <span>·</span>
          <a href="#" className="hover:text-white transition-colors">
            개인정보 처리방침
          </a>
        </div>
      </div>
    </div>
  );
}