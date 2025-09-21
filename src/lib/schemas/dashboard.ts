import { z } from 'zod'

// Schema for dashboard stats
export const DashboardStatsSchema = z.object({
  clientCount: z.number().int().min(0),
  boatCount: z.number().int().min(0),
  portfolioValue: z.number().int().min(0),
  totalActiveReminders: z.number().int().min(0)
})

// Schema for individual reminder (raw data from API)
export const ReminderSchema = z.object({
  id: z.string().cuid(),
  name: z.string().nullable(),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  modelInterest: z.string().nullable(),
  toContact: z.date().nullable(),
  toContactText: z.string().nullable()
})

// Schema for individual reminder with priority (processed data)
export const PriorityReminderSchema = z.object({
  id: z.string().cuid(),
  name: z.string().nullable(),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  modelInterest: z.string().nullable(),
  toContact: z.date().nullable(),
  toContactText: z.string().nullable(),
  priority: z.enum(['overdue', 'today', 'tomorrow', 'thisWeek', 'upcoming'])
})

// Schema for reminder categories
export const ReminderCategorySchema = z.object({
  overdue: z.array(ReminderSchema),
  today: z.array(ReminderSchema),
  tomorrow: z.array(ReminderSchema),
  thisWeek: z.array(ReminderSchema),
  upcoming: z.array(ReminderSchema)
})

// Schema for dashboard data (complete dashboard response)
export const DashboardDataSchema = z.object({
  stats: DashboardStatsSchema,
  reminders: ReminderCategorySchema
})

// Type exports
export type DashboardStats = z.infer<typeof DashboardStatsSchema>
export type Reminder = z.infer<typeof ReminderSchema>
export type PriorityReminder = z.infer<typeof PriorityReminderSchema>
export type RemindersData = z.infer<typeof ReminderCategorySchema>
export type ReminderCategory = z.infer<typeof ReminderCategorySchema>
export type DashboardData = z.infer<typeof DashboardDataSchema>

// Validation helper functions
export const validateDashboardStats = (data: unknown): DashboardStats => {
  return DashboardStatsSchema.parse(data)
}

export const validateReminderCategory = (data: unknown): ReminderCategory => {
  return ReminderCategorySchema.parse(data)
}

export const validateDashboardData = (data: unknown): DashboardData => {
  return DashboardDataSchema.parse(data)
}
