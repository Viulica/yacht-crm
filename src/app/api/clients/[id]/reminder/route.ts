import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { toContact, toContactText } = await request.json()
    const { id: clientId } = await params

    // Verify client belongs to current user
    const existingClient = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId: user.id
      }
    })

    if (!existingClient) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      )
    }

    // Update reminder fields
    const updatedClient = await prisma.client.update({
      where: {
        id: clientId
      },
      data: {
        toContact: toContact ? new Date(toContact) : null,
        toContactText: toContactText || null,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      message: "Reminder updated successfully",
      client: updatedClient
    })

  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id: clientId } = await params

    // Verify client belongs to current user
    const existingClient = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId: user.id
      }
    })

    if (!existingClient) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      )
    }

    // Clear reminder fields
    const updatedClient = await prisma.client.update({
      where: {
        id: clientId
      },
      data: {
        toContact: null,
        toContactText: null,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      message: "Reminder removed successfully",
      client: updatedClient
    })

  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 