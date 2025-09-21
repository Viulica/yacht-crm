import { BaseModel } from "./BaseModel"
import { Boat, Prisma } from "@prisma/client"
import { CreateBoatDatabaseInput, UpdateBoatDatabaseInput } from "../schemas/boat"

export class BoatModel extends BaseModel {
  /**
   * Get all boats for a user with their images
   */
  async getBoatsByUserId(userId: string): Promise<Boat[]> {
    return await this.findByUserId<Boat>(
      this.prisma.boat,
      userId,
      {
        include: {
          images: {
            select: {
              id: true,
              filename: true,
              alt: true,
              url: true
            }
          }
        }
      }
    )
  }

  /**
   * Get a single boat by ID and user ID
   */
  async getBoatById(userId: string, id: string): Promise<Boat | null> {
    return await this.findByIdAndUserId<Boat>(
      this.prisma.boat,
      id,
      userId,
      {
        include: {
          images: {
            select: {
              id: true,
              filename: true,
              alt: true,
              url: true
            }
          }
        }
      }
    )
  }

  /**
   * Create a new boat
   */
  async createBoat(data: CreateBoatDatabaseInput): Promise<Boat> {
    return await this.create<Boat>(this.prisma.boat, data)
  }

  /**
   * Update a boat by ID and user ID
   */
  async updateBoat(userId: string, id: string, data: UpdateBoatDatabaseInput): Promise<Boat> {
    return await this.updateByIdAndUserId<Boat>(
      this.prisma.boat,
      id,
      userId,
      data
    )
  }

  /**
   * Delete a boat by ID and user ID
   */
  async deleteBoat(userId: string, id: string): Promise<void> {
    await this.deleteByIdAndUserId(this.prisma.boat, id, userId)
  }

  /**
   * Count boats for a user
   */
  async countBoatsByUserId(userId: string): Promise<number> {
    return await this.countByUserId(this.prisma.boat, userId)
  }

  /**
   * Get boats with price information for portfolio calculation
   */
  async getBoatsForPortfolio(userId: string): Promise<Pick<Boat, 'price'>[]> {
    return await this.findByUserId<Pick<Boat, 'price'>>(
      this.prisma.boat,
      userId,
      {
        select: {
          price: true
        }
      }
    )
  }

  /**
   * Search boats by criteria
   */
  async searchBoats(
    userId: string,
    criteria: {
      brand?: string
      model?: string
      minYear?: number
      maxYear?: number
      minSize?: number
      maxSize?: number
      location?: string
    }
  ): Promise<Boat[]> {
    const whereClause: Prisma.BoatWhereInput = {
      userId,
      ...(criteria.brand && { brand: { contains: criteria.brand, mode: 'insensitive' } }),
      ...(criteria.model && { model: { contains: criteria.model, mode: 'insensitive' } }),
      ...(criteria.minYear && { year: { gte: criteria.minYear } }),
      ...(criteria.maxYear && { year: { lte: criteria.maxYear } }),
      ...(criteria.minSize && { size: { gte: criteria.minSize } }),
      ...(criteria.maxSize && { size: { lte: criteria.maxSize } }),
      ...(criteria.location && { location: { contains: criteria.location, mode: 'insensitive' } })
    }

    return await this.prisma.boat.findMany({
      where: whereClause,
      include: {
        images: {
          select: {
            id: true,
            filename: true,
            alt: true,
            url: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }
}
