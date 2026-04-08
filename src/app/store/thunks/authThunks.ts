import { createAsyncThunk } from '@reduxjs/toolkit'
import { getMe, type MeResponse } from '@/entities/auth/api/getMe'
import { logout as logoutApi } from '@/entities/auth/api/logout'
import { authStorage } from '@/shared/lib/auth-storage'

export type SignInPayload = {
  accessToken: string
  refreshToken: string
}

export const bootstrapAuthThunk = createAsyncThunk<
  MeResponse | null,
  void,
  { rejectValue: string }
>('auth/bootstrap', async (_, { rejectWithValue }) => {
  const accessToken = authStorage.getAccessToken()
  const refreshToken = authStorage.getRefreshToken()

  if (!accessToken && !refreshToken) {
    return null
  }

  try {
    return await getMe()
  } catch {
    authStorage.clearAll()
    return rejectWithValue('Failed to bootstrap auth session')
  }
})

export const signInThunk = createAsyncThunk<
  MeResponse,
  SignInPayload,
  { rejectValue: string }
>('auth/signIn', async ({ accessToken, refreshToken }, { rejectWithValue }) => {
  authStorage.setAccessToken(accessToken)
  authStorage.setRefreshToken(refreshToken)

  try {
    return await getMe()
  } catch {
    authStorage.clearAll()
    return rejectWithValue('Failed to initialize session after OAuth login')
  }
})

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  const refreshToken = authStorage.getRefreshToken()

  try {
    if (refreshToken) {
      await logoutApi({ refreshToken })
    }
  } catch {
    // Ignore backend logout error; local clear is still required.
  } finally {
    authStorage.clearAll()
  }
})
