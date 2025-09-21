import Link from "next/link"

interface EmptyStateProps {
  icon: string
  title: string
  description: string
  actionButton?: {
    href: string
    label: string
    icon: string
  }
}

export const EmptyState = ({ icon, title, description, actionButton }: EmptyStateProps) => {
  return (
    <div className="text-center py-16" style={{ padding: '48px' }}>
      <div className="text-6xl mb-6" style={{ opacity: '0.3' }}>{icon}</div>
      <h3 style={{ 
        fontSize: '24px',
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: '12px'
      }}>
        {title}
      </h3>
      <p style={{ 
        fontSize: '16px',
        color: '#6B7280',
        marginBottom: '24px'
      }}>
        {description}
      </p>
      {actionButton && (
        <Link 
          href={actionButton.href}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'var(--white)',
            color: 'var(--accent-gold)',
            border: '2px solid var(--accent-gold)',
            borderRadius: '8px',
            padding: '12px 20px',
            fontWeight: '600',
            fontSize: '14px',
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--accent-gold)'
            e.currentTarget.style.color = 'var(--primary-navy)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--white)'
            e.currentTarget.style.color = 'var(--accent-gold)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <span style={{ marginRight: '8px' }}>{actionButton.icon}</span>
          {actionButton.label}
        </Link>
      )}
    </div>
  )
}
