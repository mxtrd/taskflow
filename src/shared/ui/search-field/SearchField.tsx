import type { ChangeEventHandler } from 'react'
import baseStyles from '@/app/styles/base.module.scss'
import styles from './SearchField.module.scss'

type Props = {
  type: string
  value?: string
  name: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  placeholder: string
  autoComplete?: string
}

const SearchField = (props: Props) => {
  const {
    type,
    value,
    name,
    onChange,
    placeholder,
    autoComplete = 'off'
  } = props

  return (
    <label>
      <input
        className={`${baseStyles.inputReset} ${baseStyles.fieldControl} ${styles.input}`}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
    </label>
  )
}

export default SearchField
