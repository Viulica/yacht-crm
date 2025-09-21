"use client"

import { useClientForm } from '@/hooks/useClientForm'
import { 
  NewClientHeader, 
  ClientFormField, 
  ClientSelectField 
} from '@/components/clients'
import { formStyles } from '@/lib/styles'

const BUDGET_OPTIONS = [
  { value: 'under-500k', label: 'Under €500K' },
  { value: '500k-1m', label: '€500K - €1M' },
  { value: '1m-5m', label: '€1M - €5M' },
  { value: '5m-10m', label: '€5M - €10M' },
  { value: '10m-plus', label: '€10M+' }
]

const BOAT_TYPE_OPTIONS = [
  { value: 'motor-yacht', label: 'Motor Yacht' },
  { value: 'sailing-yacht', label: 'Sailing Yacht' },
  { value: 'catamaran', label: 'Catamaran' },
  { value: 'sport-boat', label: 'Sport Boat' },
  { value: 'superyacht', label: 'Superyacht' }
]

export default function NewClient() {
  const {
    formData,
    isLoading,
    error,
    handleChange,
    handleSelectChange,
    handleSubmit
  } = useClientForm()

  return (
    <div className="min-h-screen" style={{ background: 'var(--off-white)' }}>
      <NewClientHeader />

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center py-16">
        <div style={{ 
          background: 'var(--white)', 
          borderRadius: '12px', 
          padding: '48px',
          width: '100%',
          maxWidth: '600px',
          border: '1px solid var(--gray-200)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
        }}>
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-5xl mb-6">👤</div>
            <h2 style={{ 
              fontSize: '32px',
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: '8px'
            }}>
              Add New Client
            </h2>
            <p style={{ 
              fontSize: '16px',
              color: '#6B7280'
            }}>
              Register a new client to your <span className="yacht-text-luxury">exclusive</span> portfolio
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ClientFormField
                id="name"
                name="name"
                label="Full Name"
                required
                placeholder="Client's full name"
                value={formData.name || ''}
                onChange={handleChange}
              />

              <ClientFormField
                id="email"
                name="email"
                label="Email Address"
                type="email"
                required
                placeholder="client@email.com"
                value={formData.email || ''}
                onChange={handleChange}
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ClientFormField
                id="phone"
                name="phone"
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone || ''}
                onChange={handleChange}
              />

              <ClientFormField
                id="company"
                name="company"
                label="Company"
                placeholder="Client's company"
                value={formData.company || ''}
                onChange={handleChange}
              />
            </div>

            {/* Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ClientSelectField
                label="Budget Range"
                value={formData.budget || ''}
                onValueChange={(value) => handleSelectChange('budget', value)}
                placeholder="Select budget range"
                options={BUDGET_OPTIONS}
              />

              <ClientSelectField
                label="Preferred Boat Type"
                value={formData.boatType || ''}
                onValueChange={(value) => handleSelectChange('boatType', value)}
                placeholder="Select boat type"
                options={BOAT_TYPE_OPTIONS}
              />
            </div>

            {/* Notes */}
            <ClientFormField
              id="notes"
              name="notes"
              label="Notes"
              type="textarea"
              rows={4}
              placeholder="Additional notes about the client..."
              value={formData.notes || ''}
              onChange={handleChange}
            />

            {/* Error Display */}
            {error && (
              <div style={formStyles.errorAlert}>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{error}</div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                style={isLoading ? formStyles.buttonDisabled : formStyles.button}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 165, 116, 0.3)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-3"></div>
                    Creating Client...
                  </div>
                ) : (
                  'Create Client'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}