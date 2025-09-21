import { useState, useEffect } from 'react'
import { Client, ReminderModal, ReminderForm } from '@/lib/schemas/client'

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [reminderModal, setReminderModal] = useState<ReminderModal>({ isOpen: false, client: null })
  const [reminderForm, setReminderForm] = useState<ReminderForm>({ date: '', note: '' })

  const fetchClients = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      const response = await fetch('/api/clients')
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to fetch clients')
        return
      }

      setClients(data.clients || [])
    } catch (err) {
      setError('An error occurred while fetching clients')
    } finally {
      setIsLoading(false)
    }
  }

  const openReminderModal = (client: Client) => {
    setReminderModal({ isOpen: true, client })
    setReminderForm({
      date: client.toContact ? new Date(client.toContact).toISOString().split('T')[0] : '',
      note: client.toContactText || ''
    })
  }

  const closeReminderModal = () => {
    setReminderModal({ isOpen: false, client: null })
    setReminderForm({ date: '', note: '' })
  }

  const saveReminder = async () => {
    if (!reminderModal.client) return

    try {
      const response = await fetch(`/api/clients/${reminderModal.client.id}/reminder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toContact: reminderForm.date ? new Date(reminderForm.date).toISOString() : null,
          toContactText: reminderForm.note || null
        })
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to save reminder')
        return
      }

      await fetchClients()
      closeReminderModal()
      
      // Notify other components that reminders have been updated
      window.dispatchEvent(new CustomEvent('reminderUpdated'))
    } catch (err) {
      setError('An error occurred while saving reminder')
    }
  }

  const removeReminder = async (clientId: string) => {
    try {
      const response = await fetch(`/api/clients/${clientId}/reminder`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to remove reminder')
        return
      }

      await fetchClients()
      
      // Notify other components that reminders have been updated
      window.dispatchEvent(new CustomEvent('reminderUpdated'))
    } catch (err) {
      setError('An error occurred while removing reminder')
    }
  }

  const updateReminderForm = (field: keyof ReminderForm, value: string) => {
    setReminderForm((prev: ReminderForm) => ({ ...prev, [field]: value }))
  }

  const updateClient = async (clientId: string, updates: Partial<Client>) => {
    try {
      const response = await fetch('/api/clients', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, ...updates })
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to update client')
        throw new Error(data.error || 'Failed to update client')
      }

      await fetchClients()
    } catch (err) {
      setError('An error occurred while updating client')
      throw err
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  return {
    clients,
    isLoading,
    error,
    reminderModal,
    reminderForm,
    refetch: fetchClients,
    openReminderModal,
    closeReminderModal,
    saveReminder,
    removeReminder,
    updateReminderForm,
    updateClient
  }
}
