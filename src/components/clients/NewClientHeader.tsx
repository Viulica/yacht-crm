import Link from 'next/link'
import { cardStyles } from '@/lib/styles'

export function NewClientHeader() {
  return (
    <header style={{ 
      ...cardStyles.container,
      borderBottom: '1px solid var(--gray-200)',
      borderRadius: '0',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
    }}>
      <div className="yacht-container">
        <div className="yacht-flex-between py-6">
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <h1 style={{ 
              fontSize: '28px',
              fontWeight: '300',
              color: '#374151',
              letterSpacing: '0.5px',
              margin: 0
            }}>
              Yacht CRM
            </h1>
            <p className="text-sm yacht-text-luxury">Professional Brokerage Platform</p>
          </Link>
          
          <Link 
            href="/dashboard"
            style={{
              color: '#6B7280',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </header>
  )
}
