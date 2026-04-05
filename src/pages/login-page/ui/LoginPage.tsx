import BaseLayout from "@/app/layouts/base-layout"
import baseStyles from "@/app/styles/base.module.scss"
import styles from "./LoginPage.module.scss"

const LoginPage = () => {

  const handleOAuthStart = async () => {
    const callbackUrl = `${window.location.origin}${import.meta.env.BASE_URL}oauth2/callback`
    const normalizedCallbackUrl = callbackUrl.replace(/([^:]\/)\/+/g, '$1')
    const url = `${import.meta.env.VITE_API_BASE_URL}/auth/oauth-redirect?callbackUrl=${encodeURIComponent(normalizedCallbackUrl)}`
    window.location.href = url
  }

  return (
    <BaseLayout title="Taskflow | Login" description="Taskflow - login page">
      <section className={styles.login}>
        <div className={baseStyles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>Task Manager</h1>
            {/* <form className={styles.loginForm} action="#">
              <div className={styles.column}>
                <label className={styles.label} htmlFor="useremail">
                  Email
                </label>
                <input className={styles.input} type="email" name="email" id="useremail" />
              </div>
              <div className={styles.column}>
                <label className={styles.label} htmlFor="userpassword">
                  Password
                </label>
                <input
                  className={styles.input}
                  type="password"
                  name="password"
                  id="userpassword"
                />
              </div>
              <div className={styles.column}>
                <button className={styles.button} type="submit">
                  Login
                </button>
              </div>
            </form> */}
            <button type='button' onClick={handleOAuthStart}>
              Login via OAuth
            </button>
          </div>
        </div>
      </section>
    </BaseLayout>
  )
}

export default LoginPage
