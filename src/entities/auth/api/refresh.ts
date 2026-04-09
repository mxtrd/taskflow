import axios from 'axios'

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
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  const API_KEY = import.meta.env.VITE_API_KEY

  return axios
    .post<RefreshResponse>(`${API_BASE_URL}/auth/refresh`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': API_KEY,
      },
      withCredentials: false,
    })
    .then((res) => res.data)
}

