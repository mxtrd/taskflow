import clsx from 'clsx'
import type { InputHTMLAttributes, ReactNode } from 'react'
import styles from './CustomCheckbox.module.scss'

type CustomCheckboxProps = {
  label?: ReactNode
  rootClassName?: string
  labelClassName?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

const CustomCheckbox = (props: CustomCheckboxProps) => {
  const { 
    label, 
    rootClassName, 
    labelClassName, 
    className, 
    ...restProps 
  } = props

  return (
    <label className={clsx(styles.customCheckbox, rootClassName)}>
      <input
        type='checkbox'
        className={clsx(styles.customCheckboxInput, className)}
        {...restProps}
      />
      {label && <span className={clsx(styles.customCheckboxText, labelClassName)}>{label}</span>}
    </label>
  )
}

export default CustomCheckbox