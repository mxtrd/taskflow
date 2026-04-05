import { createContext } from 'react'
import type { MeResponse } from '@/entities/auth/api/getMe'

export type SignInPayload = {
  accessToken: string
  refreshToken: string
}

export type AuthContextValue = {
  isAuth: boolean
  isCheckingAuth: boolean
  me: MeResponse | null
  signIn: (payload: SignInPayload) => Promise<void>
  logout: () => Promise<void>
  /** Restore mock session after logout when `VITE_DEV_OFFLINE=true` (dev only). */
  enterLocalDevSession: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)