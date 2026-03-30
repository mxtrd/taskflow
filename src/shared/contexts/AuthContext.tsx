import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getMe, type MeResponse } from '@/entities/auth/api/getMe'
import { logout as logoutApi } from '@/entities/auth/api/logout'
import { authStorage } from '@/shared/lib/auth-storage'
import { AuthContext, type SignInPayload } from './auth-context'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [me, setMe] = useState<MeResponse | null>(null)

  useEffect(() => {
    const accessToken = authStorage.getAccessToken()

    if (!accessToken) {
      setIsCheckingAuth(false)
      return
    }

    getMe()
      .then((user) => {
        setMe(user)
      })
      .catch(() => {
        authStorage.clearAll()
        setMe(null)
      })
      .finally(() => {
        setIsCheckingAuth(false)
      })
  }, [])

  const signIn = useCallback(async ({ accessToken, refreshToken }: SignInPayload) => {
    authStorage.setAccessToken(accessToken)
    authStorage.setRefreshToken(refreshToken)

    try {
      const user = await getMe()
      setMe(user)
    } catch {
      authStorage.clearAll()
      setMe(null)
      throw new Error('Failed to initialize session after OAuth login')
    }
  }, [])

  const logout = useCallback(async () => {
    const refreshToken = authStorage.getRefreshToken()

    try {
      if (refreshToken) {
        await logoutApi({ refreshToken })
      }
    } catch {
      // logout endpoint can fail; local clear still needed
    } finally {
      authStorage.clearAll()
      setMe(null)
    }
  }, [])

  const value = useMemo(
    () => ({
      isAuth: Boolean(me),
      isCheckingAuth,
      me,
      signIn,
      logout,
    }),
    [isCheckingAuth, me, signIn, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}