import clsx from 'clsx'
import type { MouseEventHandler, ReactNode } from 'react'
import styles from './Button.module.scss'

type ButtonVariant = 'primary' | 'secondary'

type Props = {
  className?: string
  variant?: ButtonVariant
  type?: 'button' | 'submit' | 'reset'
  children: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
}

const variantModifier: Record<ButtonVariant, string> = {
  primary: styles['button--primary'],
  secondary: styles['button--secondary'],
}

const Button = (props: Props) => {
  const {
    variant = 'primary',
    className,
    type = 'button',
    children,
    onClick,
    disabled,
  } = props

  return (
    <button
      className={clsx(styles.button, variantModifier[variant], className)}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
