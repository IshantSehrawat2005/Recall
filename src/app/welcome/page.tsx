'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../../supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle, Sparkles, ArrowRight, BookOpen, Brain, Search, Filter, Home } from 'lucide-react'
import Link from 'next/link'

export default function WelcomePage() {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if this is a new user (coming from profile setup)
    const newUserParam = searchParams.get('new')
    if (newUserParam === '1') {
      setIsNewUser(true)
    }

    const getUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()

          if (profile) {
            // Check if profile is completed, if not redirect to profile setup
            if (!profile.profile_completed) {
              router.push('/profile-setup')
              return
            }
            setUserProfile(profile)
          } else {
            // No profile found, redirect to profile setup
            router.push('/profile-setup')
            return
          }
        } else {
          // No user found, redirect to sign in
          router.push('/sign-in')
          return
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
        // On error, redirect to profile setup to be safe
        router.push('/profile-setup')
        return
      } finally {
        setLoading(false)
      }
    }

    getUserProfile()
  }, [supabase, router, searchParams])

  const handleGetStarted = () => {
    router.push('/dashboard')
  }

  // Auto-redirect new users to dashboard after 10 seconds
  useEffect(() => {
    if (isNewUser && userProfile) {
      const timer = setTimeout(() => {
        router.push('/dashboard')
      }, 10000) // 10 seconds

      // Countdown timer
      const countdownTimer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => {
        clearTimeout(timer)
        clearInterval(countdownTimer)
      }
    }
  }, [isNewUser, userProfile, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your welcome...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950 dark:via-black dark:to-purple-950"></div>
      
      {/* Navigation */}
      <div className="relative z-20 p-4">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Recall
          </Link>
                      <div className="flex gap-4">
              <Link href="/dashboard">
                <Button variant="outline" className="backdrop-blur-sm bg-white/50 dark:bg-black/50 border-white/20 hover:bg-white/70 dark:hover:bg-black/70">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/debug-profile">
                <Button variant="outline" className="backdrop-blur-sm bg-white/50 dark:bg-black/50 border-white/20 hover:bg-white/70 dark:hover:bg-black/70">
                  Debug Profile
                </Button>
              </Link>
            </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-4">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Welcome to Recall
            </h1>
            
            <div className="text-2xl md:text-3xl text-foreground mb-4">
              Hello,{' '}
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-bold">
                {userProfile?.display_name || userProfile?.name || 'there'}!
              </span>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isNewUser 
                ? "Your personal knowledge engine is ready to help you capture, organize, and learn from everything that matters to you."
                : "Welcome back! Your personal knowledge engine is ready to help you continue your learning journey."
              }
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="backdrop-blur-xl bg-white/70 dark:bg-black/70 rounded-2xl border border-white/20 shadow-2xl p-8 text-center hover:shadow-3xl transition-all duration-500 hover:scale-105 group">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Capture Everything</h3>
              <p className="text-muted-foreground">
                Save highlights from web pages, YouTube videos, PDFs, and more with just a click.
              </p>
            </div>

            <div className="backdrop-blur-xl bg-white/70 dark:bg-black/70 rounded-2xl border border-white/20 shadow-2xl p-8 text-center hover:shadow-3xl transition-all duration-500 hover:scale-105 group">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI-Powered Insights</h3>
              <p className="text-muted-foreground">
                Get smart summaries, pattern detection, and personalized learning recommendations.
              </p>
            </div>

            <div className="backdrop-blur-xl bg-white/70 dark:bg-black/70 rounded-2xl border border-white/20 shadow-2xl p-8 text-center hover:shadow-3xl transition-all duration-500 hover:scale-105 group">
              <div className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Smart Organization</h3>
              <p className="text-muted-foreground">
                Organize your knowledge with tags, categories, and intelligent search capabilities.
              </p>
            </div>
          </div>

          {/* Get Started Section */}
          <div className="text-center">
            <div className="backdrop-blur-xl bg-white/70 dark:bg-black/70 rounded-2xl border border-white/20 shadow-2xl p-8 mb-8">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-yellow-500 mr-2" />
                <h2 className="text-2xl font-semibold">Ready to Start Your Journey?</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Begin capturing your first highlight and see how Recall transforms the way you learn and remember.
              </p>
              
              <Button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-8 py-4 text-lg font-semibold group"
              >
                {isNewUser ? `Get Started (${countdown}s)` : 'Get Started'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div className="backdrop-blur-sm bg-white/30 dark:bg-black/30 rounded-lg p-4">
                <div className="font-semibold text-foreground">Profile Complete</div>
                <div>All set up and ready to go</div>
              </div>
              <div className="backdrop-blur-sm bg-white/30 dark:bg-black/30 rounded-lg p-4">
                <div className="font-semibold text-foreground">Privacy First</div>
                <div>Your data stays yours</div>
              </div>
              <div className="backdrop-blur-sm bg-white/30 dark:bg-black/30 rounded-lg p-4">
                <div className="font-semibold text-foreground">Cross-Platform</div>
                <div>Works everywhere you do</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 