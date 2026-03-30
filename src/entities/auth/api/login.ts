import { httpClient } from '@/shared/api/httpClient'

export type LoginRequest = {
  code: string
  redirectUri: string
  accessTokenTTL: string
  rememberMe: boolean
}
export type LoginResponse = {
  refreshToken: string
  accessToken: string
}

export const login = (payload: LoginRequest) => {
  return httpClient.post<LoginResponse>('/auth/login', payload)
}

export const getAccessTokenFromLoginResponse = (res: LoginResponse): string => {
  return res.accessToken
}