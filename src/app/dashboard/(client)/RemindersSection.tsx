"use client"

import Link from "next/link"
import { Reminder } from '@/lib/schemas/dashboard'
import { formatReminderDate } from '@/lib/dashboard-utils'
import { useReminders } from '@/hooks/useReminders'

export const RemindersSection = () => {
  const { reminders, isLoading, error } = useReminders()

  return (
    <div style={{ 
      background: 'var(--white)', 
      borderRadius: '12px', 
      padding: '32px',
      marginBottom: '32px',
      border: '1px solid var(--gray-200)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: '#F3F4F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6B7280',
            flexShrink: 0
          }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 style={{ 
            fontSize: '24px',
            fontWeight: '600',
            color: '#1F2937',
            margin: 0
          }}>
            Reminders
          </h2>
        </div>
      </div>

      {error ? (
        <div className="text-center py-8">
          <div style={{ fontSize: '14px', color: '#DC2626' }}>Error loading reminders: {error}</div>
        </div>
      ) : isLoading ? (
        <div className="text-center py-8">
          <div style={{ fontSize: '14px', color: '#6B7280' }}>Loading reminders...</div>
        </div>
      ) : reminders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4" style={{ opacity: '0.3' }}>📅</div>
          <p style={{ 
            fontSize: '16px',
            color: '#6B7280',
            margin: '0 0 8px 0'
          }}>
            No reminders set
          </p>
          <p style={{ 
            fontSize: '14px',
            color: '#9CA3AF'
          }}>
            Client follow-ups you set will appear here
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {reminders.map((reminder, index) => (
            <ReminderCard key={`${reminder.id}-${index}`} reminder={reminder} />
          ))}
        </div>
      )}
    </div>
  )
}

interface ReminderCardProps {
  reminder: Reminder
}

const ReminderCard = ({ reminder }: ReminderCardProps) => {
  return (
    <div 
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        border: '1px solid var(--gray-200)',
        borderRadius: '8px',
        background: 'var(--white)',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
        e.currentTarget.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          marginBottom: '4px'
        }}>
          <h4 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#1F2937',
            margin: 0
          }}>
            {reminder.name || 'Unnamed Client'}
          </h4>
          <span style={{
            fontSize: '12px',
            fontWeight: '500',
            color: '#6B7280',
            padding: '2px 8px',
            borderRadius: '4px',
            background: '#F3F4F6'
          }}>
            {formatReminderDate(reminder.toContact)}
          </span>
        </div>
        
        <div style={{ 
          fontSize: '14px', 
          color: '#6B7280',
          marginBottom: '4px'
        }}>
          {reminder.toContactText || 'Follow up required'}
        </div>
        
        <div style={{ 
          fontSize: '13px', 
          color: '#9CA3AF'
        }}>
          {reminder.email}
          {reminder.phone && ` • ${reminder.phone}`}
          {reminder.modelInterest && ` • Interested in: ${reminder.modelInterest}`}
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '8px' }}>
        <Link
          href={`mailto:${reminder.email}`}
          style={{
            background: 'var(--white)',
            border: '1px solid var(--gray-300)',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '12px',
            fontWeight: '500',
            color: '#6B7280',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-gold)'
            e.currentTarget.style.color = 'var(--accent-gold)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--gray-300)'
            e.currentTarget.style.color = '#6B7280'
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Email
        </Link>
        
        {reminder.phone && (
          <Link
            href={`tel:${reminder.phone}`}
            style={{
              background: 'var(--white)',
              border: '1px solid var(--accent-gold)',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '12px',
              fontWeight: '500',
              color: 'var(--accent-gold)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary-navy)'
              e.currentTarget.style.color = 'var(--primary-navy)'
              e.currentTarget.style.backgroundColor = 'var(--accent-gold)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-gold)'
              e.currentTarget.style.color = 'var(--accent-gold)'
              e.currentTarget.style.backgroundColor = 'var(--white)'
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call
          </Link>
        )}
      </div>
    </div>
  )
}
