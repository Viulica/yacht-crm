import { BaseModel } from "./BaseModel"
import { Client, Prisma } from "@prisma/client"

export interface CreateClientData {
  name: string
  email: string
  phone?: string
  state?: string
  modelInterest?: string
  budget?: number
  communication?: string
  userId: string
}

export interface UpdateClientData {
  name?: string
  email?: string
  phone?: string
  state?: string
  modelInterest?: string
  budget?: number
  communication?: string
}

export interface UpdateReminderData {
  toContact?: Date | null
  toContactText?: string | null
}

export class ClientModel extends BaseModel {
  /**
   * Get all clients for a user
   */
  async getClientsByUserId(userId: string): Promise<Client[]> {
    return await this.findByUserId<Client>(
      this.prisma.client,
      userId,
      {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          state: true,
          modelInterest: true,
          budget: true,
          communication: true,
          toContact: true,
          toContactText: true,
          createdAt: true,
          updatedAt: true
        }
      }
    )
  }

  /**
   * Get a single client by ID and user ID
   */
  async getClientById(userId: string, id: string): Promise<Client | null> {
    return await this.findByIdAndUserId<Client>(
      this.prisma.client,
      id,
      userId
    )
  }

  /**
   * Create a new client
   */
  async createClient(data: CreateClientData): Promise<Client> {
    return await this.create<Client>(this.prisma.client, data)
  }

  /**
   * Update a client by ID and user ID
   */
  async updateClient(userId: string, id: string, data: UpdateClientData): Promise<Client> {
    return await this.updateByIdAndUserId<Client>(
      this.prisma.client,
      id,
      userId,
      data
    )
  }

  /**
   * Delete a client by ID and user ID
   */
  async deleteClient(userId: string, id: string): Promise<void> {
    await this.deleteByIdAndUserId(this.prisma.client, id, userId)
  }

  /**
   * Count clients for a user
   */
  async countClientsByUserId(userId: string): Promise<number> {
    return await this.countByUserId(this.prisma.client, userId)
  }

  /**
   * Update client reminder
   */
  async updateClientReminder(userId: string, clientId: string, data: UpdateReminderData): Promise<Client> {
    return await this.updateByIdAndUserId<Client>(
      this.prisma.client,
      clientId,
      userId,
      data
    )
  }

  /**
   * Remove client reminder
   */
  async removeClientReminder(userId: string, clientId: string): Promise<Client> {
    return await this.updateClientReminder(userId, clientId, {
      toContact: null,
      toContactText: null
    })
  }

  /**
   * Get clients with reminders
   */
  async getClientsWithReminders(userId: string): Promise<Client[]> {
    return await this.findByUserId<Client>(
      this.prisma.client,
      userId,
      {
        where: {
          toContact: { not: null }
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          modelInterest: true,
          toContact: true,
          toContactText: true
        },
        orderBy: {
          toContact: 'asc'
        }
      }
    )
  }

  /**
   * Check if client email already exists for user
   */
  async clientEmailExists(userId: string, email: string, excludeId?: string): Promise<boolean> {
    const whereClause: Prisma.ClientWhereInput = {
      userId,
      email
    }

    if (excludeId) {
      whereClause.id = { not: excludeId }
    }

    const existing = await this.prisma.client.findFirst({
      where: whereClause
    })

    return !!existing
  }

  /**
   * Search clients by criteria
   */
  async searchClients(
    userId: string,
    criteria: {
      name?: string
      email?: string
      modelInterest?: string
      minBudget?: number
      maxBudget?: number
      hasReminder?: boolean
    }
  ): Promise<Client[]> {
    const whereClause: Prisma.ClientWhereInput = {
      userId,
      ...(criteria.name && { name: { contains: criteria.name, mode: 'insensitive' } }),
      ...(criteria.email && { email: { contains: criteria.email, mode: 'insensitive' } }),
      ...(criteria.modelInterest && { modelInterest: { contains: criteria.modelInterest, mode: 'insensitive' } }),
      ...(criteria.minBudget && { budget: { gte: criteria.minBudget } }),
      ...(criteria.maxBudget && { budget: { lte: criteria.maxBudget } }),
      ...(criteria.hasReminder !== undefined && { 
        toContact: criteria.hasReminder ? { not: null } : null 
      })
    }

    return await this.prisma.client.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        state: true,
        modelInterest: true,
        budget: true,
        communication: true,
        toContact: true,
        toContactText: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    })
  }
}
