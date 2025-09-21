import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Server configuration error - admin client not available" },
        { status: 500 }
      )
    }

    const { email, password, name, company } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Sign up user with Supabase Auth using admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name: name || null,
        company: company || null,
        role: 'BROKER'
      },
      email_confirm: true // Force email as confirmed - skip email verification
    })

    if (authError) {
      console.error("Supabase auth error:", authError)
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 400 }
      )
    }

    // Create user record in our custom User table using Prisma
    try {
      await prisma.user.create({
        data: {
          id: authData.user.id, // Use Supabase Auth user ID
          email: authData.user.email!,
          name: name || null,
          company: company || null,
          role: 'BROKER',
          isActive: true
        }
      })
    } catch (dbError) {
      console.error("Database insert error:", dbError)
      // If database insert fails, we should clean up the auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: "Failed to create user profile" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: name,
        company: company,
        role: 'BROKER'
      }
    })

  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

