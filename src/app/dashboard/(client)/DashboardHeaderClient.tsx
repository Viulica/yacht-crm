"use client"

import { useAuth } from "@/components/SessionProvider"

interface DashboardHeaderClientProps {
  userName: string
  userEmail: string
}

export function DashboardHeaderClient({ userName, userEmail }: DashboardHeaderClientProps) {
  const { signOut } = useAuth()

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
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px',
              marginBottom: '8px'
            }}>
              {/* Avatar Placeholder */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-navy)',
                fontSize: '16px',
                fontWeight: '600',
                flexShrink: 0
              }}>
                {(() => {
                  const name = userName || userEmail || '';
                  const parts = name.split(' ');
                  if (parts.length >= 2) {
                    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
                  }
                  return name.charAt(0).toUpperCase() || 'U';
                })()}
              </div>
              
              <p style={{
                fontSize: '20px',
                fontWeight: '300',
                color: '#374151',
                letterSpacing: '0.5px',
                margin: 0
              }}>
                {userName || userEmail}
              </p>
            </div>
            
            <button
              onClick={signOut}
              style={{ 
                background: 'none',
                border: 'none',
                color: 'var(--accent-gold)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                padding: 0,
                letterSpacing: '0.3px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginLeft: 'auto'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.7'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1'
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
