import { NextResponse } from "next/server"
import { createServerSupabaseClientForAPI } from "@/lib/supabase-server"

export async function POST() {
  try {
    console.log('🚪 Signout request received')
    
    const supabase = await createServerSupabaseClientForAPI()
    
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('❌ Supabase signout error:', error)
    } else {
      console.log('✅ Supabase signout successful')
    }

    // Create response - Supabase SSR client automatically clears cookies
    const response = NextResponse.json({
      message: "Signed out successfully"
    })
    
    console.log('✅ Signout completed - cookies cleared automatically')
    return response

  } catch (error) {
    console.error("❌ Signout error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 