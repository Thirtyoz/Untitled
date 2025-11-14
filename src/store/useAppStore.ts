import { create } from 'zustand'
import { User } from '@supabase/supabase-js'

interface AppState {
  user: User | null
  isLoggedIn: boolean
  setUser: (user: User | null) => void
  setIsLoggedIn: (isLoggedIn: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isLoggedIn: false,
  setUser: (user: User | null) => set({ user, isLoggedIn: !!user }),
  setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
}))
