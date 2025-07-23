"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function NewClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    budget: '',
    boatType: '',
    notes: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create client')
        setIsLoading(false)
        return
      }

      router.push('/dashboard/clients')
    } catch {
      setError('An error occurred. Please try again.')
      setIsLoading(false)
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

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'var(--accent-gold)'
    e.target.style.boxShadow = '0 0 0 3px rgba(212, 165, 116, 0.1)'
    e.target.style.outline = 'none'
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'var(--gray-200)'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--off-white)' }}>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Client's full name"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div>
                <label htmlFor="email" style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="client@email.com"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="+1 (555) 123-4567"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div>
                <label htmlFor="company" style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Client's company"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="budget" style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Budget Range
                </label>
                <Select value={formData.budget} onValueChange={(value) => handleSelectChange('budget', value)}>
                  <SelectTrigger style={{
                    width: '100%',
                    background: 'var(--white)',
                    border: '2px solid var(--gray-200)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '15px',
                    fontWeight: '400',
                    height: '48px'
                  }}>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-500k">Under €500K</SelectItem>
                    <SelectItem value="500k-1m">€500K - €1M</SelectItem>
                    <SelectItem value="1m-5m">€1M - €5M</SelectItem>
                    <SelectItem value="5m-10m">€5M - €10M</SelectItem>
                    <SelectItem value="10m-plus">€10M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="boatType" style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Preferred Boat Type
                </label>
                <Select value={formData.boatType} onValueChange={(value) => handleSelectChange('boatType', value)}>
                  <SelectTrigger style={{
                    width: '100%',
                    background: 'var(--white)',
                    border: '2px solid var(--gray-200)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '15px',
                    fontWeight: '400',
                    height: '48px'
                  }}>
                    <SelectValue placeholder="Select boat type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="motor-yacht">Motor Yacht</SelectItem>
                    <SelectItem value="sailing-yacht">Sailing Yacht</SelectItem>
                    <SelectItem value="catamaran">Catamaran</SelectItem>
                    <SelectItem value="sport-boat">Sport Boat</SelectItem>
                    <SelectItem value="superyacht">Superyacht</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label htmlFor="notes" style={{ 
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleChange}
                style={{...inputStyle, resize: 'vertical'}}
                placeholder="Additional notes about the client..."
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>

            {error && (
              <div style={{ 
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '8px',
                padding: '12px',
                color: '#DC2626'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{error}</div>
              </div>
            )}

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                style={{ 
                  width: '100%',
                  background: isLoading ? '#9CA3AF' : 'var(--accent-gold)',
                  color: 'var(--primary-navy)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '14px 24px',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
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