"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/components/SessionProvider"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Don't redirect while still loading
    if (loading) {
      console.log('🔄 Auth still loading, waiting...')
      return
    }

    // Small delay to ensure session is fully loaded
    const redirectTimer = setTimeout(() => {
      if (user) {
        console.log('✅ User authenticated, redirecting to dashboard:', user.email)
        router.push("/dashboard")
      } else {
        console.log('❌ No authenticated user, redirecting to signin')
        router.push("/auth/signin")
      }
    }, 100)

    return () => clearTimeout(redirectTimer)
  }, [user, loading, router])

  // Show loading while determining auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Yacht CRM...</p>
        </div>
      </div>
    )
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🛥️ Yacht CRM</h1>
        <p className="text-gray-600">Professional yacht brokerage management</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mt-4"></div>
        <p className="mt-2 text-sm text-gray-500">
          {user ? 'Redirecting to dashboard...' : 'Redirecting to signin...'}
        </p>
      </div>
    </div>
  )
}
