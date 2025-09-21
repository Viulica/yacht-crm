import { z } from 'zod'

// Base boat schema for validation
export const BoatSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().uuid(),
  owner: z.string().nullable(),
  brand: z.string().nullable(),
  model: z.string().nullable(),
  size: z.number().int().positive().nullable(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).nullable(),
  engine: z.string().nullable(),
  engineHours: z.number().int().min(0).nullable(),
  equipment: z.string().nullable(),
  price: z.string().nullable(),
  location: z.string().nullable(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  images: z.array(z.object({
    id: z.string().cuid(),
    filename: z.string(),
    url: z.string().url(),
    alt: z.string().nullable()
  })).optional()
})

// Schema for creating a boat (frontend form data) - matches Prisma schema exactly
export const CreateBoatSchema = z.object({
  model: z.string().min(1, "Boat model is required").max(100, "Boat model too long"),
  brand: z.string().optional(),
  year: z.string().optional().refine((val) => {
    if (!val) return true
    const year = parseInt(val)
    return year >= 1900 && year <= new Date().getFullYear() + 1
  }, "Invalid year"),
  size: z.string().optional().refine((val) => {
    if (!val) return true
    const size = parseFloat(val)
    return size > 0 && size <= 200
  }, "Invalid size"),
  price: z.string().min(1, "Price is required").refine((val) => {
    const price = parseFloat(val.replace(/[^\d.]/g, ''))
    return price > 0 && price <= 1000000000 // Max 1 billion
  }, "Invalid price"),
  currency: z.enum(['EUR', 'USD', 'GBP']).default('EUR'),
  location: z.string().max(100, "Location too long").optional(),
  description: z.string().max(2000, "Description too long").optional(),
  equipment: z.string().max(1000, "Equipment too long").optional(),
  owner: z.string().optional(),
  engine: z.string().optional(),
  engineHours: z.string().optional()
})

// Schema for updating a boat
export const UpdateBoatSchema = CreateBoatSchema.partial()

// Schema for boat search criteria
export const BoatSearchSchema = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  minYear: z.number().int().min(1900).optional(),
  maxYear: z.number().int().max(new Date().getFullYear() + 1).optional(),
  minSize: z.number().positive().optional(),
  maxSize: z.number().positive().optional(),
  location: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional()
})


// Database input schemas (matching Prisma schema)
export const CreateBoatDatabaseSchema = z.object({
  userId: z.string().uuid(),
  owner: z.string().nullable().optional(),
  brand: z.string().nullable().optional(),
  model: z.string().nullable().optional(),
  size: z.number().int().positive().nullable().optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).nullable().optional(),
  engine: z.string().nullable().optional(),
  engineHours: z.number().int().min(0).nullable().optional(),
  equipment: z.string().nullable().optional(),
  price: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  description: z.string().nullable().optional()
})

export const UpdateBoatDatabaseSchema = CreateBoatDatabaseSchema.omit({ userId: true }).partial()

// Type exports
export type Boat = z.infer<typeof BoatSchema>
export type CreateBoatInput = z.infer<typeof CreateBoatSchema>
export type UpdateBoatInput = z.infer<typeof UpdateBoatSchema>
export type CreateBoatDatabaseInput = z.infer<typeof CreateBoatDatabaseSchema>
export type UpdateBoatDatabaseInput = z.infer<typeof UpdateBoatDatabaseSchema>
export type BoatSearchInput = z.infer<typeof BoatSearchSchema>

// Form data type for the frontend form
export type BoatFormData = {
  model: string
  brand: string
  year: string
  size: string
  price: string
  currency: 'EUR' | 'USD' | 'GBP'
  location: string
  description: string
  equipment: string
  owner: string
  engine: string
  engineHours: string
}

// Image file interface for upload handling
export interface ImageFile {
  file: File
  preview: string
  id: string
}

// Validation helper functions
export const validateCreateBoat = (data: unknown): CreateBoatInput => {
  return CreateBoatSchema.parse(data)
}

export const validateUpdateBoat = (data: unknown): UpdateBoatInput => {
  return UpdateBoatSchema.parse(data)
}

export const validateBoatSearch = (data: unknown): BoatSearchInput => {
  return BoatSearchSchema.parse(data)
}

