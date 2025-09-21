import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formStyles } from '@/lib/styles'

interface ClientSelectFieldProps {
  label: string
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  options: { value: string; label: string }[]
}

export function ClientSelectField({
  label,
  value,
  onValueChange,
  placeholder,
  options
}: ClientSelectFieldProps) {
  return (
    <div>
      <label style={formStyles.label}>
        {label}
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger style={formStyles.select}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent 
          className="z-[9999]"
          style={{
            zIndex: 9999,
            backgroundColor: 'var(--white)',
            border: '1px solid var(--gray-200)',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            minWidth: '200px'
          }}
        >
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
