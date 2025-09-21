import { useState, useCallback } from 'react'
import { RemindersData, DashboardStats } from '@/lib/schemas/dashboard'
import { getBoats, getClients } from '@/lib/actions'
import { getReminders } from '@/lib/actions/dashboard'

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats>({
    clientCount: 0,
    boatCount: 0,
    portfolioValue: 0,
    totalActiveReminders: 0
  })
  const [reminders, setReminders] = useState<RemindersData>({
    overdue: [],
    today: [],
    tomorrow: [],
    thisWeek: [],
    upcoming: []
  })
  const [isLoadingReminders, setIsLoadingReminders] = useState(true)
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  const fetchCounts = useCallback(async () => {
    try {
      setIsLoadingStats(true)
      // Use existing actions instead of direct API calls to avoid duplicate queries
      const [clientsResult, boatsResult] = await Promise.all([
        getClients(),
        getBoats()
      ])

      let clientCount = 0
      let boatCount = 0
      let portfolioValue = 0

      // Process clients
      if (clientsResult.success && clientsResult.data) {
        clientCount = clientsResult.data.length
      }

      // Process boats and calculate portfolio value
      if (boatsResult.success && boatsResult.data) {
        const boats = boatsResult.data
        boatCount = boats.length
        
        // Calculate total portfolio value
        portfolioValue = boats.reduce((sum: number, boat) => {
          if (boat.price) {
            // Extract number from price string (e.g., "EUR 1250000" -> 1250000)
            const priceMatch = boat.price.match(/[\d,]+/g)
            if (priceMatch) {
              const price = parseInt(priceMatch.join('').replace(/,/g, ''))
              return sum + price
            }
          }
          return sum
        }, 0)
      }

      setStats(prev => ({
        ...prev,
        clientCount,
        boatCount,
        portfolioValue
      }))
    } catch (error) {
      console.error('Error fetching counts:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }, [])

  const fetchReminders = useCallback(async () => {
    try {
      const result = await getReminders()
      if (result.success && result.data) {
        setReminders(result.data)
      }
    } catch (error) {
      console.error('Error fetching reminders:', error)
    } finally {
      setIsLoadingReminders(false)
    }
  }, [])

  const fetchAllData = useCallback(async () => {
    // Parallel data fetching for better performance
    await Promise.all([
      fetchCounts(),
      fetchReminders()
    ])
  }, [fetchCounts, fetchReminders])

  return {
    stats,
    reminders,
    isLoadingReminders,
    isLoadingStats,
    fetchAllData,
    refetchStats: fetchCounts,
    refetchReminders: fetchReminders
  }
}
