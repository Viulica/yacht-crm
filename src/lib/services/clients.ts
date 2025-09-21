import { ClientModel, UserModel, CreateClientData, UpdateClientData, UpdateReminderData } from "@/lib/models"
import { ClientFormData } from "@/lib/schemas/client"

export class ClientsService {
  private clientModel = new ClientModel()
  private userModel = new UserModel()

  async getClientsByUserId(userId: string) {
    return await this.clientModel.getClientsByUserId(userId)
  }

  async createClient(userId: string, formData: ClientFormData) {
    // Check if user exists in our User table, create if not
    await this.userModel.getOrCreateUser({
      id: userId,
      email: formData.email,
      name: formData.name,
      company: formData.company || undefined,
      role: 'BROKER'
    })

    // Validation
    if (!formData.name || !formData.email) {
      throw new Error("Name and email are required")
    }

    // Check if client with this email already exists for this user
    const emailExists = await this.clientModel.clientEmailExists(userId, formData.email)
    if (emailExists) {
      throw new Error("Client with this email already exists")
    }

    // Map frontend fields to database schema fields
    const budgetMapping: { [key: string]: number } = {
      'under-500k': 500000,
      '500k-1m': 750000,
      '1m-5m': 3000000,
      '5m-10m': 7500000,
      '10m-plus': 15000000
    }

    const clientData: CreateClientData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      state: formData.company || undefined,
      modelInterest: formData.boatType || undefined,
      budget: formData.budget ? budgetMapping[formData.budget] || undefined : undefined,
      communication: formData.notes || undefined,
      userId
    }

    return await this.clientModel.createClient(clientData)
  }

  async updateClient(userId: string, id: string, formData: Partial<ClientFormData>) {
    const updateData: UpdateClientData = {}
    
    if (formData.name) updateData.name = formData.name
    if (formData.email) updateData.email = formData.email
    if (formData.phone) updateData.phone = formData.phone
    if (formData.company) updateData.state = formData.company
    if (formData.boatType) updateData.modelInterest = formData.boatType
    if (formData.notes) updateData.communication = formData.notes

    return await this.clientModel.updateClient(userId, id, updateData)
  }

  async deleteClient(userId: string, id: string) {
    await this.clientModel.deleteClient(userId, id)
  }

  async updateClientReminder(userId: string, clientId: string, reminderData: { toContact?: string | null; toContactText?: string | null }) {
    const updateData: UpdateReminderData = {
      toContact: reminderData.toContact ? new Date(reminderData.toContact) : null,
      toContactText: reminderData.toContactText || null
    }

    return await this.clientModel.updateClientReminder(userId, clientId, updateData)
  }

  async deleteClientReminder(userId: string, clientId: string) {
    return await this.clientModel.removeClientReminder(userId, clientId)
  }

  async getClientById(userId: string, id: string) {
    return await this.clientModel.getClientById(userId, id)
  }

  async getClientsWithReminders(userId: string) {
    return await this.clientModel.getClientsWithReminders(userId)
  }

  async searchClients(userId: string, criteria: {
    name?: string
    email?: string
    modelInterest?: string
    minBudget?: number
    maxBudget?: number
    hasReminder?: boolean
  }) {
    return await this.clientModel.searchClients(userId, criteria)
  }
}
