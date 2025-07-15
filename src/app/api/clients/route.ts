import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createServerSupabaseClient } from "@/lib/supabase-server"

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

    // Get all clients for the current user with reminder fields
    const clients = await prisma.client.findMany({
      where: {
        userId: user.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        state: true,
        modelInterest: true,
        budget: true,
        communication: true,
        toContact: true,
        toContactText: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ clients })

  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    // Check if user exists in our User table, create if not
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    })

    if (!dbUser) {
      console.log('🔄 User not found in database, creating user record:', user.email)
      try {
        dbUser = await prisma.user.create({
          data: {
            id: user.id,
            email: user.email!,
            name: user.user_metadata?.name || null,
            company: user.user_metadata?.company || null,
            role: 'BROKER',
            isActive: true
          }
        })
        console.log('✅ User record created successfully')
      } catch (createError) {
        console.error('❌ Failed to create user record:', createError)
        return NextResponse.json(
          { error: "Failed to create user profile" },
          { status: 500 }
        )
      }
    }

    const { name, email, phone, company, budget, boatType, notes } = await request.json()

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      )
    }

    // Check if client with this email already exists for this user
    const existingClient = await prisma.client.findFirst({
      where: {
        email,
        userId: user.id
      }
    })

    if (existingClient) {
      return NextResponse.json(
        { error: "Client with this email already exists" },
        { status: 400 }
      )
    }

    // Map frontend fields to database schema fields
    const budgetMapping: { [key: string]: number } = {
      'under-500k': 500000,
      '500k-1m': 750000,
      '1m-5m': 3000000,
      '5m-10m': 7500000,
      '10m-plus': 15000000
    }

    const clientData = {
      name: name,
      email: email,
      phone: phone || null,
      state: company || null, // Map company to state field
      modelInterest: boatType || null, // Map boatType to modelInterest
      budget: budget ? budgetMapping[budget] || null : null, // Map budget string to number
      communication: notes || null, // Map notes to communication
      userId: user.id
    }

    // Create client using Prisma (cleaner than raw SQL)
    const client = await prisma.client.create({
      data: clientData
    })

    return NextResponse.json({
      message: "Client created successfully",
      client
    })

  } catch (error) {
    console.error("Error creating client:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 