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
import { isDevOffline } from '@/shared/config/is-dev-offline'

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
    if (isDevOffline) {
      dispatch(setMe(DEV_OFFLINE_ME))
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
      if (isDevOffline) {
        dispatch(setMe(DEV_OFFLINE_ME))
        return
      }
      await dispatch(signInThunk(payload)).unwrap()
    },
    [dispatch]
  )

  const logout = useCallback(async () => {
    if (isDevOffline) {
      dispatch(clearAuth())
      return
    }
    await dispatch(logoutThunk()).unwrap()
  }, [dispatch])

  const enterLocalDevSession = useCallback(() => {
    if (!isDevOffline) return
    dispatch(setMe(DEV_OFFLINE_ME))
  }, [dispatch])

  return useMemo(
    () => ({
      isAuth: isDevOffline ? true : isAuth,
      isCheckingAuth: isDevOffline ? false : isCheckingAuth,
      isSigningIn: isDevOffline ? false : isSigningIn,
      isLoggingOut: isDevOffline ? false : isLoggingOut,
      me: isDevOffline ? DEV_OFFLINE_ME : me,
      signIn,
      logout,
      enterLocalDevSession,
    }),
    [isAuth, isCheckingAuth, isSigningIn, isLoggingOut, me, signIn, logout, enterLocalDevSession]
  )
}
