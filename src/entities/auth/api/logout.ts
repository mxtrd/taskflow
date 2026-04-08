import { axiosClient } from '@/shared/api/axiosClient'

export type LogoutRequest = {
  refreshToken: string
}

export const logout = async (payload: LogoutRequest): Promise<void> => {
  await axiosClient.post('/auth/logout', payload)
}