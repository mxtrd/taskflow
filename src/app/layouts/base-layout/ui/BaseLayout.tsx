import type { ReactNode } from 'react'
import { useLayoutEffect } from 'react'
import AppHead from '@/app/head'
import Header from '@/widgets/header'
import styles from '@/app/styles/base.module.scss'

type BaseLayoutProps = {
  title?: string
  description?: string
  children: ReactNode
}

const BaseLayout = ({ title, description, children }: BaseLayoutProps) => {
  useLayoutEffect(() => {
    const headerEl = document.querySelector<HTMLElement>('[data-app-header]')
    if (!headerEl) return

    const updateHeaderHeightVar = () => {
      const headerHeight = headerEl.offsetHeight
      document.documentElement.style.setProperty('--header-height', `${headerHeight}px`)
    }

    // Initial measurement (avoids layout jump after first paint).
    updateHeaderHeightVar()

    // Keep the CSS var in sync with responsive changes (font/line wrapping/etc).
    let ro: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => updateHeaderHeightVar())
      ro.observe(headerEl)
    }

    window.addEventListener('resize', updateHeaderHeightVar)
    return () => {
      ro?.disconnect()
      window.removeEventListener('resize', updateHeaderHeightVar)
    }
  }, [])

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
