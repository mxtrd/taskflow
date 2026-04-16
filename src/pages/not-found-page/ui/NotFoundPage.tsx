import BaseLayout from "@/app/layouts/base-layout"
import baseStyles from '@/app/styles/base.module.scss'
import Button from '@/shared/ui/button'
import styles from './NotFoundPage.module.scss'

const NotFoundPage = () => {
  return (
    <BaseLayout title='Taskflow' description='Taskflow - 404 page'>
      <section className={baseStyles.section}>
        <div className={baseStyles.container}>
          <div className={`${baseStyles.content} ${styles.notFoundContent}`}>
            <h1 className={styles.title}>Page not found</h1>
            <p className={styles.text}>The page you are trying to open does not exist.</p>
            <Button className={styles.button} to='/boards'>
              Go to boards
            </Button>
          </div>
        </div>
      </section>
    </BaseLayout>
  )
}

export default NotFoundPage