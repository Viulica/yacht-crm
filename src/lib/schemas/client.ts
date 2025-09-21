import { z } from 'zod'

// Base client schema for validation
export const ClientSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().uuid(),
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  state: z.string().optional(),
  model: z.string().optional(),
  year: z.number().int().optional(),
  location: z.string().optional(),
  equipment: z.string().optional(),
  value: z.number().int().optional(),
  modelInterest: z.string().optional(),
  yearInterest: z.number().int().optional(),
  equipmentInterest: z.string().optional(),
  budget: z.number().int().optional(),
  otherInterests: z.string().optional(),
  firstContact: z.string().optional(),
  toContact: z.date().optional(),
  toContactText: z.string().optional(),
  communication: z.string().optional(),
  importance: z.number().int().optional(),
  currentBoatId: z.string().cuid().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

// Schema for creating a client (frontend form data)
export const CreateClientSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().refine((val) => {
    if (!val) return true
    // Basic phone validation - can be enhanced
    return /^[\+]?[1-9][\d]{0,15}$/.test(val.replace(/[\s\-\(\)]/g, ''))
  }, "Invalid phone number"),
  company: z.string().max(100, "Company name too long").optional(),
  boatType: z.string().max(100, "Boat type too long").optional(),
  budget: z.enum(['under-500k', '500k-1m', '1m-5m', '5m-10m', '10m-plus']).optional(),
  notes: z.string().max(2000, "Notes too long").optional()
})

// Schema for updating a client
export const UpdateClientSchema = CreateClientSchema.partial()

// Schema for client reminder
export const ClientReminderSchema = z.object({
  date: z.string().refine((val) => {
    if (!val) return true
    const date = new Date(val)
    return !isNaN(date.getTime()) && date > new Date()
  }, "Invalid future date").optional(),
  note: z.string().max(500, "Reminder note too long").optional()
})

// Schema for client search criteria
export const ClientSearchSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  modelInterest: z.string().optional(),
  minBudget: z.number().int().min(0).optional(),
  maxBudget: z.number().int().min(0).optional(),
  hasReminder: z.boolean().optional(),
  importance: z.number().int().min(1).max(5).optional()
})

// Schema for client with reminder (database result)
export const ClientWithReminderSchema = ClientSchema.pick({
  id: true,
  name: true,
  email: true,
  phone: true,
  modelInterest: true,
  toContact: true,
  toContactText: true
})

// Type exports
export type Client = z.infer<typeof ClientSchema>
export type CreateClientInput = z.infer<typeof CreateClientSchema>
export type UpdateClientInput = z.infer<typeof UpdateClientSchema>
export type ClientReminderInput = z.infer<typeof ClientReminderSchema>
export type ClientSearchInput = z.infer<typeof ClientSearchSchema>
export type ClientWithReminder = z.infer<typeof ClientWithReminderSchema>

// Validation helper functions
export const validateCreateClient = (data: unknown): CreateClientInput => {
  return CreateClientSchema.parse(data)
}

export const validateUpdateClient = (data: unknown): UpdateClientInput => {
  return UpdateClientSchema.parse(data)
}

export const validateClientReminder = (data: unknown): ClientReminderInput => {
  return ClientReminderSchema.parse(data)
}

export const validateClientSearch = (data: unknown): ClientSearchInput => {
  return ClientSearchSchema.parse(data)
}

export const validateClientWithReminder = (data: unknown): ClientWithReminder => {
  return ClientWithReminderSchema.parse(data)
}

// Reminder modal types
export interface ReminderModal {
  isOpen: boolean
  client: Client | null
}

export interface ReminderForm {
  date: string
  note: string
}
