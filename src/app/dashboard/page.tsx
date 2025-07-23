"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/SessionProvider"

interface ReminderClient {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  toContact: Date | null
  toContactText: string | null
  modelInterest: string | null
}

interface RemindersData {
  overdue: ReminderClient[]
  today: ReminderClient[]
  tomorrow: ReminderClient[]
  thisWeek: ReminderClient[]
  upcoming: ReminderClient[]
}

export default function Dashboard() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [clientCount, setClientCount] = useState(0)
  const [boatCount, setBoatCount] = useState(0)
  const [portfolioValue, setPortfolioValue] = useState(0)
  const [reminders, setReminders] = useState<RemindersData>({
    overdue: [],
    today: [],
    tomorrow: [],
    thisWeek: [],
    upcoming: []
  })
  const [isLoadingReminders, setIsLoadingReminders] = useState(true)

  useEffect(() => {
    if (loading) return
    
    if (!user) {
      router.push("/auth/signin")
      return
    }

    // ✅ PARALLEL DATA FETCHING - even faster!
    Promise.all([
      fetchCounts(),
      fetchReminders()
    ]).catch(error => {
      console.error('Error fetching dashboard data:', error)
    })
  }, [user, loading, router])

  const fetchCounts = async () => {
    try {
      // ✅ PARALLEL API CALLS - much faster!
      const [clientsResponse, boatsResponse] = await Promise.all([
        fetch('/api/clients'),
        fetch('/api/boats')
      ])

      // Process clients
      if (clientsResponse.ok) {
        const clientsData = await clientsResponse.json()
        setClientCount(clientsData.clients?.length || 0)
      }

      // Process boats and calculate portfolio value
      if (boatsResponse.ok) {
        const boatsData = await boatsResponse.json()
        const boats = boatsData.boats || []
        setBoatCount(boats.length)
        
        // Calculate total portfolio value
        const totalValue = boats.reduce((sum: number, boat: { price?: string }) => {
          if (boat.price) {
            // Extract number from price string (e.g., "EUR 1250000" -> 1250000)
            const priceMatch = boat.price.match(/[\d,]+/g)
            if (priceMatch) {
              const price = parseInt(priceMatch.join('').replace(/,/g, ''))
              return sum + price
            }
          }
          return sum
        }, 0)
        
        setPortfolioValue(totalValue)
      }
    } catch (_error) {
      console.error('Error fetching counts:', _error)
    }
  }

  const fetchReminders = async () => {
    try {
      const response = await fetch('/api/reminders')
      if (response.ok) {
        const data = await response.json()
        setReminders(data.reminders)
      }
    } catch (_error) {
      console.error('Error fetching reminders:', _error)
    } finally {
      setIsLoadingReminders(false)
    }
  }

  const formatPortfolioValue = (value: number) => {
    if (value === 0) return '€0'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatReminderDate = (dateString: Date | null) => {
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

  const getPriorityReminders = () => {
    const priorityList: (ReminderClient & { priority: string })[] = []
    
    // Add overdue reminders first (high priority)
    reminders.overdue.forEach(client => {
      priorityList.push({ ...client, priority: 'overdue' })
    })
    
    // Add today's reminders
    reminders.today.forEach(client => {
      priorityList.push({ ...client, priority: 'today' })
    })
    
    // Add tomorrow's reminders
    reminders.tomorrow.forEach(client => {
      priorityList.push({ ...client, priority: 'tomorrow' })
    })
    
    // Add this week's reminders (up to 5 total)
    const remaining = 5 - priorityList.length
    if (remaining > 0) {
      reminders.thisWeek.slice(0, remaining).forEach(client => {
        priorityList.push({ ...client, priority: 'thisWeek' })
      })
    }
    
    return priorityList.slice(0, 5) // Limit to 5 items max
  }

  if (loading) {
    return (
      <div className="min-h-screen yacht-flex-center" style={{ background: 'linear-gradient(135deg, #FEFEFE 0%, #F4F6F8 100%)' }}>
        <div className="text-center">
          <div className="yacht-float mb-4">
            <div className="text-6xl">⚓</div>
          </div>
          <p className="yacht-heading-md mb-4">Loading your exclusive dashboard...</p>
          <div className="yacht-shimmer w-32 h-2 rounded-full mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const priorityReminders = getPriorityReminders()
  const totalActiveReminders = reminders.overdue.length + reminders.today.length + reminders.tomorrow.length + reminders.thisWeek.length + reminders.upcoming.length

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FEFEFE 0%, #F4F6F8 100%)' }}>
      {/* Elegant Header */}
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
                  {user.user_metadata?.name || user.email}
                </p>
              <button
                onClick={() => signOut()}
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="yacht-container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        {/* Upcoming Reminders - Top Priority */}
        <div style={{ 
          background: 'var(--white)', 
          borderRadius: '12px', 
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid var(--gray-200)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{ 
              fontSize: '24px',
              fontWeight: '600',
              color: '#1F2937',
              margin: 0
            }}>
              Upcoming Reminders
              {totalActiveReminders > 0 && (
                <span style={{
                  marginLeft: '12px',
                  background: reminders.overdue.length > 0 ? '#DC2626' : '#059669',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '4px 8px',
                  borderRadius: '12px'
                }}>
                  {totalActiveReminders}
                </span>
              )}
              </h2>
            {totalActiveReminders > 0 && (
              <Link 
                href="/dashboard/clients"
                style={{
                  color: 'var(--accent-gold)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.7'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1'
                }}
              >
                View All Clients →
              </Link>
            )}
          </div>

          {isLoadingReminders ? (
            <div className="text-center py-8">
              <div style={{ fontSize: '14px', color: '#6B7280' }}>Loading reminders...</div>
            </div>
          ) : priorityReminders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4" style={{ opacity: '0.3' }}>📅</div>
              <p style={{ 
                fontSize: '16px',
                color: '#6B7280',
                margin: '0 0 8px 0'
              }}>
                No upcoming reminders
              </p>
              <p style={{ 
                fontSize: '14px',
                color: '#9CA3AF'
              }}>
                Client follow-ups you set will appear here
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {priorityReminders.map((reminder, index) => (
                <div 
                  key={`${reminder.id}-${index}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    border: '1px solid var(--gray-200)',
                    borderRadius: '8px',
                    background: reminder.priority === 'overdue' ? '#FEF2F2' : 'var(--white)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      marginBottom: '4px'
                    }}>
                      <h4 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1F2937',
                        margin: 0
                      }}>
                        {reminder.name || 'Unnamed Client'}
                      </h4>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: reminder.priority === 'overdue' ? '#DC2626' : '#059669',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: reminder.priority === 'overdue' ? '#FECACA' : '#D1FAE5'
                      }}>
                        {formatReminderDate(reminder.toContact)}
                      </span>
                    </div>
                    
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#6B7280',
                      marginBottom: '4px'
                    }}>
                      {reminder.toContactText || 'Follow up required'}
                    </div>
                    
                    <div style={{ 
                      fontSize: '13px', 
                      color: '#9CA3AF'
                    }}>
                      {reminder.email}
                      {reminder.phone && ` • ${reminder.phone}`}
                      {reminder.modelInterest && ` • Interested in: ${reminder.modelInterest}`}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link
                      href={`mailto:${reminder.email}`}
                      style={{
                        background: 'var(--white)',
                        border: '1px solid var(--gray-300)',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#6B7280',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--accent-gold)'
                        e.currentTarget.style.color = 'var(--accent-gold)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--gray-300)'
                        e.currentTarget.style.color = '#6B7280'
                      }}
                    >
                      ✉️ Email
                    </Link>
                    
                    {reminder.phone && (
                      <Link
                        href={`tel:${reminder.phone}`}
                        style={{
                          background: 'var(--accent-gold)',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: 'var(--primary-navy)',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)'
                          e.currentTarget.style.boxShadow = '0 4px 8px rgba(212, 165, 116, 0.3)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      >
                        📞 Call
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
          
        {/* Statistics Overview */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ 
            fontSize: '18px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '16px'
          }}>
            Overview
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div style={{ 
              background: 'var(--white)', 
              border: '1px solid var(--gray-200)',
              borderRadius: '8px', 
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>👥</div>
              <p style={{ 
                fontSize: '14px',
                fontWeight: '500',
                color: '#6B7280',
                margin: '0 0 4px 0'
              }}>
                Total Clients
              </p>
              <p style={{ 
                fontSize: '24px',
                fontWeight: '600',
                color: '#1F2937',
                margin: 0
              }}>
                {clientCount}
              </p>
            </div>
            
            <div style={{ 
              background: 'var(--white)', 
              border: '1px solid var(--gray-200)',
              borderRadius: '8px', 
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>🛥️</div>
              <p style={{ 
                fontSize: '14px',
                fontWeight: '500',
                color: '#6B7280',
                margin: '0 0 4px 0'
              }}>
                Active Boats
              </p>
              <p style={{ 
                fontSize: '24px',
                fontWeight: '600',
                color: '#1F2937',
                margin: 0
              }}>
                {boatCount}
              </p>
            </div>
            
            <div style={{ 
              background: 'var(--white)', 
              border: '1px solid var(--gray-200)',
              borderRadius: '8px', 
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>⏰</div>
              <p style={{ 
                fontSize: '14px',
                fontWeight: '500',
                color: '#6B7280',
                margin: '0 0 4px 0'
              }}>
                Active Reminders
              </p>
              <p style={{ 
                fontSize: '24px',
                fontWeight: '600',
                color: totalActiveReminders > 0 ? 'var(--accent-gold)' : '#1F2937',
                margin: 0
              }}>
                {totalActiveReminders}
              </p>
            </div>
            
            <div style={{ 
              background: 'var(--white)', 
              border: '1px solid var(--gray-200)',
              borderRadius: '8px', 
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>💰</div>
              <p style={{ 
                fontSize: '14px',
                fontWeight: '500',
                color: '#6B7280',
                margin: '0 0 4px 0'
              }}>
                Total Portfolio
              </p>
              <p style={{ 
                fontSize: '24px',
                fontWeight: '600',
                color: 'var(--accent-gold)',
                margin: 0
              }}>
                {formatPortfolioValue(portfolioValue)}
              </p>
            </div>
          </div>
        </div>

          {/* Quick Actions */}
        <div style={{ 
          background: 'var(--white)', 
          borderRadius: '12px', 
          padding: '32px',
          border: '1px solid var(--gray-200)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
        }}>
          <h3 style={{ 
            fontSize: '18px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '24px'
          }}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                href="/dashboard/clients/new"
              style={{
                display: 'block',
                background: 'var(--white)',
                border: '2px solid var(--gray-200)',
                borderRadius: '8px',
                padding: '20px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-gold)'
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--gray-200)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>👤</div>
              <h4 style={{ 
                fontSize: '16px',
                fontWeight: '600',
                color: '#1F2937',
                margin: '0 0 8px 0'
              }}>
                Add New Client
              </h4>
              <p style={{ 
                fontSize: '14px',
                color: '#6B7280',
                margin: 0
              }}>
                Register a new client to your portfolio
              </p>
              </Link>
              
              <Link 
                href="/dashboard/boats/new"
              style={{
                display: 'block',
                background: 'var(--white)',
                border: '2px solid var(--gray-200)',
                borderRadius: '8px',
                padding: '20px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-gold)'
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--gray-200)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>🛥️</div>
              <h4 style={{ 
                fontSize: '16px',
                fontWeight: '600',
                color: '#1F2937',
                margin: '0 0 8px 0'
              }}>
                Add New Boat
              </h4>
              <p style={{ 
                fontSize: '14px',
                color: '#6B7280',
                margin: 0
              }}>
                List a new yacht in your inventory
              </p>
            </Link>
                </div>
              
          <div className="grid grid-cols-2 gap-4" style={{ marginTop: '16px' }}>
                <Link 
                  href="/dashboard/clients"
                  style={{ 
                display: 'block',
                background: 'transparent',
                border: '1px solid var(--gray-300)',
                borderRadius: '6px',
                padding: '12px 16px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
                  }}
                  onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F9FAFB'
                e.currentTarget.style.borderColor = '#D1D5DB'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'var(--gray-300)'
                  }}
                >
              View All Clients
                </Link>
                
                <Link 
                  href="/dashboard/boats"
                  style={{ 
                display: 'block',
                background: 'transparent',
                border: '1px solid var(--gray-300)',
                borderRadius: '6px',
                padding: '12px 16px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
                  }}
                  onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F9FAFB'
                e.currentTarget.style.borderColor = '#D1D5DB'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'var(--gray-300)'
                  }}
                >
              View All Boats
                </Link>
          </div>
        </div>
      </main>
    </div>
  )
} 