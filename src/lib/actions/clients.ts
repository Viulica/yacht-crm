'use server'

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { ClientsService } from "@/lib/services"
import { ClientFormData } from "@/lib/schemas/client"

const clientsService = new ClientsService()

export async function getClients() {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error("Unauthorized")
    }

    const clients = await clientsService.getClientsByUserId(user.id)
    return { success: true, data: clients }
  } catch (error) {
    console.error("Error fetching clients:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch clients" }
  }
}

export async function createClient(formData: ClientFormData) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error("Unauthorized")
    }

    const client = await clientsService.createClient(user.id, formData)
    return { success: true, data: client }
  } catch (error) {
    console.error("Error creating client:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create client" }
  }
}

export async function updateClient(id: string, formData: Partial<ClientFormData>) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error("Unauthorized")
    }

    // Verify client belongs to user
    const existingClient = await prisma.client.findFirst({
      where: { id, userId: user.id }
    })

    if (!existingClient) {
      throw new Error("Client not found")
    }

    const updateData: any = {}
    if (formData.name) updateData.name = formData.name
    if (formData.email) updateData.email = formData.email
    if (formData.phone) updateData.phone = formData.phone
    if (formData.company) updateData.state = formData.company
    if (formData.boatType) updateData.modelInterest = formData.boatType
    if (formData.notes) updateData.communication = formData.notes

    const client = await prisma.client.update({
      where: { id },
      data: updateData
    })

    return { success: true, data: client }
  } catch (error) {
    console.error("Error updating client:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update client" }
  }
}

export async function deleteClient(id: string) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error("Unauthorized")
    }

    // Verify client belongs to user
    const existingClient = await prisma.client.findFirst({
      where: { id, userId: user.id }
    })

    if (!existingClient) {
      throw new Error("Client not found")
    }

    await prisma.client.delete({
      where: { id }
    })

    return { success: true, message: "Client deleted successfully" }
  } catch (error) {
    console.error("Error deleting client:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete client" }
  }
}

export async function updateClientReminder(clientId: string, reminderData: { toContact?: string | null; toContactText?: string | null }) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error("Unauthorized")
    }

    // Verify client belongs to user
    const existingClient = await prisma.client.findFirst({
      where: { id: clientId, userId: user.id }
    })

    if (!existingClient) {
      throw new Error("Client not found")
    }

    const client = await prisma.client.update({
      where: { id: clientId },
      data: {
        toContact: reminderData.toContact ? new Date(reminderData.toContact) : null,
        toContactText: reminderData.toContactText || null
      }
    })

    return { success: true, data: client }
  } catch (error) {
    console.error("Error updating client reminder:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update reminder" }
  }
}

export async function deleteClientReminder(clientId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error("Unauthorized")
    }

    // Verify client belongs to user
    const existingClient = await prisma.client.findFirst({
      where: { id: clientId, userId: user.id }
    })

    if (!existingClient) {
      throw new Error("Client not found")
    }

    const client = await prisma.client.update({
      where: { id: clientId },
      data: {
        toContact: null,
        toContactText: null
      }
    })

    return { success: true, data: client }
  } catch (error) {
    console.error("Error deleting client reminder:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete reminder" }
  }
}
