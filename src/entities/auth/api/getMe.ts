import { httpClient } from '@/shared/api/httpClient'

export type MeResponse = {
  userId: string,
  login: string
}

export const getMe = () => {
  return httpClient.get<MeResponse>('/auth/me')
}