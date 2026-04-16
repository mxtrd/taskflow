import { useAuthRedux } from "@/shared/hooks/useAuthRedux"
import Button from '@/shared/ui/button'
import BaseLayout from '@/app/layouts/base-layout'
import baseStyles from '@/app/styles/base.module.scss'
import styles from './ProfilePage.module.scss'

const ProfilePage = () => {
  const { me, logout, isLoggingOut } = useAuthRedux()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <BaseLayout title='Taskflow' description='Taskflow - profile page'>
      <section className={baseStyles.section}>
        <div className={baseStyles.container}>
          <div className={`${baseStyles.content} ${styles.profileContent}`}>
            <h1 className={styles.title}>Profile Page</h1>
            <p className={styles.text}>Logged in as: {me?.login ?? 'unknown'}</p>
            <Button className={styles.profileButton} type='button' onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
        </div>
      </section>
    </BaseLayout>
  )
}

export default ProfilePage