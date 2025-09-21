import { Client } from "@/lib/schemas/client"
import { Calendar } from "lucide-react"
import { buttonStyles } from '@/lib/styles'
import { formatCurrency } from '@/lib/dashboard-utils'

interface ClientCardProps {
  client: Client
  index: number
  totalCount: number
  onEditClient: (client: Client) => void
}

export const ClientCard = ({ client, index, totalCount, onEditClient }: ClientCardProps) => {

  const formatBudget = (budget: number | null | undefined) => {
    return formatCurrency(budget)
  }

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatReminderDate = (date: Date | string | null) => {
    if (!date) return null
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const today = new Date()
    const diffTime = dateObj.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays === -1) return 'Yesterday'
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`
    if (diffDays <= 7) return `In ${diffDays} days`
    
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="grid grid-cols-6 gap-4 items-start py-4 hover:bg-gray-50 transition-all duration-200">
      {/* Client Name */}
      <div className="min-w-0">
        <div className="font-semibold text-gray-900 text-sm mb-1 truncate">
          {client.name || 'Unnamed Client'}
        </div>
        {client.modelInterest && (
          <div className="text-xs text-gray-500 truncate">
            Interested in: {client.modelInterest}
          </div>
        )}
      </div>

      {/* Contact */}
      <div className="min-w-0">
        {client.email && (
          <div className="text-sm text-gray-900 mb-1 truncate">
            {client.email}
          </div>
        )}
        {client.phone && (
          <div className="text-xs text-gray-500 truncate">
            {client.phone}
          </div>
        )}
      </div>

      {/* Company */}
      <div className="min-w-0">
        <div className="text-sm text-gray-900 truncate">
          {client.state || '-'}
        </div>
      </div>

      {/* Budget */}
      <div className="min-w-0">
        <div className="text-sm font-medium text-yellow-600">
          {formatBudget(client.budget)}
        </div>
      </div>

      {/* Reminder */}
      <div className="min-w-0">
        {client.toContact ? (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium" style={{
            background: new Date(client.toContact) < new Date() 
              ? '#FEF2F2' 
              : new Date(client.toContact).toDateString() === new Date().toDateString()
              ? '#FEF3C7'
              : '#EFF6FF',
            color: new Date(client.toContact) < new Date() 
              ? '#DC2626' 
              : new Date(client.toContact).toDateString() === new Date().toDateString()
              ? '#D97706'
              : '#2563EB',
            border: new Date(client.toContact) < new Date() 
              ? '1px solid #FECACA' 
              : new Date(client.toContact).toDateString() === new Date().toDateString()
              ? '#FDE68A'
              : '#DBEAFE'
          }}>
            <Calendar className="w-3 h-3" />
            {formatReminderDate(client.toContact)}
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium" style={{
            background: '#F9FAFB',
            color: '#6B7280',
            border: '1px solid #E5E7EB'
          }}>
            <Calendar className="w-3 h-3" />
            No reminder
          </div>
        )}
      </div>

      {/* Actions Column - Far Right */}
      <div className="min-w-0 flex flex-col items-end space-y-2">
        <button
          onClick={() => onEditClient(client)}
          style={{
            ...buttonStyles.secondary,
            padding: '8px 16px',
            fontSize: '14px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-gold)'
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.08)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--gray-200)'
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.04)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
        
        <div className="text-xs text-gray-400">
          Added {formatDate(client.createdAt)}
        </div>
      </div>
    </div>
  )
}
