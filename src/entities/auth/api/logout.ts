import { httpClient } from '@/shared/api/httpClient'

export type LogoutRequest = {
  refreshToken: string
}

export const logout = async (payload: LogoutRequest): Promise<void> => {
  await httpClient.post<unknown>('/auth/logout', payload)
}