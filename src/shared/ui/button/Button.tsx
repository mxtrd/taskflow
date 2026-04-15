import clsx from 'clsx'
import type { MouseEventHandler, ReactNode } from 'react'
import { Link, type To } from 'react-router-dom'
import styles from './Button.module.scss'

type ButtonVariant = 'primary' | 'secondary'

type Props = {
  className?: string
  variant?: ButtonVariant
  type?: 'button' | 'submit' | 'reset'
  to?: To
  children: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
  disabled?: boolean
  isIconOnly?: boolean
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
    to,
    children,
    onClick,
    disabled,
    isIconOnly = false,
  } = props

  const classNames = clsx(
    styles.button,
    variantModifier[variant],
    isIconOnly && styles['button--icon-only'],
    className
  )

  if (to) {
    const handleLinkClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
      if (disabled) {
        event.preventDefault()
        return
      }

      if (onClick) {
        ;(onClick as MouseEventHandler<HTMLAnchorElement>)(event)
      }
    }

    return (
      <Link
        className={classNames}
        to={to}
        onClick={handleLinkClick}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      className={classNames}
      type={type}
      disabled={disabled}
      onClick={onClick as MouseEventHandler<HTMLButtonElement> | undefined}
    >
      {children}
    </button>
  )
}

export default Button
