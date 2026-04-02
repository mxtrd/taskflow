import { httpClient } from '@/shared/api/httpClient'

export type RefreshRequest = {
  refreshToken: string
}

export type RefreshResponse = {
  refreshToken: string
  accessToken: string
}

/**
 * Refresh tokens pair.
 * Backend expects no `Authorization` header for this educational endpoint.
 */
export const refresh = (payload: RefreshRequest) => {
  return httpClient.post<RefreshResponse>('/auth/refresh', payload, {
    skipAuthorizationHeader: true,
  })
}

