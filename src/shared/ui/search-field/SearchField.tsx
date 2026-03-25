import type { ChangeEventHandler } from 'react'
import styles from './SearchField.module.scss'

type Props = {
  value: string
  name: string
  onChange: ChangeEventHandler<HTMLInputElement>
  placeholder: string,
  autoComplete?: string
}

const SearchField = ({ value, name, onChange, placeholder, autoComplete = 'off' }: Props) => {
  return (
    <input
      className={styles.root}
      name={name}
      type='search'
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
    />
  )
}

export default SearchField