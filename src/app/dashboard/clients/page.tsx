"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/SessionProvider"

interface Client {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  state: string | null
  modelInterest: string | null
  budget: number | null
  communication: string | null
  toContact: string | null
  toContactText: string | null
  createdAt: string
}

export default function ClientsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [reminderModal, setReminderModal] = useState<{
    isOpen: boolean
    client: Client | null
  }>({ isOpen: false, client: null })
  const [reminderForm, setReminderForm] = useState({
    date: '',
    note: ''
  })

  useEffect(() => {
    if (loading) return
    
    if (!user) {
      router.push("/auth/signin")
      return
    }

    fetchClients()
  }, [user, loading, router])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to fetch clients')
        return
      }

      setClients(data.clients || [])
    } catch {
      setError('An error occurred while fetching clients')
    } finally {
      setIsLoading(false)
    }
  }

  const formatBudget = (budget: number | null) => {
    if (!budget) return 'Not specified'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(budget)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatReminderDate = (dateString: string | null) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays === -1) return 'Yesterday'
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`
    if (diffDays <= 7) return `In ${diffDays} days`
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const openReminderModal = (client: Client) => {
    setReminderModal({ isOpen: true, client })
    setReminderForm({
      date: client.toContact ? new Date(client.toContact).toISOString().split('T')[0] : '',
      note: client.toContactText || ''
    })
  }

  const closeReminderModal = () => {
    setReminderModal({ isOpen: false, client: null })
    setReminderForm({ date: '', note: '' })
  }

  const saveReminder = async () => {
    if (!reminderModal.client) return

    try {
      const response = await fetch(`/api/clients/${reminderModal.client.id}/reminder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toContact: reminderForm.date ? new Date(reminderForm.date).toISOString() : null,
          toContactText: reminderForm.note || null
        })
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to save reminder')
        return
      }

      // Refresh clients list
      await fetchClients()
      closeReminderModal()
    } catch {
      setError('An error occurred while saving reminder')
    }
  }

  const removeReminder = async (clientId: string) => {
    try {
      const response = await fetch(`/api/clients/${clientId}/reminder`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to remove reminder')
        return
      }

      // Refresh clients list
      await fetchClients()
    } catch {
      setError('An error occurred while removing reminder')
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen yacht-flex-center" style={{ background: 'linear-gradient(135deg, #FEFEFE 0%, #F4F6F8 100%)' }}>
        <div className="text-center">
          <div className="text-4xl mb-4" style={{ opacity: '0.3' }}>👥</div>
          <p style={{ fontSize: '16px', color: '#6B7280' }}>Loading clients...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FEFEFE 0%, #F4F6F8 100%)' }}>
      {/* Header */}
      <header style={{ 
        background: 'var(--white)', 
        borderBottom: '1px solid var(--gray-200)',
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
            
            <div className="text-right">
              <p style={{
                fontSize: '15px',
                fontWeight: '500',
                color: '#374151',
                margin: '0 0 8px 0'
              }}>
                {user.user_metadata?.name || user.email}
              </p>
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
        </div>
      </header>

      {/* Main Content */}
      <main className="yacht-container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        {/* Page Header */}
        <div className="yacht-flex-between mb-8">
          <div>
            <h2 style={{ 
              fontSize: '32px',
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: '8px'
            }}>
              Clients ({clients.length})
            </h2>
            <p style={{ 
              fontSize: '16px',
              color: '#6B7280'
            }}>
              Manage your <span className="yacht-text-luxury">exclusive</span> client portfolio
            </p>
          </div>
          
          <Link 
            href="/dashboard/clients/new"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'var(--accent-gold)',
              color: 'var(--primary-navy)',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              fontWeight: '600',
              fontSize: '14px',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 165, 116, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <span style={{ marginRight: '8px' }}>👤</span>
            Add New Client
          </Link>
        </div>

        {error && (
          <div style={{ 
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            color: '#DC2626'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '500' }}>{error}</div>
          </div>
        )}

        {/* Clients List */}
        <div style={{ 
          background: 'var(--white)', 
          borderRadius: '12px', 
          border: '1px solid var(--gray-200)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
        }}>
          {clients.length === 0 ? (
            <div className="text-center py-16" style={{ padding: '48px' }}>
              <div className="text-6xl mb-6" style={{ opacity: '0.3' }}>👥</div>
              <h3 style={{ 
                fontSize: '24px',
                fontWeight: '600',
                color: '#1F2937',
                marginBottom: '12px'
              }}>
                No clients yet
              </h3>
              <p style={{ 
                fontSize: '16px',
                color: '#6B7280',
                marginBottom: '24px'
              }}>
                Start building your client portfolio by adding your first client
              </p>
              <Link 
                href="/dashboard/clients/new"
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
                <span style={{ marginRight: '8px' }}>👤</span>
                Add Your First Client
              </Link>
            </div>
          ) : (
            <div>
              {/* Table Header */}
              <div style={{
                borderBottom: '1px solid var(--gray-200)',
                padding: '20px 24px',
                background: '#F9FAFB',
                borderRadius: '12px 12px 0 0'
              }}>
                <div className="grid grid-cols-6 gap-4">
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#374151' }}>Client</div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#374151' }}>Contact</div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#374151' }}>Company</div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#374151' }}>Budget</div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#374151' }}>Next Action</div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#374151' }}>Added</div>
                </div>
              </div>

              {/* Table Body */}
              <div>
                {clients.map((client, index) => (
                  <div 
                    key={client.id}
                    style={{
                      borderBottom: index < clients.length - 1 ? '1px solid var(--gray-200)' : 'none',
                      padding: '20px 24px',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F9FAFB'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <div className="grid grid-cols-6 gap-4 items-center">
                      {/* Client Name */}
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '15px', color: '#1F2937', marginBottom: '4px' }}>
                          {client.name || 'Unnamed Client'}
                        </div>
                        {client.modelInterest && (
                          <div style={{ fontSize: '13px', color: '#6B7280' }}>
                            Interested in: {client.modelInterest}
                          </div>
                        )}
                      </div>

                      {/* Contact */}
                      <div>
                        {client.email && (
                          <div style={{ fontSize: '14px', color: '#1F2937', marginBottom: '2px' }}>
                            {client.email}
                          </div>
                        )}
                        {client.phone && (
                          <div style={{ fontSize: '13px', color: '#6B7280' }}>
                            {client.phone}
                          </div>
                        )}
                      </div>

                      {/* Company */}
                      <div style={{ fontSize: '14px', color: '#1F2937' }}>
                        {client.state || '-'}
                      </div>

                      {/* Budget */}
                      <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--accent-gold)' }}>
                        {formatBudget(client.budget)}
                      </div>

                      {/* Next Action / Reminder */}
                      <div>
                        {client.toContact ? (
                          <div>
                            <div style={{ 
                              fontSize: '13px', 
                              fontWeight: '500',
                              color: client.toContact && new Date(client.toContact) < new Date() ? '#DC2626' : '#059669',
                              marginBottom: '2px'
                            }}>
                              {formatReminderDate(client.toContact)}
                            </div>
                            {client.toContactText && (
                              <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>
                                {client.toContactText.length > 30 
                                  ? `${client.toContactText.substring(0, 30)}...` 
                                  : client.toContactText
                                }
                              </div>
                            )}
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button
                                onClick={() => openReminderModal(client)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#6B7280',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = '#F3F4F6'
                                  e.currentTarget.style.color = '#374151'
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'none'
                                  e.currentTarget.style.color = '#6B7280'
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => removeReminder(client.id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#DC2626',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = '#FEF2F2'
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'none'
                                }}
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => openReminderModal(client)}
                            style={{
                              background: 'var(--white)',
                              border: '1px solid var(--gray-300)',
                              borderRadius: '6px',
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: '500',
                              color: '#6B7280',
                              cursor: 'pointer',
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
                            + Add Reminder
                          </button>
                        )}
                      </div>

                      {/* Date Added */}
                      <div style={{ fontSize: '13px', color: '#6B7280' }}>
                        {formatDate(client.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reminder Modal */}
        {reminderModal.isOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'var(--white)',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1F2937',
                marginBottom: '8px'
              }}>
                Set Reminder
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                marginBottom: '24px'
              }}>
                {reminderModal.client?.name || 'Unnamed Client'}
              </p>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Reminder Date
                </label>
                <input
                  type="date"
                  value={reminderForm.date}
                  onChange={(e) => setReminderForm({ ...reminderForm, date: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'var(--white)',
                    border: '2px solid var(--gray-200)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '15px',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-gold)'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212, 165, 116, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--gray-200)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Action Note
                </label>
                <textarea
                  value={reminderForm.note}
                  onChange={(e) => setReminderForm({ ...reminderForm, note: e.target.value })}
                  placeholder="What needs to be done? (e.g., Follow up on yacht preferences, Send proposal, Schedule viewing)"
                  rows={3}
                  style={{
                    width: '100%',
                    background: 'var(--white)',
                    border: '2px solid var(--gray-200)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '15px',
                    transition: 'all 0.3s ease',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-gold)'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212, 165, 116, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--gray-200)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={closeReminderModal}
                  style={{
                    background: 'var(--white)',
                    border: '2px solid var(--gray-200)',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#6B7280',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#D1D5DB'
                    e.currentTarget.style.background = '#F9FAFB'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--gray-200)'
                    e.currentTarget.style.background = 'var(--white)'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={saveReminder}
                  style={{
                    background: 'var(--accent-gold)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--primary-navy)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 165, 116, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  Save Reminder
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 