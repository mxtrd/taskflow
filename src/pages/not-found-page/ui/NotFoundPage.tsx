import BaseLayout from "@/app/layouts/base-layout"
import baseStyles from '@/app/styles/base.module.scss'
import styles from './NotFoundPage.module.scss'

const NotFoundPage = () => {
  return (
    <BaseLayout title='Taskflow' description='Taskflow - 404 page'>
      <section className={styles.boards}>
        <div className={baseStyles.container}>
          <div className={baseStyles.content}>
            <h1 className={styles.title}>Page not found</h1>
          </div>
        </div>
      </section>
    </BaseLayout>
  )
}

export default NotFoundPage