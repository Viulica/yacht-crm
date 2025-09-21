import { formStyles, inputHandlers } from '@/lib/styles'

interface ClientFormFieldProps {
  id: string
  name: string
  label: string
  type?: string
  required?: boolean
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  rows?: number
}

export function ClientFormField({
  id,
  name,
  label,
  type = 'text',
  required = false,
  placeholder,
  value,
  onChange,
  rows
}: ClientFormFieldProps) {
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
