'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '../../supabase/client'
import { useRouter } from 'next/navigation'

interface SessionManagerProps {
  children: React.ReactNode
  timeoutDays?: number
}

export default function SessionManager({ children, timeoutDays = 7 }: SessionManagerProps) {
  const supabase = createClient()
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout>()
  const lastActivityRef = useRef<number>(Date.now())

  // Reset timer on user activity
  const resetTimer = () => {
    lastActivityRef.current = Date.now()
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    const timeoutMs = timeoutDays * 24 * 60 * 60 * 1000 // Convert days to milliseconds
    
    timeoutRef.current = setTimeout(async () => {
      // Check if user has been inactive for the specified time
      const timeSinceLastActivity = Date.now() - lastActivityRef.current
      
      if (timeSinceLastActivity >= timeoutMs) {
        // User has been inactive, sign them out
        await supabase.auth.signOut()
        router.push('/sign-in?message=session_expired')
      }
    }, timeoutMs)
  }

  // Handle user activity events
  const handleActivity = () => {
    resetTimer()
  }

  useEffect(() => {
    // Set up activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    // Start the timer
    resetTimer()

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [timeoutDays])

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/sign-in')
        return
      }

      // Check if session is expired
      const expiresAt = session.expires_at
      if (expiresAt && Date.now() > expiresAt * 1000) {
        await supabase.auth.signOut()
        router.push('/sign-in?message=session_expired')
      }
    }

    checkSession()
  }, [supabase, router])

  return <>{children}</>
} 