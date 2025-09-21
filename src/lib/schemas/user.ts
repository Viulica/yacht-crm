import { z } from 'zod'

// Base user schema for validation
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(['ADMIN', 'BROKER', 'MANAGER']),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date()
})

// Schema for creating a user
export const CreateUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email("Invalid email address"),
  name: z.string().max(100, "Name too long").optional(),
  company: z.string().max(100, "Company name too long").optional(),
  phone: z.string().optional().refine((val) => {
    if (!val) return true
    return /^[\+]?[1-9][\d]{0,15}$/.test(val.replace(/[\s\-\(\)]/g, ''))
  }, "Invalid phone number"),
  role: z.enum(['ADMIN', 'BROKER', 'MANAGER']).default('BROKER')
})

// Schema for updating a user
export const UpdateUserSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  name: z.string().max(100, "Name too long").optional(),
  company: z.string().max(100, "Company name too long").optional(),
  phone: z.string().optional().refine((val) => {
    if (!val) return true
    return /^[\+]?[1-9][\d]{0,15}$/.test(val.replace(/[\s\-\(\)]/g, ''))
  }, "Invalid phone number"),
  role: z.enum(['ADMIN', 'BROKER', 'MANAGER']).optional(),
  isActive: z.boolean().optional()
})

// Schema for user profile update (what users can update themselves)
export const UserProfileSchema = z.object({
  name: z.string().max(100, "Name too long").optional(),
  company: z.string().max(100, "Company name too long").optional(),
  phone: z.string().optional().refine((val) => {
    if (!val) return true
    return /^[\+]?[1-9][\d]{0,15}$/.test(val.replace(/[\s\-\(\)]/g, ''))
  }, "Invalid phone number")
})

// Type exports
export type User = z.infer<typeof UserSchema>
export type CreateUserInput = z.infer<typeof CreateUserSchema>
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>
export type UserProfileInput = z.infer<typeof UserProfileSchema>

// Validation helper functions
export const validateCreateUser = (data: unknown): CreateUserInput => {
  return CreateUserSchema.parse(data)
}

export const validateUpdateUser = (data: unknown): UpdateUserInput => {
  return UpdateUserSchema.parse(data)
}

export const validateUserProfile = (data: unknown): UserProfileInput => {
  return UserProfileSchema.parse(data)
}
