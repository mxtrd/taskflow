import type { FormEventHandler, InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import clsx from 'clsx'
import Button from '@/shared/ui/button'
import baseStyles from '@/app/styles/base.module.scss'
import styles from './EditForm.module.scss'

type EditFormProps = {
  mode?: 'input' | 'textarea'
  onSubmit: FormEventHandler<HTMLFormElement>
  onCancel: () => void
  disabled?: boolean
  error?: string
  saveLabel?: string
  cancelLabel?: string
  fieldClassName?: string
  formClassName?: string
  actionsClassName?: string
  registration?: UseFormRegisterReturn
  inputProps?: InputHTMLAttributes<HTMLInputElement>
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>
}

const EditForm = (props: EditFormProps) => {
  const {
    mode = 'input',
    onSubmit,
    onCancel,
    disabled = false,
    error,
    saveLabel = 'Save',
    cancelLabel = 'Cancel',
    fieldClassName,
    formClassName,
    actionsClassName,
    registration,
    inputProps,
    textareaProps,
  } = props

  return (
    <form className={clsx(styles.form, formClassName)} onSubmit={onSubmit}>
      <label className={clsx(styles.fieldLabel)}>
        {mode === 'textarea' ? (
          <textarea
            className={clsx(
              baseStyles.inputReset,
              baseStyles.fieldControl,
              error && baseStyles.fieldControlError,
              baseStyles.fieldControlTextarea,
              styles.field,
              styles.textarea,
              fieldClassName
            )}
            {...registration}
            {...textareaProps}
          />
        ) : (
          <input
            className={clsx(
              baseStyles.inputReset,
              baseStyles.fieldControl,
              error && baseStyles.fieldControlError,
              styles.field,
              fieldClassName
            )}
            {...registration}
            {...inputProps}
          />
        )}

        {error && <p className={clsx(baseStyles.fieldError, styles.fieldErrorAbsolute)}>{error}</p>}
      </label>

      <div className={clsx(styles.actions, actionsClassName)}>
        <Button className={styles.editButton} type='submit' disabled={disabled}>
          {saveLabel}
        </Button>
        <Button className={styles.editButton} type='button' variant='secondary' onClick={onCancel} disabled={disabled}>
          {cancelLabel}
        </Button>
      </div>
    </form>
  )
}

export default EditForm