import BaseLayout from "@/app/layouts/base-layout"
import baseStyles from "@/app/styles/base.module.scss"
import styles from "./LoginPage.module.scss"

const LoginPage = () => {
  return (
    <BaseLayout title="Taskflow" description="Taskflow - login page">
      <section className={styles.login}>
        <div className={baseStyles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>Task Manager</h1>
            <form className={styles.loginForm} action="#">
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
            </form>
          </div>
        </div>
      </section>
    </BaseLayout>
  )
}

export default LoginPage
