import { getServerUser } from './auth-server'
import { getBoats, getClients } from './actions'

export async function getDashboardData() {
  const user = await getServerUser()
  
  // Fetch all data in parallel
  const [boatsResult, clientsResult] = await Promise.all([
    getBoats(),
    getClients()
  ])
  
  // Calculate stats
  let clientCount = 0
  let boatCount = 0
  let portfolioValue = 0
  
  if (clientsResult.success && clientsResult.data) {
    clientCount = clientsResult.data.length
  }
  
  if (boatsResult.success && boatsResult.data) {
    const boats = boatsResult.data
    boatCount = boats.length
    
    // Calculate total portfolio value
    portfolioValue = boats.reduce((sum: number, boat) => {
      if (boat.price) {
        const priceMatch = boat.price.match(/[\d,]+/g)
        if (priceMatch) {
          const price = parseInt(priceMatch.join('').replace(/,/g, ''))
          return sum + price
        }
      }
      return sum
    }, 0)
  }
  
  const stats = {
    clientCount,
    boatCount,
    portfolioValue,
    totalActiveReminders: 0 // Will be calculated on client side
  }
  
  return {
    user,
    stats,
    boats: boatsResult.success ? boatsResult.data : [],
    clients: clientsResult.success ? clientsResult.data : []
  }
}
