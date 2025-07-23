import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function POST() {
  try {
    console.log('🚪 Signout request received')
    
    const supabase = await createServerSupabaseClient()
    
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('❌ Supabase signout error:', error)
    } else {
      console.log('✅ Supabase signout successful')
    }

    // Create response
    const response = NextResponse.json({
      message: "Signed out successfully"
    })

    // Clear all session cookies
    const cookieOptions = {
      path: '/',
      maxAge: 0, // Expire immediately
      httpOnly: true,
      sameSite: 'lax' as const
    }
    
    response.cookies.set('sb-access-token', '', cookieOptions)
    response.cookies.set('sb-refresh-token', '', cookieOptions)
    
    // Also clear the Supabase auth token cookie (format: sb-{project-ref}-auth-token)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (supabaseUrl) {
      const projectRef = supabaseUrl.split('//')[1]?.split('.')[0]
      if (projectRef) {
        response.cookies.set(`sb-${projectRef}-auth-token`, '', cookieOptions)
        console.log('🧹 Cleared auth token cookie:', `sb-${projectRef}-auth-token`)
      }
    }
    
    console.log('🧹 All session cookies cleared')
    return response

  } catch (error) {
    console.error("❌ Signout error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 