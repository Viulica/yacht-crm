import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Use standard Supabase client for authentication
    // supabase provjerava credentials u auth.users i ako je validno generira JWT token unutar authData
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      console.error("Signin error:", authError)
      return NextResponse.json(
        { error: authError.message },
        { status: 401 }
      )
    }

    if (!authData.user || !authData.session) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Get user data from our custom User table using Prisma
    let userData = null
    try {
      userData = await prisma.user.findUnique({
        where: { id: authData.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          company: true,
          role: true,
          isActive: true
        }
      })
    } catch (userError) {
      console.error("User data fetch error:", userError)
      // Continue without userData - use auth metadata instead
    }

    // Create response with session data for client-side storage
    const response = NextResponse.json({
      message: "Signed in successfully",
      user: userData || {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.user_metadata?.name || null,
        company: authData.user.user_metadata?.company || null,
        role: authData.user.user_metadata?.role || 'BROKER'
      },
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_at: authData.session.expires_at,
        expires_in: authData.session.expires_in,
        user: authData.user
      }
    })

    // Set session cookies for server-side API routes
    response.cookies.set('sb-access-token', authData.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: authData.session.expires_in,
      path: '/'
    })

    response.cookies.set('sb-refresh-token', authData.session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    })

    console.log('✅ Signin successful for:', authData.user.email)
    return response

  } catch (error) {
    console.error("Signin error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 