import { useCallback, useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux-hooks'
import {
  selectAuthMe,
  selectIsAuth,
  selectIsCheckingAuth,
  selectIsLoggingOut,
  selectIsSigningIn,
} from '@/app/store/selectors/authSelectors'
import {
  bootstrapAuthThunk,
  logoutThunk,
  signInThunk,
  type SignInPayload,
} from '@/app/store/thunks/authThunks'
import { clearAuth, setMe } from '@/app/store/slices/authSlice'
import { isDemoMode } from '@/shared/config/is-dev-offline'
import { authStorage } from '@/shared/lib/auth-storage'

const DEV_OFFLINE_ME = {
  userId: 'dev-offline',
  login: 'dev@offline.local',
}

export const useAuthRedux = () => {
  const dispatch = useAppDispatch()
  const isAuth = useAppSelector(selectIsAuth)
  const isCheckingAuth = useAppSelector(selectIsCheckingAuth)
  const isSigningIn = useAppSelector(selectIsSigningIn)
  const isLoggingOut = useAppSelector(selectIsLoggingOut)
  const me = useAppSelector(selectAuthMe)

  useEffect(() => {
    if (isDemoMode) {
      if (authStorage.hasDemoSession()) {
        dispatch(setMe(DEV_OFFLINE_ME))
      } else {
        dispatch(clearAuth())
      }
      return
    }

    if (isCheckingAuth) {
      void dispatch(bootstrapAuthThunk())
    }
  }, [dispatch, isCheckingAuth])

  useEffect(() => {
    const handleLogout = () => {
      dispatch(clearAuth())
    }

    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [dispatch])

  const signIn = useCallback(
    async (payload: SignInPayload) => {
      if (isDemoMode) {
        authStorage.setDemoSession()
        dispatch(setMe(DEV_OFFLINE_ME))
        return
      }
      await dispatch(signInThunk(payload)).unwrap()
    },
    [dispatch]
  )

  const logout = useCallback(async () => {
    if (isDemoMode) {
      authStorage.clearDemoSession()
      dispatch(clearAuth())
      return
    }
    await dispatch(logoutThunk()).unwrap()
  }, [dispatch])

  const enterLocalDevSession = useCallback(() => {
    if (!isDemoMode) return
    authStorage.setDemoSession()
    dispatch(setMe(DEV_OFFLINE_ME))
  }, [dispatch])

  return useMemo(
    () => ({
      isAuth,
      isCheckingAuth: isDemoMode ? false : isCheckingAuth,
      isSigningIn: isDemoMode ? false : isSigningIn,
      isLoggingOut: isDemoMode ? false : isLoggingOut,
      me,
      signIn,
      logout,
      enterLocalDevSession,
    }),
    [isAuth, isCheckingAuth, isSigningIn, isLoggingOut, me, signIn, logout, enterLocalDevSession]
  )
}
