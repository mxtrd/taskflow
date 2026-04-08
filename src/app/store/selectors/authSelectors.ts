import type { RootState } from '@/app/store/store'

export const selectIsAuth = (state: RootState) => state.auth.isAuth
export const selectIsCheckingAuth = (state: RootState) => state.auth.isCheckingAuth
export const selectAuthMe = (state: RootState) => state.auth.me
export const selectAuthError = (state: RootState) => state.auth.error
