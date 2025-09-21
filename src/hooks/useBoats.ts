import { useState, useEffect } from 'react'
import { Boat } from '@/lib/schemas/boat'
import { getBoats } from '@/lib/actions'

export const useBoats = () => {
  const [boats, setBoats] = useState<Boat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchBoats = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      const result = await getBoats()

      if (!result.success) {
        setError(result.error || 'Failed to fetch boats')
        return
      }

      setBoats(result.data || [])
    } catch (err) {
      setError('An error occurred while fetching boats')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBoats()
  }, [])

  const updateBoat = async (boatId: string, updates: Partial<Boat>) => {
    try {
      const response = await fetch('/api/boats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boatId, ...updates })
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to update boat')
        throw new Error(data.error || 'Failed to update boat')
      }

      await fetchBoats()
    } catch (err) {
      setError('An error occurred while updating boat')
      throw err
    }
  }

  return {
    boats,
    isLoading,
    error,
    refetch: fetchBoats,
    updateBoat
  }
}
