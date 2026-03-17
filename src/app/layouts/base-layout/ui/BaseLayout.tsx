import type { ReactNode } from 'react'
import AppHead from '@/app/head'
import Header from '@/widgets/header'
import styles from '@/app/styles/base.module.scss'

type BaseLayoutProps = {
  title?: string
  description?: string
  children: ReactNode
}

const BaseLayout = ({ title, description, children }: BaseLayoutProps) => {
  return (
    <>
      <AppHead title={title} description={description} />
      <Header />
      <div className={styles.siteContainer}>
        <main className={styles.main}>{children}</main>
      </div>
    </>
  )
}

export default BaseLayout
