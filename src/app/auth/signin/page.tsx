"use client"

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // ✅ PREVENT DOUBLE SUBMISSION
    if (isLoading) return
    
    setIsLoading(true)
    setError('')

    console.log('🔐 Starting signin process...')

    try {
      // Sign in with Supabase Auth via server endpoint
      const response = await fetch('/api/auth/supabase/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      console.log('📡 Response status:', response.status)
      const data = await response.json()
      console.log('📄 Response data:', data)

      if (!response.ok) {
        console.log('❌ Signin failed:', data.error)
        setError(data.error || 'Invalid email or password')
        setIsLoading(false) // ✅ Re-enable form on error
      } else {
        console.log('✅ Signin successful, setting client session...')
        
        // Set the session in client-side Supabase
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        })
        
        if (sessionError) {
          console.error('❌ Failed to set client session:', sessionError)
          setError('Failed to establish session. Please try again.')
          setIsLoading(false) // ✅ Re-enable form on error
        } else {
          console.log('✅ Client session set successfully, redirecting immediately...')
          
          // ✅ IMMEDIATE redirect - no timeout needed
          window.location.href = '/dashboard'
        }
      }
    } catch (error) {
      console.error('🚨 Signin error:', error)
      setError('An error occurred. Please try again.')
      setIsLoading(false) // ✅ Re-enable form on error
    }
    // ✅ DON'T set isLoading false here - let redirect handle it
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
            <div className="text-center mb-20">
              <div className="yacht-float inline-block mb-8">
                <div className="text-6xl">⚓</div>
              </div>
              <h1 className="yacht-heading-lg mb-4">
                Welcome Back
              </h1>
              <p className="text-lg" style={{ color: 'var(--gray-600)' }}>
                Sign in to your <span className="yacht-text-luxury">exclusive</span> yacht brokerage account
              </p>
            </div>
            
            {/* Spacer */}
            <div style={{ height: '30px' }}></div>
            
            <form onSubmit={handleSubmit} className="space-y-8" style={{ width: '400px' }}>
              {/* ✅ DISABLE ALL INPUTS WHEN LOADING */}
              <fieldset disabled={isLoading} style={{ border: 'none', padding: 0, margin: 0 }}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '400px',
                    background: 'var(--white)',
                    border: '2px solid var(--gray-200)',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    fontSize: '16px',
                    fontWeight: '400',
                    transition: 'all 0.3s ease'
                  }}
                  placeholder="Enter your email address"
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent-gold)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(212, 165, 116, 0.1)'
                    e.target.style.outline = 'none'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--gray-200)'
                    e.target.style.boxShadow = 'none'
                  }}
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '400px',
                    background: 'var(--white)',
                    border: '2px solid var(--gray-200)',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    fontSize: '16px',
                    fontWeight: '400',
                    transition: 'all 0.3s ease'
                  }}
                  placeholder="Enter your password"
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent-gold)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(212, 165, 116, 0.1)'
                    e.target.style.outline = 'none'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--gray-200)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              {error && (
                <div className="rounded-lg p-4" style={{ background: 'var(--error)', color: 'white', width: '400px' }}>
                  <div className="text-sm font-medium">{error}</div>
                </div>
              )}

              <div className="pt-12">
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{ 
                    width: '400px',
                    background: 'var(--white)',
                    color: 'var(--primary-navy)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '14px 24px',
                    fontWeight: '500',
                    fontSize: '15px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    letterSpacing: '0.3px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.background = 'var(--gray-50)'
                      e.currentTarget.style.transform = 'translateY(-0.5px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.background = 'var(--white)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>

              <div className="relative my-12">
                <div className="absolute inset-0 flex items-center">
                  <div style={{ width: '400px', height: '1px', background: 'var(--gray-200)' }}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-6" style={{ background: 'var(--white)', color: 'var(--gray-500)' }}>New to Yacht CRM?</span>
                </div>
              </div>

              <Link 
                href="/auth/signup" 
                style={{ 
                  display: 'block',
                  width: '400px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  background: 'var(--white)',
                  color: 'var(--primary-navy)',
                  border: '1px solid var(--accent-gold)',
                  borderRadius: '8px',
                  padding: '10px 18px',
                  fontWeight: '500',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.2px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--accent-gold)'
                  e.currentTarget.style.borderColor = 'var(--accent-gold)'
                  e.currentTarget.style.color = 'var(--primary-navy)'
                  e.currentTarget.style.transform = 'translateY(-0.5px)'
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