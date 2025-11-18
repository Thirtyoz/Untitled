import { create } from 'zustand'
import { User } from '@supabase/supabase-js'
import { ThemeMode } from '@/layouts/AppLayout'

export type UserInfo = {
  nickname: string
  interests: string[]
  theme: ThemeMode
  email: string
}

// 사용자가 생성한 배지 타입 정의
export type UserBadge = {
  id: string
  name: string              // location name (e.g., "뚝섬 음악분수")
  location: string          // location text (e.g., "서울시 마포구 합정동")
  locationCoords?: { lat: number; lng: number } // GPS coordinates (optional)
  date: string              // creation date
  tags: string[]            // selected tags
  imageUrl: string          // AI generated image (base64 or URL)
  contsName?: string        // place name for filtering in Home
  description?: string      // user's description about the place
}

interface AppState {
  user: User | null
  isLoggedIn: boolean
  hasCheckedSession: boolean
  userInfo: UserInfo
  myBadges: UserBadge[]
  setUser: (user: User | null) => void
  setIsLoggedIn: (isLoggedIn: boolean) => void
  setHasCheckedSession: (checked: boolean) => void
  setUserInfo: (info: Partial<UserInfo>) => void
  addBadge: (badge: UserBadge) => void
  removeBadge: (id: string) => void
  clearBadges: () => void
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
  myBadges: [
    // 기존 하드코딩된 배지들을 초기값으로 설정
    {
      id: 'badge-changdeokgung',
      name: '창덕궁',
      location: '서울시 종로구 창덕궁',
      locationCoords: { lat: 37.579507458, lng: 126.991076632 },
      date: '2024.11.01',
      tags: ['#고궁', '#역사'],
      imageUrl: '/changduck.png',
      contsName: '창덕궁',
      description: '아름다운 한국 전통 궁궐의 정수'
    },
    {
      id: 'badge-ddp',
      name: '동대문디자인플라자',
      location: '서울시 중구 동대문디자인플라자',
      locationCoords: { lat: 37.567699688, lng: 127.009847695 },
      date: '2024.11.05',
      tags: ['#건축', '#디자인'],
      imageUrl: '/ddp.png',
      contsName: '동대문디자인플라자(DDP)',
      description: '미래적인 디자인의 랜드마크'
    },
    {
      id: 'badge-childrenpark',
      name: '서울어린이대공원',
      location: '서울시 광진구 서울어린이대공원',
      locationCoords: { lat: 37.549615186, lng: 127.07823779 },
      date: '2024.11.10',
      tags: ['#공원', '#가족나들이'],
      imageUrl: '/penguin.png',
      contsName: '서울어린이대공원 음악분수',
      description: '가족과 함께하는 즐거운 공원'
    }
  ],
  setUser: (user: User | null) => set({ user, isLoggedIn: !!user }),
  setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
  setHasCheckedSession: (checked: boolean) => set({ hasCheckedSession: checked }),
  setUserInfo: (info: Partial<UserInfo>) =>
    set((state) => ({ userInfo: { ...state.userInfo, ...info } })),
  addBadge: (badge: UserBadge) =>
    set((state) => ({
      myBadges: [...state.myBadges, badge]
    })),
  removeBadge: (id: string) =>
    set((state) => ({
      myBadges: state.myBadges.filter(b => b.id !== id)
    })),
  clearBadges: () => set({ myBadges: [] }),
}))
