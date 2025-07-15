"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/SessionProvider"

interface Boat {
  id: string
  model: string | null
  brand: string | null
  year: number | null
  size: number | null
  price: string | null
  location: string | null
  description: string | null
  equipment: string | null
  images: Array<{
    id: string
    url: string
    alt: string | null
  }>
  createdAt: string
}

export default function BoatsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [boats, setBoats] = useState<Boat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (loading) return
    
    if (!user) {
      router.push("/auth/signin")
      return
    }

    fetchBoats()
  }, [user, loading, router])

  const fetchBoats = async () => {
    try {
      const response = await fetch('/api/boats')
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to fetch boats')
        return
      }

      setBoats(data.boats || [])
    } catch (error) {
      setError('An error occurred while fetching boats')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen yacht-flex-center" style={{ background: 'linear-gradient(135deg, #FEFEFE 0%, #F4F6F8 100%)' }}>
        <div className="text-center">
          <div className="text-4xl mb-4" style={{ opacity: '0.3' }}>🛥️</div>
          <p style={{ fontSize: '16px', color: '#6B7280' }}>Loading boats...</p>
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
              fontSize: '36px',
              fontWeight: '700',
              color: '#1F2937',
              marginBottom: '6px',
              letterSpacing: '-0.025em'
            }}>
              Boats ({boats.length})
            </h2>
            <p style={{ 
              fontSize: '16px',
              color: '#6B7280',
              fontWeight: '400'
            }}>
              Manage your <span className="yacht-text-luxury">premium</span> fleet inventory
            </p>
          </div>
          
          <Link 
            href="/dashboard/boats/new"
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
            <span style={{ marginRight: '8px' }}>🛥️</span>
            Add New Boat
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

        {/* Boats List */}
        <div style={{ 
          background: 'var(--white)', 
          borderRadius: '12px', 
          border: '1px solid var(--gray-200)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
        }}>
          {boats.length === 0 ? (
            <div className="text-center py-16" style={{ padding: '48px' }}>
              <div className="text-6xl mb-6" style={{ opacity: '0.3' }}>🛥️</div>
              <h3 style={{ 
                fontSize: '24px',
                fontWeight: '600',
                color: '#1F2937',
                marginBottom: '12px'
              }}>
                No boats yet
              </h3>
              <p style={{ 
                fontSize: '16px',
                color: '#6B7280',
                marginBottom: '24px'
              }}>
                Start building your fleet inventory by adding your first boat
              </p>
              <Link 
                href="/dashboard/boats/new"
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
                <span style={{ marginRight: '8px' }}>🛥️</span>
                Add Your First Boat
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
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#374151' }}>Image</div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#374151' }}>Boat</div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#374151' }}>Details</div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#374151' }}>Location</div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#374151' }}>Price</div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#374151' }}>Added</div>
                </div>
              </div>

              {/* Table Body */}
              <div>
                {boats.map((boat, index) => (
                  <div 
                    key={boat.id}
                    style={{
                      borderBottom: index < boats.length - 1 ? '1px solid var(--gray-200)' : 'none',
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
                      {/* Boat Image Thumbnail */}
                      <div>
                        {boat.images && boat.images.length > 0 ? (
                          <div style={{
                            width: '60px',
                            height: '40px',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            border: '1px solid var(--gray-200)',
                            position: 'relative'
                          }}>
                            <img
                              src={boat.images[0].url}
                              alt={boat.images[0].alt || 'Boat image'}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                            {boat.images.length > 1 && (
                              <div style={{
                                position: 'absolute',
                                bottom: '2px',
                                right: '2px',
                                background: 'rgba(0, 0, 0, 0.7)',
                                color: 'white',
                                fontSize: '10px',
                                padding: '1px 4px',
                                borderRadius: '2px'
                              }}>
                                +{boat.images.length - 1}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{
                            width: '60px',
                            height: '40px',
                            borderRadius: '6px',
                            border: '1px solid var(--gray-200)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#F9FAFB',
                            fontSize: '16px',
                            opacity: '0.4'
                          }}>
                            🛥️
                          </div>
                        )}
                      </div>

                      {/* Boat Name */}
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '15px', color: '#1F2937', marginBottom: '4px' }}>
                          {boat.model || 'Unnamed Boat'}
                        </div>
                        {boat.brand && (
                          <div style={{ fontSize: '13px', color: '#6B7280' }}>
                            {boat.brand}
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div>
                        {boat.year && (
                          <div style={{ fontSize: '14px', color: '#1F2937', marginBottom: '2px' }}>
                            {boat.year}
                          </div>
                        )}
                        {boat.size && (
                          <div style={{ fontSize: '13px', color: '#6B7280' }}>
                            {boat.size}m
                          </div>
                        )}
                      </div>

                      {/* Location */}
                      <div style={{ fontSize: '14px', color: '#1F2937' }}>
                        {boat.location || '-'}
                      </div>

                      {/* Price */}
                      <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--accent-gold)' }}>
                        {boat.price || 'Price on request'}
                      </div>

                      {/* Date Added */}
                      <div style={{ fontSize: '13px', color: '#6B7280' }}>
                        {formatDate(boat.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 