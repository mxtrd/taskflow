import { authStorage } from '@/shared/lib/auth-storage'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type RequestOptions = {
  method?: HttpMethod
  body?: unknown
  headers?: HeadersInit
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
    const accessToken = authStorage.getAccessToken()
    const authHeaders: HeadersInit = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {}

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        ...defaultHeaders,
        ...authHeaders,
        ...(options.headers ?? {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    })

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
