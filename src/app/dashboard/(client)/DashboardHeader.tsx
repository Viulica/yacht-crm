"use client"

interface DashboardHeaderProps {
  userName: string
  userEmail: string
  onSignOut: (() => void) | null
}

export const DashboardHeader = ({ userName, userEmail, onSignOut }: DashboardHeaderProps) => {
  return (
    <header style={{ 
      background: 'var(--white)', 
      borderBottom: '1px solid var(--gray-200)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
    }}>
      <div className="yacht-container">
        <div className="yacht-flex-between py-6">
          {/* Logo */}
          <div>
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
          </div>
          
          {/* User Info & Sign Out */}
          <div className="text-right">
            <p style={{
              fontSize: '20px',
              fontWeight: '300',
              color: '#374151',
              letterSpacing: '0.5px',
              margin: 0
            }}>
              {userName || userEmail}
            </p>
            {onSignOut && (
              <button
                onClick={onSignOut}
                style={{ 
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-gold)',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  padding: 0,
                  letterSpacing: '0.3px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.7'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1'
                }}
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
