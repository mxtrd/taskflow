import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { MeResponse } from '@/entities/auth/api/getMe'
import { bootstrapAuthThunk, signInThunk, logoutThunk } from '@/app/store/thunks/authThunks'

type AuthUser = MeResponse | null

type AuthState = {
  me: AuthUser
  isAuth: boolean
  isCheckingAuth: boolean
  error: string | null
}

const initialState: AuthState = {
  me: null,
  isAuth: false,
  isCheckingAuth: true,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setMe(state, action: PayloadAction<AuthUser>) {
      state.me = action.payload
      state.isAuth = Boolean(action.payload)
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    clearAuth(state) {
      state.me = null
      state.isAuth = false
      state.error = null
      state.isCheckingAuth = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapAuthThunk.pending, (state) => {
        state.isCheckingAuth = true
        state.error = null
      })
      .addCase(bootstrapAuthThunk.fulfilled, (state, action) => {
        state.me = action.payload
        state.isAuth = Boolean(action.payload)
        state.isCheckingAuth = false
      })
      .addCase(bootstrapAuthThunk.rejected, (state, action) => {
        state.me = null
        state.isAuth = false
        state.isCheckingAuth = false
        state.error = action.payload ?? 'Failed to check auth'
      })
      .addCase(signInThunk.pending, (state) => {
        state.error = null
      })
      .addCase(signInThunk.fulfilled, (state, action) => {
        state.me = action.payload
        state.isAuth = true
      })
      .addCase(signInThunk.rejected, (state, action) => {
        state.me = null
        state.isAuth = false
        state.error = action.payload ?? 'Sign-in failed'
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.me = null
        state.isAuth = false
        state.isCheckingAuth = false
        state.error = null
      })
  },
})

export const { setMe, setAuthError, clearAuth } = authSlice.actions
export default authSlice.reducer