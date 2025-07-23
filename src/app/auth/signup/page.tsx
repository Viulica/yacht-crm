"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess(false)

    // Validation
    if (!formData.email || !formData.password || !formData.name) {
      setError('Please fill in all required fields')
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    try {
      // Register user with Supabase Auth
      const registerResponse = await fetch('/api/auth/supabase/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          company: formData.company
        })
      })

      const registerData = await registerResponse.json()

      if (!registerResponse.ok) {
        setError(registerData.error || 'Registration failed')
        setIsLoading(false)
        return
      }

      if (registerData.needsEmailConfirmation) {
        setSuccess(true)
        setError('Please check your email to confirm your account before signing in.')
      } else {
        // Auto-redirect to signin page
        router.push('/auth/signin?message=Registration successful! Please sign in.')
      }

    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--off-white)' }}>
        {/* Full Width Container */}
        <div className="min-h-screen flex items-center justify-center">
          {/* Full Width Main Card */}
          <div className="w-full min-h-screen flex flex-col justify-center" style={{ background: 'var(--white)', boxShadow: 'var(--shadow-luxury)' }}>
            {/* Centered Content Container */}
            <div className="flex flex-col items-center px-8 py-16">
              <div className="text-center">
                <div className="yacht-float mb-8">
                  <div className="text-6xl mb-4">🎉</div>
                </div>
                <h1 className="yacht-heading-lg mb-6">
                  Welcome Aboard!
                </h1>
                <p className="text-lg mb-8" style={{ color: 'var(--gray-600)', maxWidth: '400px' }}>
                  Your <span className="yacht-text-luxury">exclusive</span> yacht brokerage account has been created successfully.
                </p>
                <Link 
                  href="/auth/signin" 
                  style={{ 
                    display: 'inline-block',
                    textDecoration: 'none',
                    background: 'var(--primary-navy)',
                    color: 'var(--white)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '14px 28px',
                    fontWeight: '500',
                    fontSize: '15px',
                    transition: 'all 0.2s ease',
                    letterSpacing: '0.3px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--gray-800)'
                    e.currentTarget.style.transform = 'translateY(-0.5px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--primary-navy)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  Sign In to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const inputStyle = {
    width: '400px',
    background: 'var(--white)',
    border: '2px solid var(--gray-200)',
    borderRadius: '12px',
    padding: '16px 20px',
    fontSize: '16px',
    fontWeight: '400',
    transition: 'all 0.3s ease'
  }

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--accent-gold)'
    e.target.style.boxShadow = '0 0 0 3px rgba(212, 165, 116, 0.1)'
    e.target.style.outline = 'none'
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--gray-200)'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--off-white)' }}>
      {/* Full Width Container */}
      <div className="min-h-screen flex items-center justify-center">
        {/* Full Width Main Card */}
        <div className="w-full min-h-screen flex flex-col justify-center" style={{ background: 'var(--white)', boxShadow: 'var(--shadow-luxury)' }}>
          {/* Centered Content Container */}
          <div className="flex flex-col items-center px-8 py-16">
            {/* Logo & Header */}
            <div className="text-center mb-12">
              <div className="yacht-float inline-block mb-8">
                <div className="text-6xl">🛥️</div>
              </div>
              <h1 className="yacht-heading-lg mb-4">
                Join the Elite
              </h1>
              <p className="text-lg" style={{ color: 'var(--gray-600)' }}>
                Create your <span className="yacht-text-luxury">premium</span> yacht brokerage account
              </p>
            </div>
            
            {/* Spacing div between header and form */}
            <div style={{ height: '25px' }}></div>
            
            <form onSubmit={handleSubmit} className="space-y-6" style={{ width: '400px' }}>
              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-4" style={{ color: 'var(--primary-navy)' }}>
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Your full name"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-4" style={{ color: 'var(--primary-navy)' }}>
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="professional@email.com"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-semibold mb-4" style={{ color: 'var(--primary-navy)' }}>
                  Company <span className="yacht-text-luxury">(Optional)</span>
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Your brokerage firm"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-semibold mb-4" style={{ color: 'var(--primary-navy)' }}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Minimum 6 characters"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div className="mb-16">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-4" style={{ color: 'var(--primary-navy)' }}>
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Re-enter your password"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              {/* Spacing div for better visual separation */}
              <div style={{ height: '40px' }}></div>

              {error && (
                <div className="rounded-lg p-4" style={{ background: 'var(--error)', color: 'white', width: '400px' }}>
                  <div className="text-sm font-medium">{error}</div>
                </div>
              )}

              <div className="pt-24 mb-16">
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{ 
                    width: '400px',
                    background: 'var(--white)',
                    color: 'var(--primary-navy)',
                    border: '1px solid var(--accent-gold)',
                    borderRadius: '8px',
                    padding: '10px 18px',
                    fontWeight: '500',
                    fontSize: '14px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    letterSpacing: '0.2px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.background = 'var(--accent-gold)'
                      e.currentTarget.style.borderColor = 'var(--accent-gold)'
                      e.currentTarget.style.color = 'var(--primary-navy)'
                      e.currentTarget.style.transform = 'translateY(-0.5px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.background = 'var(--white)'
                      e.currentTarget.style.borderColor = 'var(--accent-gold)'
                      e.currentTarget.style.color = 'var(--primary-navy)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center pt-16">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Creating account...
                    </div>
                  ) : (
                    'Create Exclusive Account'
                  )}
                </button>
              </div>

              {/* Spacing between Create Account button and Already have account */}
              <div style={{ height: '15px' }}></div>

              <div className="relative my-10">
                <div className="absolute inset-0 flex items-center">
                  <div style={{ width: '400px', height: '1px', background: 'var(--gray-200)' }}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-6" style={{ background: 'var(--white)', color: 'var(--gray-500)' }}>Already have an account?</span>
                </div>
              </div>

              {/* Spacing between Already have account text and Sign In button */}
              <div style={{ height: '15px' }}></div>

              <div className="flex justify-center">
                <Link 
                  href="/auth/signin" 
                  style={{ 
                    display: 'inline-block',
                    textAlign: 'center',
                    textDecoration: 'none',
                    background: 'var(--white)',
                    color: 'var(--primary-navy)',
                    border: '1px solid var(--gray-300)',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontWeight: '500',
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                    letterSpacing: '0.2px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--gray-50)'
                    e.currentTarget.style.borderColor = 'var(--gray-400)'
                    e.currentTarget.style.transform = 'translateY(-0.5px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--white)'
                    e.currentTarget.style.borderColor = 'var(--gray-300)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  Sign In Here
                </Link>
              </div>
            </form>

            {/* Subtitle */}
            <div className="text-center mt-8">
              <p className="text-sm yacht-text-luxury">
                Professional Yacht Brokerage Management
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 