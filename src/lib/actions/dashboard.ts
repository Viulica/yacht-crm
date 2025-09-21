'use server'

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { DashboardService } from "@/lib/services"

const dashboardService = new DashboardService()

export async function getDashboardStats() {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error("Unauthorized")
    }

    const stats = await dashboardService.getDashboardStats(user.id)
    return { success: true, data: stats }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch dashboard stats" }
  }
}

export async function getReminders() {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error("Unauthorized")
    }

    const reminders = await dashboardService.getReminders(user.id)
    return { success: true, data: reminders }
  } catch (error) {
    console.error("Error fetching reminders:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch reminders" }
  }
}
