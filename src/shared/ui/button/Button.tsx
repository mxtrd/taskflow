import type { MouseEventHandler, ReactNode } from 'react'
import styles from './Button.module.scss'

type Props = {
  className?: string
  type?: 'button' | 'submit' | 'reset'
  children: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const Button = (props: Props) => {
  const {
    className,
    type = 'button',
    children,
    onClick,
  } = props

  return (
    <button type={type} onClick={onClick} className={`${className} ${styles.button}`}>
      {children}
    </button>
  )
}

export default Button
