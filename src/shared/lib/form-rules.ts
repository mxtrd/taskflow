type TextFieldRulesParams = {
  fieldLabel: string
  min: number
  max: number
}

export const createRequiredTrimmedTextRules = ({ fieldLabel, min, max }: TextFieldRulesParams) => ({
  required: `${fieldLabel} is required`,
  minLength: { value: min, message: `Minimum ${min} characters` },
  maxLength: { value: max, message: `Maximum ${max} characters` },
  validate: (value: string) => value.trim().length > 0 || `${fieldLabel} cannot be empty`,
})
