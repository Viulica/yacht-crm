import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formStyles, inputHandlers } from '@/lib/styles'

interface PriceFieldProps {
  currency: string
  price: string
  onCurrencyChange: (value: string) => void
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function PriceField({
  currency,
  price,
  onCurrencyChange,
  onPriceChange
}: PriceFieldProps) {
  return (
    <div>
      <label style={formStyles.label}>
        Price *
      </label>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-1">
          <Select value={currency} onValueChange={onCurrencyChange}>
            <SelectTrigger style={formStyles.select}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent 
              className="z-[9999]"
              style={{
                zIndex: 9999,
                backgroundColor: 'var(--white)',
                border: '1px solid var(--gray-200)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                minWidth: '120px'
              }}
            >
              <SelectItem value="EUR">EUR €</SelectItem>
              <SelectItem value="USD">USD $</SelectItem>
              <SelectItem value="GBP">GBP £</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            required
            value={price}
            onChange={onPriceChange}
            style={formStyles.input}
            placeholder="1250000"
            onFocus={inputHandlers.onFocus}
            onBlur={inputHandlers.onBlur}
          />
        </div>
      </div>
    </div>
  )
}
