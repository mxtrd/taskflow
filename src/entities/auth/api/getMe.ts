import { axiosClient } from '@/shared/api/axiosClient'

export type MeResponse = {
  userId: string,
  login: string
}

export const getMe = () => axiosClient.get<MeResponse>('/auth/me').then((res) => res.data)