import { BaseModel } from "./BaseModel"
import { User, Prisma } from "@prisma/client"

export interface CreateUserData {
  id: string
  email: string
  name?: string
  company?: string
  phone?: string
  role?: 'ADMIN' | 'BROKER' | 'MANAGER'
}

export interface UpdateUserData {
  email?: string
  name?: string
  company?: string
  phone?: string
  role?: 'ADMIN' | 'BROKER' | 'MANAGER'
  isActive?: boolean
}

export class UserModel extends BaseModel {
  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id }
    })
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email }
    })
  }

  /**
   * Create a new user
   */
  async createUser(data: CreateUserData): Promise<User> {
    return await this.create<User>(this.prisma.user, data)
  }

  /**
   * Update user by ID
   */
  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data
    })
  }

  /**
   * Delete user by ID
   */
  async deleteUser(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id }
    })
  }

  /**
   * Check if user exists
   */
  async userExists(id: string): Promise<boolean> {
    const user = await this.getUserById(id)
    return !!user
  }

  /**
   * Check if email is already taken
   */
  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    const whereClause: Prisma.UserWhereInput = { email }
    
    if (excludeId) {
      whereClause.id = { not: excludeId }
    }

    const existing = await this.prisma.user.findFirst({
      where: whereClause
    })

    return !!existing
  }

  /**
   * Get or create user (useful for Supabase auth integration)
   */
  async getOrCreateUser(data: CreateUserData): Promise<User> {
    let user = await this.getUserById(data.id)
    
    if (!user) {
      user = await this.createUser(data)
    }
    
    return user
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<User[]> {
    return await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    })
  }

  /**
   * Get active users
   */
  async getActiveUsers(): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })
  }
}
