import { ClientModel, BoatModel } from "@/lib/models"

export class DashboardService {
  private clientModel = new ClientModel()
  private boatModel = new BoatModel()

  async getDashboardStats(userId: string) {
    // Get counts in parallel for better performance
    const [clientCount, boats] = await Promise.all([
      this.clientModel.countClientsByUserId(userId),
      this.boatModel.getBoatsForPortfolio(userId)
    ])

    // Calculate portfolio value
    const portfolioValue = boats.reduce((sum, boat) => {
      if (boat.price) {
        const priceMatch = boat.price.match(/[\d,]+/g)
        if (priceMatch) {
          const price = parseInt(priceMatch.join('').replace(/,/g, ''))
          return sum + price
        }
      }
      return sum
    }, 0)

    return {
      clientCount,
      boatCount: boats.length,
      portfolioValue
    }
  }

  async getReminders(userId: string) {
    const clients = await this.clientModel.getClientsWithReminders(userId)

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    return {
      overdue: clients.filter(client => client.toContact && new Date(client.toContact) < today),
      today: clients.filter(client => {
        if (!client.toContact) return false
        const clientDate = new Date(client.toContact)
        clientDate.setHours(0, 0, 0, 0)
        return clientDate.getTime() === today.getTime()
      }),
      tomorrow: clients.filter(client => {
        if (!client.toContact) return false
        const clientDate = new Date(client.toContact)
        clientDate.setHours(0, 0, 0, 0)
        return clientDate.getTime() === tomorrow.getTime()
      }),
      thisWeek: clients.filter(client => {
        if (!client.toContact) return false
        const clientDate = new Date(client.toContact)
        return clientDate > tomorrow && clientDate <= nextWeek
      }),
      upcoming: clients.filter(client => {
        if (!client.toContact) return false
        const clientDate = new Date(client.toContact)
        return clientDate > nextWeek
      })
    }
  }
}
