import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios"
import { authStorage } from "../lib/auth-storage"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_KEY = import.meta.env.VITE_API_KEY

if (!API_BASE_URL) {
  throw new Error('Missing VITE_API_BASE_URL in .env')
}

if (!API_KEY) {
  throw new Error('Missing VITE_API_KEY in .env')
}

type RetriableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
  skipAuthRefresh?: boolean
  skipAuthorizationHeader?: boolean
}

type RefreshOutput = {
  refreshToken: string
  accessToken: string
}

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'api-key': API_KEY,
  },
})

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'api-key': API_KEY,
  },
})

let refreshInFlight: Promise<boolean> | null = null

const refreshTokens = async (): Promise<boolean> => {
  const refreshToken = authStorage.getRefreshToken()
  if (!refreshToken) return false

  try {
    const response = await refreshClient.post<RefreshOutput>(
      '/auth/refresh', 
      { refreshToken }
    )

    authStorage.setAccessToken(response.data.accessToken)
    authStorage.setRefreshToken(response.data.refreshToken)
    return true
  } catch {
    authStorage.clearAll()
    window.dispatchEvent(new Event('auth:logout'))
    return false
  }
}

axiosClient.interceptors.request.use((config) => {
  const cfg = config as RetriableConfig
  if (!cfg.skipAuthorizationHeader) {
    const accessToken = authStorage.getAccessToken()
    if (accessToken) {
      cfg.headers = cfg.headers ?? {}
      cfg.headers.Authorization = `Bearer ${accessToken}`
    }
  }
  return cfg
})

axiosClient.interceptors.response.use(
  (response) => response, 
  async (error: AxiosError) => {
    const original = (error.config ?? {}) as RetriableConfig
    const status = error.response?.status
    const isRefreshEndPoint = original.url?.replace(/\/+$/, '') === '/auth/refresh'

    if (status === 401 && !original._retry && !original.skipAuthRefresh && !isRefreshEndPoint) {
      original._retry = true

      if (!refreshInFlight) {
        refreshInFlight = refreshTokens()
      }

      const refreshOk = await refreshInFlight.finally(() => {
        refreshInFlight = null
      })

      if (refreshOk) {
        return axiosClient.request(original)
      }
    }

    return Promise.reject(error)
})

export { axiosClient }