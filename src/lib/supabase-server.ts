import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Server-side Supabase client for server components (read-only)
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {
          // No-op for server components - cookies can't be modified here
        },
      },
    }
  )

  return supabase
}

// Server-side Supabase client for API routes (can modify cookies)
export const createServerSupabaseClientForAPI = async () => {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, ...options }) => {
            cookieStore.set({ name, value, ...options })
          })
        },
      },
    }
  )

  return supabase
} 