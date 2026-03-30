import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '@/entities/auth/api/login'
import { authStorage } from '@/shared/lib/auth-storage'

const OAuthCallbackPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')

      if (!code) {
        navigate('/boards')
        return
      }

      const redirectUri = `${window.location.origin}${import.meta.env.BASE_URL}oauth2/callback`
      // убираем двойной слэш, если BASE_URL оканчивается на /
      const normalizedRedirectUri = redirectUri.replace(/([^:]\/)\/+/g, '$1')

      try {
        const response = await login({
          code,
          redirectUri: normalizedRedirectUri,
          accessTokenTTL: '3m',
          rememberMe: true,
        })

        authStorage.setAccessToken(response.accessToken)
        authStorage.setRefreshToken(response.refreshToken)

        navigate('/boards')
      } catch (error) {
        console.error('OAuth login failed:', error)
        authStorage.clearAll()
        navigate('/boards')
      }
    }

    run()
  }, [navigate])

  return <div>Authorizing...</div>
}

export default OAuthCallbackPage