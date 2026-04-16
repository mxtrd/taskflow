import clsx from 'clsx'
import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import styles from './CustomSelect.module.scss'

type CustomSelectOption = {
  value: string
  label: string
}

type CustomSelectProps = {
  id?: string
  name?: string
  label?: string
  placeholder?: string
  options: CustomSelectOption[]
  value?: string
  onChange: (value: string) => void
  onBlur?: () => void
  disabled?: boolean
  hasError?: boolean
  rootClassName?: string
}

const CustomSelect = ({
  id,
  name,
  label = 'Select field',
  placeholder = 'Choose an option',
  options,
  value,
  onChange,
  onBlur,
  disabled = false,
  hasError = false,
  rootClassName,
}: CustomSelectProps) => {
  const reactId = useId()
  const selectId = id ?? `custom-select-${reactId}`
  const listId = `custom-select-list-${reactId}`
  const labelId = `custom-select-label-${reactId}`
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const selectedIndex = useMemo(
    () => options.findIndex((option) => option.value === value),
    [options, value]
  )

  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined

  const close = useCallback(() => {
    setIsOpen(false)
    setActiveIndex(-1)
  }, [])

  const open = useCallback(() => {
    if (disabled || options.length === 0) return
    setIsOpen(true)
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
  }, [disabled, options.length, selectedIndex])

  const selectByIndex = useCallback(
    (index: number) => {
      const option = options[index]
      if (!option) return
      onChange(option.value)
      close()
    },
    [close, onChange, options]
  )

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const root = rootRef.current
      if (!root) return
      if (!root.contains(event.target as Node)) {
        close()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [close])

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const maxIndex = options.length - 1

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!isOpen) {
          open()
          return
        }
        setActiveIndex((prev) => (prev < 0 ? 0 : Math.min(prev + 1, maxIndex)))
        break
      case 'ArrowUp':
        event.preventDefault()
        if (!isOpen) {
          open()
          return
        }
        setActiveIndex((prev) => (prev < 0 ? maxIndex : Math.max(prev - 1, 0)))
        break
      case 'Home':
        event.preventDefault()
        open()
        setActiveIndex(0)
        break
      case 'End':
        event.preventDefault()
        open()
        setActiveIndex(maxIndex)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (!isOpen) {
          open()
        } else if (activeIndex >= 0) {
          selectByIndex(activeIndex)
        }
        break
      case 'Escape':
        event.preventDefault()
        close()
        break
      case 'Tab':
        close()
        onBlur?.()
        break
    }
  }

  return (
    <div
      ref={rootRef}
      className={clsx(styles.wrapper, rootClassName)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          close()
          onBlur?.()
        }
      }}
    >
      <span id={labelId} className={styles.srOnly}>
        {label}
      </span>

      <input
        id={selectId}
        className={styles.srOnly}
        name={name}
        value={value ?? ''}
        readOnly
        tabIndex={-1}
        aria-hidden='true'
      />

      <div className={clsx(styles.select, isOpen && styles.selectOpen)}>
        <button
          type='button'
          className={clsx(styles.trigger, disabled && styles.triggerDisabled, hasError && styles.triggerError)}
          aria-haspopup='listbox'
          aria-expanded={isOpen}
          aria-controls={listId}
          aria-labelledby={labelId}
          aria-activedescendant={isOpen && activeIndex >= 0 ? `${selectId}-option-${activeIndex}` : undefined}
          aria-invalid={hasError || undefined}
          onClick={() => (isOpen ? close() : open())}
          onKeyDown={handleTriggerKeyDown}
          disabled={disabled}
        >
          <span className={clsx(styles.value, !selectedOption && styles.placeholder)}>
            {selectedOption?.label ?? placeholder}
          </span>
          <span className={styles.icon} aria-hidden='true'>
            <svg viewBox='0 0 24 24' focusable='false'>
              <path d='M18.71 8.21a1 1 0 0 0-1.42 0l-4.58 4.58a1 1 0 0 1-1.42 0L6.71 8.21a1 1 0 0 0-1.42 0 1 1 0 0 0 0 1.41l4.59 4.59a3 3 0 0 0 4.24 0l4.59-4.59a1 1 0 0 0 0-1.41Z' />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div className={styles.list} id={listId} role='listbox' aria-labelledby={labelId} tabIndex={-1}>
            {options.map((option, index) => {
              const isSelected = option.value === value
              const isHighlighted = index === activeIndex

              return (
                <button
                  key={option.value}
                  id={`${selectId}-option-${index}`}
                  type='button'
                  role='option'
                  className={clsx(
                    styles.option,
                    isHighlighted && styles.optionHighlighted,
                    isSelected && styles.optionSelected
                  )}
                  aria-selected={isSelected}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectByIndex(index)}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export type { CustomSelectOption, CustomSelectProps }
export default CustomSelect
