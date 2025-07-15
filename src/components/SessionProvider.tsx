"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshSession: async () => {}
})

export function useAuth() {
  return useContext(AuthContext)
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshSession = async () => {
    try {
      console.log('🔄 Refreshing session...')
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('❌ Session refresh error:', error)
        setUser(null)
      } else if (session?.user) {
        console.log('✅ Session refreshed for:', session.user.email)
        setUser(session.user)
      } else {
        console.log('❌ No session found during refresh')
        setUser(null)
      }
    } catch (error) {
      console.error('❌ Session refresh error:', error)
      setUser(null)
    }
  }

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        console.log('🔍 SessionProvider: Starting session check...')
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Session error:', error)
        }
        
        if (session?.user) {
          console.log('✅ Found session:', session.user.email)
          setUser(session.user)
        } else {
          console.log('❌ No session found')
          setUser(null)
        }
      } catch (error) {
        console.error('❌ Session check error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.email || 'no user')
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ User signed in:', session.user.email)
          setUser(session.user)
        } else if (event === 'SIGNED_OUT') {
          console.log('🚪 User signed out')
          setUser(null)
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('🔄 Token refreshed for:', session.user.email)
          setUser(session.user)
        } else if (session?.user) {
          setUser(session.user)
        } else {
          setUser(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      console.log('🚪 Starting signout process...')
      
      // ✅ IMMEDIATELY clear state for instant UI response
      setUser(null)
      setLoading(false)
      
      // Clear client-side session (in background)
      await supabase.auth.signOut()
      console.log('✅ Client session cleared')
      
      // Use server endpoint to clear cookies (in background)
      try {
        const response = await fetch('/api/auth/supabase/signout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        
        if (response.ok) {
          console.log('✅ Server cookies cleared')
        } else {
          console.log('⚠️ Failed to clear server cookies, but proceeding with redirect')
        }
      } catch (error) {
        console.log('⚠️ Server signout error:', error)
      }
      
      // Redirect to signin
      window.location.href = '/auth/signin'
      
    } catch (error) {
      console.error('❌ Sign out error:', error)
      
      // Even if there's an error, clear local state and redirect
      setUser(null)
      setLoading(false)
      window.location.href = '/auth/signin'
    }
  }

  console.log('🎯 SessionProvider render - user:', user?.email || 'null', 'loading:', loading)

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  )
} 