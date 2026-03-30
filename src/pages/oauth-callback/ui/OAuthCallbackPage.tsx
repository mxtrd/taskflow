import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '@/entities/auth/api/login'
import { useAuth } from '@/shared/hooks/useAuth'

const OAuthCallbackPage = () => {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const isHandledRef = useRef(false)

  useEffect(() => {
    if (isHandledRef.current) return
    isHandledRef.current = true

    const run = async () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')

      if (!code) {
        navigate('/login', { replace: true })
        return
      }

      const redirectUri = `${window.location.origin}${import.meta.env.BASE_URL}oauth2/callback`
      const normalizedRedirectUri = redirectUri.replace(/([^:]\/)\/+/g, '$1')

      try {
        const response = await login({
          code,
          redirectUri: normalizedRedirectUri,
          accessTokenTTL: '3m',
          rememberMe: true,
        })

        await signIn({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        })

        navigate('/boards', { replace: true })
      } catch (error) {
        console.error('OAuth login failed:', error)
        navigate('/login', { replace: true })
      }
    }

    run()
  }, [navigate, signIn])

  return <div>Authorizing...</div>
}

export default OAuthCallbackPage