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
      const registerResponse = await fetch('/api/signup', {
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
      <div className="min-h-screen flex">
        {/* Left Side - Yacht Image */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(https://yachtharbour.com/static/uploads/2321_de701.jpg)'
            }}
          >
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            
            {/* Bottom text overlay */}
            <div className="absolute bottom-8 left-8 right-8">
              <h2 className="text-4xl font-bold text-white mb-4">
                Welcome Aboard!
              </h2>
              <p className="text-xl text-white opacity-90">
                Your exclusive yacht brokerage account is ready
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Success Message */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12" style={{ background: 'var(--white)' }}>
          <div className="w-full max-w-md text-center">
            <div className="mb-8">
              <div className="text-6xl mb-6">🎉</div>
              <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--primary-navy)' }}>
                Account Created!
              </h1>
              <p className="text-lg mb-8" style={{ color: 'var(--gray-600)' }}>
                Your <span className="yacht-text-luxury">exclusive</span> yacht brokerage account has been created successfully.
              </p>
            </div>
            
            <Link 
              href="/auth/signin" 
              className="block w-full py-3 px-4 text-center rounded-lg font-semibold transition-all duration-200"
              style={{ 
                background: 'var(--accent-gold)',
                color: 'var(--primary-navy)',
                fontSize: '16px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--primary-navy)'
                e.currentTarget.style.color = 'white'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--accent-gold)'
                e.currentTarget.style.color = 'var(--primary-navy)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Sign In to Dashboard
            </Link>

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="text-sm yacht-text-luxury">
                Professional Yacht Brokerage Management
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--accent-gold)'
    e.target.style.boxShadow = '0 0 0 3px rgba(212, 165, 116, 0.1)'
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--gray-200)'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Yacht Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://yachtharbour.com/static/uploads/2321_de701.jpg)'
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          
          {/* Bottom text overlay */}
          <div className="absolute bottom-8 left-8 right-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              Join the Elite
            </h2>
            <p className="text-xl text-white opacity-90">
              Create your premium yacht brokerage account and manage the world's finest vessels
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12" style={{ background: 'var(--white)' }}>
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--primary-navy)' }}>
              Create Account
            </h1>
            <p className="text-gray-600">
              Join the <span className="yacht-text-luxury">elite</span> yacht brokerage community
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <fieldset disabled={isLoading} style={{ border: 'none', padding: 0, margin: 0 }}>
              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-2" style={{ color: 'var(--primary-navy)' }}>
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-all duration-200"
                  style={{
                    background: 'var(--white)',
                    borderColor: 'var(--gray-200)',
                    fontSize: '16px',
                    fontWeight: '400'
                  }}
                  placeholder="Your full name"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: 'var(--primary-navy)' }}>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-all duration-200"
                  style={{
                    background: 'var(--white)',
                    borderColor: 'var(--gray-200)',
                    fontSize: '16px',
                    fontWeight: '400'
                  }}
                  placeholder="professional@email.com"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-semibold mb-2" style={{ color: 'var(--primary-navy)' }}>
                  Company <span className="yacht-text-luxury">(Optional)</span>
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-all duration-200"
                  style={{
                    background: 'var(--white)',
                    borderColor: 'var(--gray-200)',
                    fontSize: '16px',
                    fontWeight: '400'
                  }}
                  placeholder="Your brokerage firm"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-semibold mb-2" style={{ color: 'var(--primary-navy)' }}>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-all duration-200"
                  style={{
                    background: 'var(--white)',
                    borderColor: 'var(--gray-200)',
                    fontSize: '16px',
                    fontWeight: '400'
                  }}
                  placeholder="Minimum 6 characters"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2" style={{ color: 'var(--primary-navy)' }}>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-all duration-200"
                  style={{
                    background: 'var(--white)',
                    borderColor: 'var(--gray-200)',
                    fontSize: '16px',
                    fontWeight: '400'
                  }}
                  placeholder="Re-enter your password"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              {error && (
                <div className="rounded-lg p-4" style={{ background: 'var(--error)', color: 'white' }}>
                  <div className="text-sm font-medium">{error}</div>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    background: 'var(--accent-gold)',
                    color: 'var(--primary-navy)',
                    fontSize: '16px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.background = 'var(--primary-navy)'
                      e.currentTarget.style.color = 'white'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.background = 'var(--accent-gold)'
                      e.currentTarget.style.color = 'var(--primary-navy)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                      Creating account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>

              <Link 
                href="/auth/signin" 
                className="block w-full py-3 px-4 text-center rounded-lg font-semibold transition-all duration-200 border"
                style={{ 
                  background: 'var(--white)',
                  color: 'var(--primary-navy)',
                  borderColor: 'var(--accent-gold)',
                  fontSize: '16px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--accent-gold)'
                  e.currentTarget.style.borderColor = 'var(--accent-gold)'
                  e.currentTarget.style.color = 'var(--primary-navy)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--white)'
                  e.currentTarget.style.borderColor = 'var(--accent-gold)'
                  e.currentTarget.style.color = 'var(--primary-navy)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Sign In Here
              </Link>
            </fieldset>
          </form>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm yacht-text-luxury">
              Professional Yacht Brokerage Management
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 