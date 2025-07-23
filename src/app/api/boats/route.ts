import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createServerSupabaseClient } from "@/lib/supabase-server"

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

    // Get all boats for the current user with images (temporarily without url field)
    const boats = await prisma.boat.findMany({
      where: {
        userId: user.id
      },
      include: {
        images: {
          select: {
            id: true,
            filename: true,
            alt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ boats })

  } catch (error) {
    console.error("Error fetching boats:", error)
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

    const { 
      name, 
      type, 
      year, 
      length, 
      price, 
      currency, 
      location, 
      manufacturer, 
      description, 
      features
    } = await request.json()

    // Validation
    if (!name || !type || !price) {
      return NextResponse.json(
        { error: "Name, type, and price are required" },
        { status: 400 }
      )
    }

    // Map frontend fields to database schema fields
    const boatData = {
      model: name, // Map name to model
      brand: manufacturer || null, // Map manufacturer to brand
      year: year ? parseInt(year) : null,
      size: length ? parseInt(length) : null, // Map length to size
      price: `${currency || 'EUR'} ${price}`, // Combine currency and price
      location: location || null,
      description: description || null,
      equipment: features || null, // Map features to equipment
      userId: user.id
    }

    // Create boat using Prisma (without images for now)
    const boat = await prisma.boat.create({
      data: boatData
    })

    return NextResponse.json({
      message: "Boat created successfully",
      boat: boat
    })

  } catch (error) {
    console.error("Error creating boat:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 