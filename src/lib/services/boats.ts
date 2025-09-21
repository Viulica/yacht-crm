import { BoatModel } from "@/lib/models"
import { validateCreateBoat, validateUpdateBoat, validateBoatSearch, CreateBoatDatabaseInput, UpdateBoatDatabaseInput } from "@/lib/schemas"

export class BoatsService {
  private boatModel = new BoatModel()

  async getBoatsByUserId(userId: string) {
    return await this.boatModel.getBoatsByUserId(userId)
  }

  async createBoat(userId: string, formData: unknown) {
    const validatedData = validateCreateBoat(formData)

    const boatData: CreateBoatDatabaseInput = {
      userId,
      model: validatedData.model,
      brand: validatedData.brand,
      year: validatedData.year ? parseInt(validatedData.year) : undefined,
      size: validatedData.size ? Math.round(parseFloat(validatedData.size)) : undefined,
      price: `${validatedData.currency || 'EUR'} ${validatedData.price}`,
      location: validatedData.location,
      description: validatedData.description,
      equipment: validatedData.equipment,
      owner: validatedData.owner,
      engine: validatedData.engine,
      engineHours: validatedData.engineHours ? parseInt(validatedData.engineHours) : undefined
    }

    return await this.boatModel.createBoat(boatData)
  }

  async updateBoat(userId: string, id: string, formData: unknown) {
    const validatedData = validateUpdateBoat(formData)
    
    const updateData: UpdateBoatDatabaseInput = {}
    
    if (validatedData.model) updateData.model = validatedData.model
    if (validatedData.brand) updateData.brand = validatedData.brand
    if (validatedData.year) updateData.year = parseInt(validatedData.year)
    if (validatedData.size) updateData.size = Math.round(parseFloat(validatedData.size))
    if (validatedData.price && validatedData.currency) updateData.price = `${validatedData.currency} ${validatedData.price}`
    if (validatedData.location) updateData.location = validatedData.location
    if (validatedData.description) updateData.description = validatedData.description
    if (validatedData.equipment) updateData.equipment = validatedData.equipment
    if (validatedData.owner) updateData.owner = validatedData.owner
    if (validatedData.engine) updateData.engine = validatedData.engine
    if (validatedData.engineHours) updateData.engineHours = parseInt(validatedData.engineHours)

    return await this.boatModel.updateBoat(userId, id, updateData)
  }

  async deleteBoat(userId: string, id: string) {
    await this.boatModel.deleteBoat(userId, id)
  }

  async getBoatById(userId: string, id: string) {
    return await this.boatModel.getBoatById(userId, id)
  }

  async getBoatsForPortfolio(userId: string) {
    return await this.boatModel.getBoatsForPortfolio(userId)
  }

  async searchBoats(userId: string, criteria: unknown) {
    const validatedCriteria = validateBoatSearch(criteria)
    return await this.boatModel.searchBoats(userId, validatedCriteria)
  }
}
