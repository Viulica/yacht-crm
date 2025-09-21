import { createServerSupabaseClient } from './supabase-server'
import { redirect } from 'next/navigation'

export async function getServerUser() {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      console.log('❌ No user found, redirecting to signin')
      redirect('/auth/signin')
    }
    
    return user
  } catch (error) {
    console.error('Auth error:', error)
    redirect('/auth/signin')
  }
}

export async function getServerUserOrNull() {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.log('❌ Auth error:', error.message)
      return null
    }
    
    return user
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}
