import { useState, useEffect } from 'react'
import { Boat } from '@/lib/schemas/boat'

interface BoatEditModalProps {
  isOpen: boolean
  boat: Boat | null
  onClose: () => void
  onSave: (boatId: string, updates: Partial<Boat>) => Promise<void>
}

export const BoatEditModal = ({ isOpen, boat, onClose, onSave }: BoatEditModalProps) => {
  const [formData, setFormData] = useState({
    model: '',
    brand: '',
    year: '',
    size: '',
    price: '',
    location: '',
    description: '',
    equipment: '',
    owner: '',
    engine: '',
    engineHours: ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (boat && isOpen) {
      setFormData({
        model: boat.model || '',
        brand: boat.brand || '',
        year: boat.year?.toString() || '',
        size: boat.size?.toString() || '',
        price: boat.price || '',
        location: boat.location || '',
        description: boat.description || '',
        equipment: boat.equipment || '',
        owner: boat.owner || '',
        engine: boat.engine || '',
        engineHours: boat.engineHours?.toString() || ''
      })
      setError('')
    }
  }, [boat, isOpen])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    if (!boat) return
    
    setIsSaving(true)
    setError('')
    
    try {
      // Convert form data to proper types for the API
      const updates = {
        model: formData.model || undefined,
        brand: formData.brand || undefined,
        year: formData.year ? parseInt(formData.year) : undefined,
        size: formData.size ? parseFloat(formData.size) : undefined,
        price: formData.price || undefined,
        location: formData.location || undefined,
        description: formData.description || undefined,
        equipment: formData.equipment || undefined,
        owner: formData.owner || undefined,
        engine: formData.engine || undefined,
        engineHours: formData.engineHours ? parseInt(formData.engineHours) : undefined
      }
      
      await onSave(boat.id, updates)
      onClose()
    } catch (err) {
      setError('Failed to update boat. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  const inputStyle = {
    width: '100%',
    background: 'var(--white)',
    border: '2px solid var(--gray-200)',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '15px',
    fontWeight: '400',
    transition: 'all 0.3s ease'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  }

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'var(--accent-gold)'
    e.target.style.boxShadow = '0 0 0 3px rgba(212, 165, 116, 0.1)'
    e.target.style.outline = 'none'
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'var(--gray-200)'
    e.target.style.boxShadow = 'none'
  }

  if (!isOpen || !boat) return null

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
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--gray-200)'
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        {/* Header */}
        <div 
          style={{
            background: 'var(--white)',
            borderBottom: '1px solid var(--gray-200)',
            padding: '24px 32px'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#1F2937',
                margin: 0
              }}>
                Edit Boat
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#6B7280',
                margin: '4px 0 0 0'
              }}>
                Update boat information
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#6B7280',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '6px',
                transition: 'all 0.2s ease'
              }}
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
        <div className="p-8 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Model */}
            <div className="md:col-span-2">
              <label style={labelStyle}>
                Model *
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                style={inputStyle}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Enter boat model"
              />
            </div>

            {/* Brand */}
            <div>
              <label style={labelStyle}>
                Brand
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                style={inputStyle}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="e.g., Azimut, Sunseeker"
              />
            </div>

            {/* Year */}
            <div>
              <label style={labelStyle}>
                Year
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                style={inputStyle}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="2020"
                min="1900"
                max={new Date().getFullYear() + 1}
              />
            </div>

            {/* Size */}
            <div>
              <label style={labelStyle}>
                Size (meters)
              </label>
              <input
                type="number"
                value={formData.size}
                onChange={(e) => handleInputChange('size', e.target.value)}
                style={inputStyle}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="15.5"
                step="0.1"
                min="0"
                max="200"
              />
            </div>

            {/* Price */}
            <div>
              <label style={labelStyle}>
                Price
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                style={inputStyle}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="€1,500,000"
              />
            </div>

            {/* Location */}
            <div>
              <label style={labelStyle}>
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                style={inputStyle}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Monaco, France"
              />
            </div>

            {/* Owner */}
            <div>
              <label style={labelStyle}>
                Owner
              </label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => handleInputChange('owner', e.target.value)}
                style={inputStyle}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Boat owner name"
              />
            </div>

            {/* Engine */}
            <div>
              <label style={labelStyle}>
                Engine
              </label>
              <input
                type="text"
                value={formData.engine}
                onChange={(e) => handleInputChange('engine', e.target.value)}
                style={inputStyle}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Twin Volvo Penta"
              />
            </div>

            {/* Engine Hours */}
            <div>
              <label style={labelStyle}>
                Engine Hours
              </label>
              <input
                type="number"
                value={formData.engineHours}
                onChange={(e) => handleInputChange('engineHours', e.target.value)}
                style={inputStyle}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="1200"
                min="0"
              />
            </div>

            {/* Equipment */}
            <div className="md:col-span-2">
              <label style={labelStyle}>
                Equipment
              </label>
              <textarea
                value={formData.equipment}
                onChange={(e) => handleInputChange('equipment', e.target.value)}
                style={{
                  ...inputStyle,
                  minHeight: '80px',
                  resize: 'vertical'
                }}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="List key equipment and features"
                rows={3}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label style={labelStyle}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                style={{
                  ...inputStyle,
                  minHeight: '100px',
                  resize: 'vertical'
                }}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Detailed boat description"
                rows={4}
              />
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
        <div className="bg-white px-8 py-6 border-t border-gray-200 flex-shrink-0">
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                background: 'var(--accent-gold)',
                color: 'var(--primary-navy)',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.5 : 1,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
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
