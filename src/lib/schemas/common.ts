import { z } from 'zod'

// Common validation schemas used across the application

// Pagination schema
export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

// ID parameter schema
export const IdParamSchema = z.object({
  id: z.string().cuid("Invalid ID format")
})

// UUID parameter schema
export const UuidParamSchema = z.object({
  id: z.string().uuid("Invalid UUID format")
})

// Search query schema
export const SearchQuerySchema = z.object({
  q: z.string().min(1, "Search query cannot be empty").max(100, "Search query too long"),
  ...PaginationSchema.shape
})

// Date range schema
export const DateRangeSchema = z.object({
  startDate: z.string().refine((val) => {
    const date = new Date(val)
    return !isNaN(date.getTime())
  }, "Invalid start date"),
  endDate: z.string().refine((val) => {
    const date = new Date(val)
    return !isNaN(date.getTime())
  }, "Invalid end date")
}).refine((data) => {
  return new Date(data.startDate) <= new Date(data.endDate)
}, "Start date must be before end date")

// File upload schema
export const FileUploadSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
  size: z.number().int().min(1).max(10 * 1024 * 1024, "File too large (max 10MB)"),
  type: z.string().refine((val) => {
    return val.startsWith('image/') || val.startsWith('application/pdf')
  }, "Invalid file type")
})

// API response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional()
})

export const ApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  code: z.string().optional(),
  details: z.any().optional()
})

export const ApiSuccessSchema = z.object({
  success: z.literal(true),
  data: z.any(),
  message: z.string().optional()
})

// Type exports
export type PaginationInput = z.infer<typeof PaginationSchema>
export type IdParam = z.infer<typeof IdParamSchema>
export type UuidParam = z.infer<typeof UuidParamSchema>
export type SearchQuery = z.infer<typeof SearchQuerySchema>
export type DateRange = z.infer<typeof DateRangeSchema>
export type FileUpload = z.infer<typeof FileUploadSchema>
export type ApiResponse = z.infer<typeof ApiResponseSchema>
export type ApiError = z.infer<typeof ApiErrorSchema>
export type ApiSuccess = z.infer<typeof ApiSuccessSchema>

// Validation helper functions
export const validatePagination = (data: unknown): PaginationInput => {
  return PaginationSchema.parse(data)
}

export const validateIdParam = (data: unknown): IdParam => {
  return IdParamSchema.parse(data)
}

export const validateUuidParam = (data: unknown): UuidParam => {
  return UuidParamSchema.parse(data)
}

export const validateSearchQuery = (data: unknown): SearchQuery => {
  return SearchQuerySchema.parse(data)
}

export const validateDateRange = (data: unknown): DateRange => {
  return DateRangeSchema.parse(data)
}

export const validateFileUpload = (data: unknown): FileUpload => {
  return FileUploadSchema.parse(data)
}

export const validateApiResponse = (data: unknown): ApiResponse => {
  return ApiResponseSchema.parse(data)
}
