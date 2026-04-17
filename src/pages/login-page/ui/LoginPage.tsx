import { useNavigate } from "react-router-dom"
import BaseLayout from "@/app/layouts/base-layout"
import baseStyles from "@/app/styles/base.module.scss"
import { useAuthRedux } from "@/shared/hooks/useAuthRedux"
import { isDemoMode } from "@/shared/config/is-dev-offline"
import Button from "@/shared/ui/button"
import styles from "./LoginPage.module.scss"

const LoginPage = () => {
  const navigate = useNavigate()
  const { isAuth, enterLocalDevSession } = useAuthRedux()
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const canUseOAuth = !isDemoMode && Boolean(apiBaseUrl)

  const handleOAuthStart = async () => {
    const callbackUrl = `${window.location.origin}${import.meta.env.BASE_URL}oauth2/callback`
    const normalizedCallbackUrl = callbackUrl.replace(/([^:]\/)\/+/g, '$1')
    const url = `${apiBaseUrl}/auth/oauth-redirect?callbackUrl=${encodeURIComponent(normalizedCallbackUrl)}`
    window.location.href = url
  }

  const handleContinueOffline = () => {
    enterLocalDevSession()
    navigate('/boards', { replace: true })
  }

  return (
    <BaseLayout title="Taskflow | Login" description="Taskflow - login page">
      <section className={baseStyles.section}>
        <div className={baseStyles.container}>
          <div className={`${baseStyles.content} ${styles.content}`}>
            <h1 className={styles.title}>Task Manager</h1>
            {isDemoMode && (
              <div className={styles.devOfflineNotice} role="status">
                <p className={styles.devOfflineText}>
                  Demo mode: app data comes from{' '}
                  <code className={styles.devOfflineCode}>src/shared/mocks/taskflowData.ts</code>{' '}
                  (no API calls from auth/boards/tasks flows).
                </p>
                {!isAuth && (
                  <button type="button" className={styles.devOfflineButton} onClick={handleContinueOffline}>
                    Continue with mock session
                  </button>
                )}
              </div>
            )}
            {canUseOAuth && (
              <Button className={styles.button} type='button' onClick={handleOAuthStart}>
                Login via OAuth
              </Button>
            )}
          </div>
        </div>
      </section>
    </BaseLayout>
  )
}

export default LoginPage
