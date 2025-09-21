import Link from "next/link"
import { Plus } from "lucide-react"

interface PageHeaderProps {
  title: string
  subtitle: string
  count?: number
  actionButton?: {
    href: string
    label: string
    icon: string
  }
}

export const PageHeader = ({ title, subtitle, count, actionButton }: PageHeaderProps) => {
  return (
    <div className="yacht-flex-between mb-8">
      <div>
        <h2 style={{ 
          fontSize: '36px',
          fontWeight: '700',
          color: '#1F2937',
          marginBottom: '6px',
          letterSpacing: '-0.025em'
        }}>
          {title} {count !== undefined && `(${count})`}
        </h2>
        <p style={{ 
          fontSize: '16px',
          color: '#6B7280',
          fontWeight: '400'
        }}>
          {subtitle}
        </p>
      </div>
      
      {actionButton && (
        <Link 
          href={actionButton.href}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'var(--white)',
            color: 'var(--primary-navy)',
            border: '1px solid var(--accent-gold)',
            borderRadius: '8px',
            padding: '12px 20px',
            fontWeight: '600',
            fontSize: '14px',
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--accent-gold)'
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 165, 116, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--white)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <Plus className="w-4 h-4" style={{ marginRight: '8px' }} />
          {actionButton.label}
        </Link>
      )}
    </div>
  )
}
