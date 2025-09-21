"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/SessionProvider"
import { useBoats } from "@/hooks/useBoats"
import { PageHeader, ErrorAlert } from "@/components/shared"
import { BoatsList, BoatEditModal, BoatFilters } from "@/components/boats"
import { Boat } from "@/lib/schemas/boat"

export default function BoatsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { boats, isLoading, error, updateBoat } = useBoats()

  const [editModal, setEditModal] = useState<{ isOpen: boolean; boat: Boat | null }>({ isOpen: false, boat: null })
  const [filteredBoats, setFilteredBoats] = useState<Boat[]>([])

  const openEditModal = (boat: Boat) => {
    setEditModal({ isOpen: true, boat })
  }

  const closeEditModal = () => {
    setEditModal({ isOpen: false, boat: null })
  }

  const handleFiltersChange = (filters: { location: string; size: string; price: string; brand: string }) => {
    let filtered = [...boats]

    // Filter by location
    if (filters.location && filters.location !== 'all') {
      filtered = filtered.filter(boat => 
        boat.location?.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    // Filter by size
    if (filters.size && filters.size !== 'all') {
      filtered = filtered.filter(boat => {
        if (!boat.size) return false
        
        const size = boat.size
        switch (filters.size) {
          case 'under-10':
            return size < 10
          case '10-15':
            return size >= 10 && size < 15
          case '15-20':
            return size >= 15 && size < 20
          case '20-30':
            return size >= 20 && size < 30
          case '30-40':
            return size >= 30 && size < 40
          case '40-50':
            return size >= 40 && size < 50
          case '50-plus':
            return size >= 50
          default:
            return true
        }
      })
    }

    // Filter by price
    if (filters.price && filters.price !== 'all') {
      filtered = filtered.filter(boat => {
        if (!boat.price) return false
        
        // Extract numeric value from price string (e.g., "EUR 700000" -> 700000)
        const priceMatch = boat.price.match(/[\d,]+/)
        if (!priceMatch) return false
        
        const price = parseFloat(priceMatch[0].replace(/,/g, ''))
        switch (filters.price) {
          case 'under-100k':
            return price < 100000
          case '100k-500k':
            return price >= 100000 && price < 500000
          case '500k-1m':
            return price >= 500000 && price < 1000000
          case '1m-5m':
            return price >= 1000000 && price < 5000000
          case '5m-10m':
            return price >= 5000000 && price < 10000000
          case '10m-20m':
            return price >= 10000000 && price < 20000000
          case '20m-plus':
            return price >= 20000000
          default:
            return true
        }
      })
    }

    // Filter by brand
    if (filters.brand && filters.brand !== 'all') {
      filtered = filtered.filter(boat => 
        boat.brand?.toLowerCase().includes(filters.brand.toLowerCase())
      )
    }

    setFilteredBoats(filtered)
  }

  useEffect(() => {
    if (loading) return
    
    if (!user) {
      router.push("/auth/signin")
      return
    }
  }, [user, loading, router])

  // Initialize filtered boats when boats data changes
  useEffect(() => {
    setFilteredBoats(boats)
  }, [boats])

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
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '12px',
                marginBottom: '8px'
              }}>
                {/* Avatar Placeholder */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--accent-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-navy)',
                  fontSize: '14px',
                  fontWeight: '600',
                  flexShrink: 0
                }}>
                  {(() => {
                    const name = user.user_metadata?.name || user.email || '';
                    const parts = name.split(' ');
                    if (parts.length >= 2) {
                      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
                    }
                    return name.charAt(0).toUpperCase() || 'U';
                  })()}
                </div>
                
                <p style={{
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#374151',
                  margin: 0
                }}>
                  {user.user_metadata?.name || user.email}
                </p>
              </div>
              
              <Link 
                href="/dashboard"
                style={{
                  color: '#6B7280',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  justifyContent: 'flex-end'
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="yacht-container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <PageHeader
          title="Boats"
          subtitle="Manage your premium fleet inventory"
          count={filteredBoats.length}
          actionButton={{
            href: "/dashboard/boats/new",
            label: "Add New Boat",
            icon: "🛥️"
          }}
        />

        {error && <ErrorAlert message={error} />}

        <BoatFilters onFiltersChange={handleFiltersChange} />

        <BoatsList 
          boats={boats}
          filteredBoats={filteredBoats}
          isLoading={isLoading} 
          onEditBoat={openEditModal}
        />

        <BoatEditModal
          isOpen={editModal.isOpen}
          boat={editModal.boat}
          onClose={closeEditModal}
          onSave={updateBoat}
        />
      </main>
    </div>
  )
} 