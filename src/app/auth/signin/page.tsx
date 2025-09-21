"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isLoading) return
    
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.log('Signin failed:', data.error)
        setError(data.error || 'Invalid email or password')
        setIsLoading(false)
      } else {
        console.log('Signin successful:', data.user.email)
        
        setTimeout(() => {
          console.log('Redirecting to dashboard...')
          window.location.href = '/dashboard'
        }, 500)
      }
    } catch (error) {
      console.error('Signin error:', error)
      setError('An error occurred. Please try again.')
      setIsLoading(false) 
    }
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
              Luxury Yacht Management
            </h2>
            <p className="text-xl text-white opacity-90">
              Professional brokerage solutions for the world's finest vessels
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12" style={{ background: 'var(--white)' }}>
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--primary-navy)' }}>
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to your <span className="yacht-text-luxury">exclusive</span> yacht brokerage account
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <fieldset disabled={isLoading} style={{ border: 'none', padding: 0, margin: 0 }}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-all duration-200"
                  style={{
                    background: 'var(--white)',
                    borderColor: 'var(--gray-200)',
                    fontSize: '16px',
                    fontWeight: '400'
                  }}
                  placeholder="Enter your email address"
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent-gold)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(212, 165, 116, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--gray-200)'
                    e.target.style.boxShadow = 'none'
                  }}
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:outline-none transition-all duration-200"
                  style={{
                    background: 'var(--white)',
                    borderColor: 'var(--gray-200)',
                    fontSize: '16px',
                    fontWeight: '400'
                  }}
                  placeholder="Enter your password"
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent-gold)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(212, 165, 116, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--gray-200)'
                    e.target.style.boxShadow = 'none'
                  }}
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
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">New to Yacht CRM?</span>
                </div>
              </div>

              <Link 
                href="/auth/signup" 
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
                Create Broker Account
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