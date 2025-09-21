import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClientForAPI } from "@/lib/supabase-server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClientForAPI()
    
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
    }

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

    console.log('Signin successful for:', authData.user.email)
    return response

  } catch (error) {
    console.error("Signin error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

