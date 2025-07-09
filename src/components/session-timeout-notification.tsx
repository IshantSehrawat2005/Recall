'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { X } from 'lucide-react'

interface SessionTimeoutNotificationProps {
  timeoutDays: number
  warningDays: number
}

export default function SessionTimeoutNotification({ 
  timeoutDays, 
  warningDays = 1 
}: SessionTimeoutNotificationProps) {
  const supabase = createClient()
  const router = useRouter()
  const [showWarning, setShowWarning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(warningDays * 24 * 60 * 60)

  useEffect(() => {
    let warningTimeout: NodeJS.Timeout
    let logoutTimeout: NodeJS.Timeout
    let countdownInterval: NodeJS.Timeout

    const setupTimers = () => {
      const warningTime = (timeoutDays - warningDays) * 24 * 60 * 60 * 1000
      const logoutTime = timeoutDays * 24 * 60 * 60 * 1000

      // Set warning timer
      warningTimeout = setTimeout(() => {
        setShowWarning(true)
        setTimeLeft(warningDays * 24 * 60 * 60) // Convert days to seconds
        
        // Start countdown
        countdownInterval = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }, warningTime)

      // Set logout timer
      logoutTimeout = setTimeout(async () => {
        await supabase.auth.signOut()
        router.push('/sign-in?message=session_expired')
      }, logoutTime)
    }

    // Reset timers on user activity
    const resetTimers = () => {
      clearTimeout(warningTimeout)
      clearTimeout(logoutTimeout)
      clearInterval(countdownInterval)
      setShowWarning(false)
      setupTimers()
    }

    // Activity events
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    events.forEach(event => {
      document.addEventListener(event, resetTimers, true)
    })

    setupTimers()

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimers, true)
      })
      clearTimeout(warningTimeout)
      clearTimeout(logoutTimeout)
      clearInterval(countdownInterval)
    }
  }, [timeoutDays, warningDays, supabase, router])

  const handleExtendSession = () => {
    setShowWarning(false)
    // Trigger activity to reset timers
    document.dispatchEvent(new Event('click'))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!showWarning) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
              Session Timeout Warning
            </h3>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-3">
              Your session will expire in <span className="font-mono font-bold">{formatTime(timeLeft)}</span> due to inactivity.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleExtendSession}
                className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs"
              >
                Stay Logged In
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowWarning(false)}
                className="text-xs"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 