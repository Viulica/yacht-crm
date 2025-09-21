
'use server'

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { BoatsService } from "@/lib/services"
import { validateCreateBoat, validateUpdateBoat, validateIdParam } from "@/lib/schemas"
import { ZodError } from "zod"

const boatsService = new BoatsService()

export async function getBoats() {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: "Unauthorized" }
    }

    const boats = await boatsService.getBoatsByUserId(user.id)
    return { success: true, data: boats }
  } catch (error) {
    console.error("Error fetching boats:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch boats" }
  }
}

export async function createBoat(formData: unknown) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: "Unauthorized" }
    }

    const validatedData = validateCreateBoat(formData)
    const boat = await boatsService.createBoat(user.id, validatedData)
    return { success: true, data: boat }
  } catch (error) {
    console.error("Error creating boat:", error)
    
    if (error instanceof ZodError) {
      return { success: false, error: "Validation failed", details: error.issues }
    }
    
    return { success: false, error: error instanceof Error ? error.message : "Failed to create boat" }
  }
}

export async function updateBoat(id: string, formData: unknown) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: "Unauthorized" }
    }

    const validatedId = validateIdParam({ id })
    const boat = await boatsService.updateBoat(user.id, validatedId.id, formData)
    return { success: true, data: boat }
  } catch (error) {
    console.error("Error updating boat:", error)
    
    if (error instanceof ZodError) {
      return { success: false, error: "Validation failed", details: error.issues }
    }
    
    return { success: false, error: error instanceof Error ? error.message : "Failed to update boat" }
  }
}

export async function deleteBoat(id: string) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: "Unauthorized" }
    }

    const validatedId = validateIdParam({ id })
    await boatsService.deleteBoat(user.id, validatedId.id)
    return { success: true, message: "Boat deleted successfully" }
  } catch (error) {
    console.error("Error deleting boat:", error)
    
    if (error instanceof ZodError) {
      return { success: false, error: "Validation failed", details: error.issues }
    }
    
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete boat" }
  }
}
