import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type AuthUser = {
  userId: string
  login: string
} | null

type AuthState = {
  me: AuthUser
  isAuth: boolean
  isCheckingAuth: boolean
  error: string | null
}

const initialState: AuthState = {
  me: null,
  isAuth: false,
  isCheckingAuth: false,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthChecking(state, action: PayloadAction<boolean>) {
      state.isCheckingAuth = action.payload
    },
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
    },
  }
})

export const { setAuthChecking, setMe, setAuthError, clearAuth} = authSlice.actions
export default authSlice.reducer