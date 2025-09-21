import { useState, useEffect } from 'react'
import { Reminder } from '@/lib/schemas/dashboard'

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchReminders = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      const response = await fetch('/api/reminders')
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to fetch reminders')
        return
      }

      setReminders(data.reminders || [])
    } catch (err) {
      setError('An error occurred while fetching reminders')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReminders()

    // Listen for reminder updates from other components
    const handleReminderUpdate = () => {
      fetchReminders()
    }

    window.addEventListener('reminderUpdated', handleReminderUpdate)
    
    return () => {
      window.removeEventListener('reminderUpdated', handleReminderUpdate)
    }
  }, [])

  return {
    reminders,
    isLoading,
    error,
    refetch: fetchReminders
  }
}
