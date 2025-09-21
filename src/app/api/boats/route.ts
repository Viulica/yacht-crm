import { NextRequest, NextResponse } from "next/server"
import { getBoats, createBoat, updateBoat } from "@/lib/actions"

export async function GET() {
  const result = await getBoats()
  
  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: result.error === "Unauthorized" ? 401 : 500 }
    )
  }

  return NextResponse.json({ boats: result.data })
}

export async function POST(request: NextRequest) {
  const formData = await request.json()
  const result = await createBoat(formData)
  
  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: result.error === "Unauthorized" ? 401 : 400 }
    )
  }

  return NextResponse.json({
    message: "Boat created successfully",
    boat: result.data
  })
}

export async function PUT(request: NextRequest) {
  const { boatId, ...formData } = await request.json()
  const result = await updateBoat(boatId, formData)
  
  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: result.error === "Unauthorized" ? 401 : 400 }
    )
  }

  return NextResponse.json({
    message: "Boat updated successfully",
    boat: result.data
  })
} 