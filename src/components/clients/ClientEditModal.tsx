import { useState, useEffect } from 'react'
import { Client } from '@/lib/schemas/client'
import { formStyles, modalStyles, buttonStyles, inputHandlers } from '@/lib/styles'

interface ClientEditModalProps {
  isOpen: boolean
  client: Client | null
  onClose: () => void
  onSave: (clientId: string, updates: Partial<Client>) => Promise<void>
}

export const ClientEditModal = ({ isOpen, client, onClose, onSave }: ClientEditModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    state: '',
    budget: 0,
    modelInterest: '',
    toContact: '',
    toContactText: ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (client && isOpen) {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        state: client.state || '',
        budget: client.budget || 0,
        modelInterest: client.modelInterest || '',
        toContact: client.toContact ? new Date(client.toContact).toISOString().split('T')[0] : '',
        toContactText: client.toContactText || ''
      })
      setError('')
    }
  }, [client, isOpen])

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    if (!client) return
    
    setIsSaving(true)
    setError('')
    
    try {
      const updateData = {
        ...formData,
        toContact: formData.toContact ? new Date(formData.toContact) : undefined,
        toContactText: formData.toContactText || undefined
      }
      await onSave(client.id, updateData)
      onClose()
    } catch (err) {
      setError('Failed to update client. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen || !client) return null

  return (
    <>
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={modalStyles.overlay}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
        style={modalStyles.container}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        {/* Header */}
        <div 
          className="flex-shrink-0"
          style={modalStyles.header}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#1F2937',
                margin: 0
              }}>
                Edit Client
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                margin: '4px 0 0 0'
              }}>
                Update client information
              </p>
            </div>
            <button
              onClick={onClose}
              style={modalStyles.closeButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--gray-100)'
                e.currentTarget.style.color = '#374151'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#6B7280'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={modalStyles.content}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Name */}
            <div className="md:col-span-2">
              <label style={formStyles.label}>
                Client Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                style={formStyles.input}
                onFocus={inputHandlers.onFocus}
                onBlur={inputHandlers.onBlur}
                placeholder="Enter client's full name"
              />
            </div>

            {/* Email */}
            <div>
              <label style={formStyles.label}>
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                style={formStyles.input}
                onFocus={inputHandlers.onFocus}
                onBlur={inputHandlers.onBlur}
                placeholder="client@email.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label style={formStyles.label}>
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                style={formStyles.input}
                onFocus={inputHandlers.onFocus}
                onBlur={inputHandlers.onBlur}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {/* Company */}
            <div>
              <label style={formStyles.label}>
                Company
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                style={formStyles.input}
                onFocus={inputHandlers.onFocus}
                onBlur={inputHandlers.onBlur}
                placeholder="Client's company"
              />
            </div>

            {/* Budget */}
            <div>
              <label style={formStyles.label}>
                Budget (EUR)
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
                style={formStyles.input}
                onFocus={inputHandlers.onFocus}
                onBlur={inputHandlers.onBlur}
                placeholder="1500000"
              />
            </div>

            {/* Model Interest */}
            <div className="md:col-span-2">
              <label style={formStyles.label}>
                Boat Interest
              </label>
              <input
                type="text"
                value={formData.modelInterest}
                onChange={(e) => handleInputChange('modelInterest', e.target.value)}
                style={formStyles.input}
                onFocus={inputHandlers.onFocus}
                onBlur={inputHandlers.onBlur}
                placeholder="e.g., Motor Yacht, Sailing Yacht, Superyacht"
              />
            </div>

            {/* Reminder Section */}
            <div className="md:col-span-2">
              <div style={{
                borderTop: '1px solid var(--gray-200)',
                paddingTop: '24px',
                marginTop: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1F2937',
                    margin: 0
                  }}>
                    Reminder
                  </h3>
                  {formData.toContact && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          toContact: '',
                          toContactText: ''
                        }))
                      }}
                      style={buttonStyles.danger}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FEE2E2'
                        e.currentTarget.style.borderColor = '#FCA5A5'
                        e.currentTarget.style.color = '#B91C1C'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FEF2F2'
                        e.currentTarget.style.borderColor = '#FECACA'
                        e.currentTarget.style.color = '#DC2626'
                      }}
                      title="Delete reminder"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete reminder
                    </button>
                  )}
                </div>
                
                {/* Reminder Date */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={formStyles.label}>
                    Reminder Date
                  </label>
                  <input
                    type="date"
                    value={formData.toContact}
                    onChange={(e) => handleInputChange('toContact', e.target.value)}
                    style={formStyles.input}
                    onFocus={inputHandlers.onFocus}
                    onBlur={inputHandlers.onBlur}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Reminder Note */}
                <div style={{ marginTop: '16px' }}>
                  <label style={formStyles.label}>
                    Reminder Note
                  </label>
                  <textarea
                    value={formData.toContactText}
                    onChange={(e) => handleInputChange('toContactText', e.target.value)}
                    style={{
                      ...formStyles.textarea,
                      minHeight: '80px'
                    }}
                    onFocus={inputHandlers.onFocus}
                    onBlur={inputHandlers.onBlur}
                    placeholder="What needs to be done? (e.g., Follow up on yacht preferences, Send proposal, Schedule viewing)"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={modalStyles.footer}>
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                ...buttonStyles.primary,
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.background = 'var(--accent-gold)'
                  e.currentTarget.style.opacity = '0.9'
                }
              }}
              onMouseLeave={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.background = 'var(--accent-gold)'
                  e.currentTarget.style.opacity = '1'
                }
              }}
            >
              {isSaving ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid transparent',
                    borderTop: '2px solid currentColor',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
