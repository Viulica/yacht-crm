import { formStyles, inputHandlers } from '@/lib/styles'

interface FormFieldProps {
  id: string
  name: string
  label: string
  type?: string
  required?: boolean
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  min?: string | number
  max?: string | number
  step?: string
  rows?: number
}

export function FormField({
  id,
  name,
  label,
  type = 'text',
  required = false,
  placeholder,
  value,
  onChange,
  min,
  max,
  step,
  rows
}: FormFieldProps) {
  const isTextarea = type === 'textarea'
  
  return (
    <div>
      <label htmlFor={id} style={formStyles.label}>
        {label} {required && '*'}
      </label>
      {isTextarea ? (
        <textarea
          id={id}
          name={name}
          rows={rows || 4}
          value={value}
          onChange={onChange}
          style={formStyles.textarea}
          placeholder={placeholder}
          onFocus={inputHandlers.onFocus}
          onBlur={inputHandlers.onBlur}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          style={formStyles.input}
          placeholder={placeholder}
          onFocus={inputHandlers.onFocus}
          onBlur={inputHandlers.onBlur}
        />
      )}
    </div>
  )
}
