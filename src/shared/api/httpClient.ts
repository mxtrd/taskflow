import { authStorage } from '@/shared/lib/auth-storage'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type RequestOptions = {
  method?: HttpMethod
  body?: unknown
  headers?: HeadersInit
  /**
   * For endpoints where Authorization header must be omitted,
   * e.g. `/auth/refresh` in this educational backend.
   */
  skipAuthorizationHeader?: boolean
  /**
   * Prevent `401 -> refresh -> retry` recursion on the retry itself.
   */
  skipAuthRefresh?: boolean
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_KEY = import.meta.env.VITE_API_KEY

if (!API_BASE_URL) {
  throw new Error('Missing VITE_API_BASE_URL in .env')
}

if (!API_KEY) {
  throw new Error('Missing VITE_API_KEY in .env')
}

const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
  'api-key': API_KEY,
}

export const httpClient = {
  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const normalizedPath = path.replace(/\/+$/, '')
    const isRefreshEndpoint = normalizedPath === '/auth/refresh'

    const accessToken = authStorage.getAccessToken()
    const authHeaders: HeadersInit =
      !options.skipAuthorizationHeader && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        ...defaultHeaders,
        ...authHeaders,
        ...(options.headers ?? {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    })

    // If access token is expired/invalid, try to refresh and retry once.
    if (response.status === 401 && !options.skipAuthRefresh && !isRefreshEndpoint) {
      if (!refreshInFlight) {
        refreshInFlight = refreshTokens()
      }

      const refreshOk = await refreshInFlight.finally(() => {
        refreshInFlight = null
      })

      if (refreshOk) {
        return this.request<T>(path, { ...options, skipAuthRefresh: true })
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${path}`)
    }

    if (response.status === 204) {
      return undefined as T
    }

    return response.json() as Promise<T>
  },

  get<T>(path: string, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' })
  },

  post<T>(path: string, body?: unknown, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: 'POST', body })
  },

  put<T>(path: string, body?: unknown, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PUT', body })
  },

  patch<T>(path: string, body?: unknown, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PATCH', body })
  },

  delete<T>(path: string, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' })
  },
}

let refreshInFlight: Promise<boolean> | null = null

async function refreshTokens(): Promise<boolean> {
  const refreshToken = authStorage.getRefreshToken()
  if (!refreshToken) return false

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      authStorage.clearAll()
      window.dispatchEvent(new Event('auth:logout'))
      return false
    }

    const tokens = (await response.json()) as { accessToken: string; refreshToken: string }
    authStorage.setAccessToken(tokens.accessToken)
    authStorage.setRefreshToken(tokens.refreshToken)
    return true
  } catch {
    authStorage.clearAll()
    window.dispatchEvent(new Event('auth:logout'))
    return false
  } finally {
    // No-op: state cleanup is done above on failure paths.
  }
}
