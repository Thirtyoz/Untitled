import { create } from 'zustand'
import { User } from '@supabase/supabase-js'
import { ThemeMode } from '@/layouts/AppLayout'

export type UserInfo = {
  nickname: string
  interests: string[]
  theme: ThemeMode
  email: string
}

interface AppState {
  user: User | null
  isLoggedIn: boolean
  hasCheckedSession: boolean
  userInfo: UserInfo
  setUser: (user: User | null) => void
  setIsLoggedIn: (isLoggedIn: boolean) => void
  setHasCheckedSession: (checked: boolean) => void
  setUserInfo: (info: Partial<UserInfo>) => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isLoggedIn: false,
  hasCheckedSession: false,
  userInfo: {
    nickname: '서울수집가',
    interests: ['#카페투어', '#야경', '#한강'],
    theme: 'light',
    email: '',
  },
  setUser: (user: User | null) => set({ user, isLoggedIn: !!user }),
  setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
  setHasCheckedSession: (checked: boolean) => set({ hasCheckedSession: checked }),
  setUserInfo: (info: Partial<UserInfo>) =>
    set((state) => ({ userInfo: { ...state.userInfo, ...info } })),
}))
