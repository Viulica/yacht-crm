import { NextRequest, NextResponse } from "next/server"
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

export async function GET(request: NextRequest) {
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

    // Categorize reminders
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    const categorizedReminders: {
      overdue: ReminderClient[]
      today: ReminderClient[]
      tomorrow: ReminderClient[]
      thisWeek: ReminderClient[]
      upcoming: ReminderClient[]
    } = {
      overdue: [],
      today: [],
      tomorrow: [],
      thisWeek: [],
      upcoming: []
    }

    clients.forEach(client => {
      if (!client.toContact) return

      const reminderDate = new Date(client.toContact)
      reminderDate.setHours(0, 0, 0, 0)

      if (reminderDate < today) {
        categorizedReminders.overdue.push(client)
      } else if (reminderDate.getTime() === today.getTime()) {
        categorizedReminders.today.push(client)
      } else if (reminderDate.getTime() === tomorrow.getTime()) {
        categorizedReminders.tomorrow.push(client)
      } else if (reminderDate <= nextWeek) {
        categorizedReminders.thisWeek.push(client)
      } else {
        categorizedReminders.upcoming.push(client)
      }
    })

    return NextResponse.json({
      reminders: categorizedReminders,
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