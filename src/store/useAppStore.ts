import { create } from 'zustand'
import { User } from '@supabase/supabase-js'
import { ThemeMode } from '@/layouts/AppLayout'

interface AppState {
  user: User | null
  isLoggedIn: boolean
  hasCheckedSession: boolean
  userNickname: string
  userInterests: string[]
  theme: ThemeMode
  setUser: (user: User | null) => void
  setIsLoggedIn: (isLoggedIn: boolean) => void
  setHasCheckedSession: (checked: boolean) => void
  setUserNickname: (nickname: string) => void
  setUserInterests: (interests: string[]) => void
  setTheme: (theme: ThemeMode) => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isLoggedIn: false,
  hasCheckedSession: false,
  userNickname: '서울수집가',
  userInterests: ['#카페투어', '#야경', '#한강'],
  theme: 'light',
  setUser: (user: User | null) => set({ user, isLoggedIn: !!user }),
  setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
  setHasCheckedSession: (checked: boolean) => set({ hasCheckedSession: checked }),
  setUserNickname: (nickname: string) => set({ userNickname: nickname }),
  setUserInterests: (interests: string[]) => set({ userInterests: interests }),
  setTheme: (theme: ThemeMode) => set({ theme }),
}))
