"use client"

import { DashboardStats } from '@/lib/schemas/dashboard'
import { formatCurrency } from '@/lib/dashboard-utils'
import { Users, Ship, Clock, DollarSign } from 'lucide-react'
import { useReminders } from '@/hooks/useReminders'

interface StatsOverviewProps {
  stats: DashboardStats
  isLoading: boolean
}

export const StatsOverview = ({ stats, isLoading }: StatsOverviewProps) => {
  const { reminders } = useReminders()
  
  // Calculate the actual reminder count from the reminders data
  const actualReminderCount = reminders.length
  
  if (isLoading) {
    return (
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ 
          fontSize: '18px',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '16px'
        }}>
          Overview
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} style={{ 
              background: 'var(--white)', 
              border: '1px solid var(--gray-200)',
              borderRadius: '8px', 
              padding: '20px',
              textAlign: 'center'
            }}>
              <div className="yacht-shimmer w-8 h-8 rounded mx-auto mb-2"></div>
              <div className="yacht-shimmer w-16 h-4 rounded mx-auto mb-1"></div>
              <div className="yacht-shimmer w-12 h-6 rounded mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ 
        fontSize: '18px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '16px'
      }}>
        Overview
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Total Clients"
          value={stats.clientCount.toString()}
        />
        <StatCard
          icon={<Ship className="w-5 h-5" />}
          label="Active Boats"
          value={stats.boatCount.toString()}
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Total Reminders"
          value={actualReminderCount.toString()}
        />
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          label="Total Portfolio"
          value={formatCurrency(stats.portfolioValue)}
          highlight={true}
        />
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  highlight?: boolean
}

const StatCard = ({ icon, label, value, highlight = false }: StatCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-600 p-2 rounded-lg bg-gray-50 shadow-sm">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">
          {label}
        </p>
        <p className={`text-2xl font-bold ${highlight ? 'text-yellow-600' : 'text-gray-900'}`} style={{ color: highlight ? 'var(--accent-gold)' : undefined }}>
          {value}
        </p>
      </div>
    </div>
  )
}
