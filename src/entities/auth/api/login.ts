import { axiosClient } from '@/shared/api/axiosClient'

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
  return axiosClient.post<LoginResponse>('/auth/login', payload).then((res) => res.data)
}

export const getAccessTokenFromLoginResponse = (res: LoginResponse): string => {
  return res.accessToken
}