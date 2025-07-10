'use client'

import { useEffect } from 'react'
import { createClient } from '../../../supabase/client'
import { useRouter } from 'next/navigation'

export default function SignOutPage() {
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const signOut = async () => {
      try {
        await supabase.auth.signOut()
        router.push('/')
      } catch (error) {
        console.error('Error signing out:', error)
        router.push('/')
      }
    }

    signOut()
  }, [supabase, router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Signing you out...</p>
      </div>
    </div>
  )
} 