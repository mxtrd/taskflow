import { useEffect } from 'react'
import '@/app/styles/vendor/normalize.css'
import styles from '@/app/styles/base.module.scss'

type AppHeadProps = {
  title?: string
  description?: string
}

const DESCRIPTION_META_NAME = 'description'

const ensureDescriptionMeta = () => {
  const existingMeta = document.querySelector<HTMLMetaElement>(
    `meta[name="${DESCRIPTION_META_NAME}"]`
  )

  if (existingMeta) {
    return existingMeta
  }

  const meta = document.createElement('meta')
  meta.name = DESCRIPTION_META_NAME
  document.head.appendChild(meta)

  return meta
}

const AppHead = ({
  title = 'Taskflow',
  description = 'Taskflow app',
}: AppHeadProps) => {
  useEffect(() => {
    document.title = title
  }, [title])

  useEffect(() => {
    const descriptionMeta = ensureDescriptionMeta()
    descriptionMeta.content = description
  }, [description])

  useEffect(() => {
    const htmlElement = document.documentElement
    const bodyElement = document.body

    htmlElement.classList.add(styles.page)
    bodyElement.classList.add(styles.pageBody)

    return () => {
      htmlElement.classList.remove(styles.page)
      bodyElement.classList.remove(styles.pageBody)
    }
  }, [])

  return null
}

export default AppHead
