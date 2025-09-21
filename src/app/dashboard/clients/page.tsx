"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/SessionProvider"
import { useClients } from "@/hooks/useClients"
import { PageHeader, ErrorAlert } from "@/components/shared"
import { ClientsList, ReminderModal, ClientEditModal, ClientFilters } from "@/components/clients"
import { Client } from "@/lib/schemas/client"

export default function ClientsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const {
    clients,
    isLoading,
    error,
    reminderModal,
    reminderForm,
    openReminderModal,
    closeReminderModal,
    saveReminder,
    removeReminder,
    updateReminderForm,
    updateClient
  } = useClients()

  const [editModal, setEditModal] = useState<{ isOpen: boolean; client: Client | null }>({ isOpen: false, client: null })
  const [filteredClients, setFilteredClients] = useState<Client[]>([])

  const openEditModal = (client: Client) => {
    setEditModal({ isOpen: true, client })
  }

  const closeEditModal = () => {
    setEditModal({ isOpen: false, client: null })
  }

  const handleFiltersChange = (filters: { modelInterest: string; budget: string }) => {
    let filtered = [...clients]

    // Filter by model interest
    if (filters.modelInterest && filters.modelInterest !== 'all') {
      filtered = filtered.filter(client => 
        client.modelInterest?.toLowerCase().includes(filters.modelInterest.toLowerCase())
      )
    }

    // Filter by budget
    if (filters.budget && filters.budget !== 'all') {
      filtered = filtered.filter(client => {
        if (!client.budget) return false
        
        const budget = client.budget
        switch (filters.budget) {
          case 'under-500k':
            return budget < 500000
          case '500k-1m':
            return budget >= 500000 && budget < 1000000
          case '1m-5m':
            return budget >= 1000000 && budget < 5000000
          case '5m-10m':
            return budget >= 5000000 && budget < 10000000
          case '10m-plus':
            return budget >= 10000000
          default:
            return true
        }
      })
    }

    setFilteredClients(filtered)
  }

  useEffect(() => {
    if (loading) return
    
    if (!user) {
      router.push("/auth/signin")
      return
    }
  }, [user, loading, router])

  // Initialize filtered clients when clients data changes
  useEffect(() => {
    setFilteredClients(clients)
  }, [clients])

  if (loading || isLoading) {
    return (
      <div className="min-h-screen yacht-flex-center" style={{ background: 'linear-gradient(135deg, #FEFEFE 0%, #F4F6F8 100%)' }}>
        <div className="text-center">
          <div className="text-4xl mb-4" style={{ opacity: '0.3' }}>👥</div>
          <p style={{ fontSize: '16px', color: '#6B7280' }}>Loading clients...</p>
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
          title="Clients"
          subtitle="Manage your exclusive client portfolio"
          count={filteredClients.length}
          actionButton={{
            href: "/dashboard/clients/new",
            label: "Add New Client",
            icon: "👤"
          }}
        />

        {error && <ErrorAlert message={error} />}

        <ClientFilters onFiltersChange={handleFiltersChange} />

        <ClientsList
          clients={clients}
          filteredClients={filteredClients}
          isLoading={isLoading}
          onEditClient={openEditModal}
        />

        <ReminderModal
          modal={reminderModal}
          form={reminderForm}
          onClose={closeReminderModal}
          onSave={saveReminder}
          onFormChange={updateReminderForm}
        />

        <ClientEditModal
          isOpen={editModal.isOpen}
          client={editModal.client}
          onClose={closeEditModal}
          onSave={updateClient}
        />
      </main>
    </div>
  )
} 