const ACCESS_TOKEN_KEY = 'taskflow.accessToken'
const REFRESH_TOKEN_KEY = 'taskflow.refreshToken'
const DEMO_SESSION_KEY = 'taskflow.demoSession'

export const authStorage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token: string) => localStorage.setItem(ACCESS_TOKEN_KEY, token),
  clearAccessToken: () => localStorage.removeItem(ACCESS_TOKEN_KEY),
  
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
  clearRefreshToken: () => localStorage.removeItem(REFRESH_TOKEN_KEY),
  hasDemoSession: () => localStorage.getItem(DEMO_SESSION_KEY) === 'true',
  setDemoSession: () => localStorage.setItem(DEMO_SESSION_KEY, 'true'),
  clearDemoSession: () => localStorage.removeItem(DEMO_SESSION_KEY),
  clearAll: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(DEMO_SESSION_KEY)
  },
}