import { createBrowserClient } from '@supabase/ssr'

const isServer = typeof window === 'undefined'

// Debug: Check if environment variables are loaded
if (isServer) {
  console.log('🔍 Server-side environment variables check:')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing')
  console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing')
} else {
  console.log('🔍 Client-side environment variables check:')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing')
  console.log('SUPABASE_SERVICE_ROLE_KEY: (hidden on client for security)')
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

if (isServer && !supabaseServiceKey) {
  console.warn('⚠️ Missing SUPABASE_SERVICE_ROLE_KEY environment variable - admin functions will not work')
}

// Client-side Supabase client (browser) - uses SSR package for proper cookie handling
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Admin Supabase client for server-side operations (bypasses RLS) - only use in API routes/Server Components
export const supabaseAdmin = supabaseServiceKey 
  ? createBrowserClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

if (isServer) {
  console.log('✅ Supabase clients initialized successfully (server-side)')
} else {
  console.log('✅ Supabase client initialized successfully (client-side)')
} 