import { Reminder } from '@/lib/schemas/dashboard'

// Shared currency formatting function
export const formatCurrency = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined) return 'Not specified'
  
  let numberValue: number
  
  if (typeof value === 'string') {
    // Extract number from price string (e.g., "EUR 1250000" -> 1250000)
    const priceMatch = value.match(/[\d,]+/g)
    if (priceMatch) {
      numberValue = parseInt(priceMatch.join('').replace(/,/g, ''))
    } else {
      return value // Return original string if no number found
    }
  } else {
    numberValue = value
  }
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numberValue) + ' €'
}

export const formatPortfolioValue = (value: number): string => {
  if (value === 0) return '0 €'
  return formatCurrency(value)
}

export const formatReminderDate = (dateString: Date | null): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const reminderDate = new Date(date)
  reminderDate.setHours(0, 0, 0, 0)
  
  const diffTime = reminderDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'
  if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}
