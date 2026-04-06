import clsx from 'clsx'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth'
import baseStyles from '@/app/styles/base.module.scss'
import styles from './Header.module.scss'

const BRAND = 'TaskFlow'

const Header = () => {
  const { pathname } = useLocation()
  const { isAuth, me } = useAuth()

  const taskMatch = pathname.match(/^\/boards\/([^/]+)\/tasks\/([^/]+)\/?$/)

  if (taskMatch) {
    const [, boardId] = taskMatch
    return (
      <header className={styles.header}>
        <div className={baseStyles.container}>
          <div className={styles.inner}>
            <Link className={styles.backLink} to={`/boards/${boardId}`}>
              ← Back
            </Link>
          </div>
        </div>
      </header>
    )
  }

  const isGuestRoute = pathname === '/login' || pathname === '/oauth2/callback'

  if (isGuestRoute || !isAuth) {
    return (
      <header className={styles.header}>
        <div className={baseStyles.container}>
          <div className={styles.inner}>
            <span className={styles.logo}>
              {BRAND}
            </span>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className={styles.header}>
      <div className={baseStyles.container}>
        <div className={styles.inner}>
          <Link className={styles.logo} to="/boards">
            {BRAND}
          </Link>
          {pathname !== '/profile' && (
            <Link className={styles.profile} to="/profile">
              {me?.login ?? 'Profile'}
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header