import { prisma } from "@/lib/prisma"

/**
 * Base Model class that provides common database operations
 * All models extend this to get consistent behavior
 */
export abstract class BaseModel {
  protected prisma = prisma

  /**
   * Generic method to find records by user ID
   */
  protected async findByUserId<T>(
    model: any,
    userId: string,
    options?: {
      include?: any
      select?: any
      orderBy?: any
      where?: any
    }
  ): Promise<T[]> {
    const whereClause = {
      userId,
      ...options?.where
    }

    return await model.findMany({
      where: whereClause,
      include: options?.include,
      select: options?.select,
      orderBy: options?.orderBy || { createdAt: 'desc' }
    })
  }

  /**
   * Generic method to find a single record by ID and user ID
   */
  protected async findByIdAndUserId<T>(
    model: any,
    id: string,
    userId: string,
    options?: {
      include?: any
      select?: any
    }
  ): Promise<T | null> {
    return await model.findFirst({
      where: { id, userId },
      include: options?.include,
      select: options?.select
    })
  }

  /**
   * Generic method to create a record
   */
  protected async create<T>(
    model: any,
    data: any
  ): Promise<T> {
    return await model.create({
      data
    })
  }

  /**
   * Generic method to update a record by ID and user ID
   */
  protected async updateByIdAndUserId<T>(
    model: any,
    id: string,
    userId: string,
    data: any
  ): Promise<T> {
    // First verify the record belongs to the user
    const existing = await model.findFirst({
      where: { id, userId }
    })

    if (!existing) {
      throw new Error("Record not found or access denied")
    }

    return await model.update({
      where: { id },
      data
    })
  }

  /**
   * Generic method to delete a record by ID and user ID
   */
  protected async deleteByIdAndUserId(
    model: any,
    id: string,
    userId: string
  ): Promise<void> {
    // First verify the record belongs to the user
    const existing = await model.findFirst({
      where: { id, userId }
    })

    if (!existing) {
      throw new Error("Record not found or access denied")
    }

    await model.delete({
      where: { id }
    })
  }

  /**
   * Generic method to count records by user ID
   */
  protected async countByUserId(
    model: any,
    userId: string,
    where?: any
  ): Promise<number> {
    return await model.count({
      where: {
        userId,
        ...where
      }
    })
  }
}
