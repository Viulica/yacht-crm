import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createServerSupabaseClient } from "@/lib/supabase-server"

interface ReminderClient {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  toContact: Date | null
  toContactText: string | null
  modelInterest: string | null
}

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current user from Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get all clients with active reminders for the current user
    const clients = await prisma.client.findMany({
      where: {
        userId: user.id,
        toContact: {
          not: null
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        toContact: true,
        toContactText: true,
        modelInterest: true
      },
      orderBy: {
        toContact: 'asc'
      }
    })

    return NextResponse.json({
      reminders: clients,
      total: clients.length
    })

  } catch (error) {
    console.error("Error fetching reminders:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 