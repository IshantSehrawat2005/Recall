'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../../supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DebugProfilePage() {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          setError(`User error: ${userError.message}`)
          return
        }

        if (!user) {
          setError('No user found')
          return
        }

        console.log('User ID:', user.id)

        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) {
          setError(`Profile error: ${profileError.message}`)
          return
        }

        console.log('Profile data:', profile)
        setUserProfile(profile)
      } catch (error) {
        console.error('Error:', error)
        setError(`Unexpected error: ${error}`)
      } finally {
        setLoading(false)
      }
    }

    getUserProfile()
  }, [supabase])

  const fixProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user && userProfile) {
        const { error } = await supabase
          .from('users')
          .update({
            profile_completed: true
          })
          .eq('id', user.id)

        if (error) {
          setError(`Fix error: ${error.message}`)
        } else {
          // Refresh the page to show updated data
          window.location.reload()
        }
      }
    } catch (error) {
      setError(`Fix error: ${error}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Profile Debug</h1>
          <Link href="/welcome">
            <Button variant="outline">Back to Welcome</Button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">Error:</h3>
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {userProfile && (
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/70 dark:bg-black/70 rounded-2xl border border-white/20 shadow-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Profile Data</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p><strong>ID:</strong> {userProfile.id}</p>
                  <p><strong>Email:</strong> {userProfile.email}</p>
                  <p><strong>Name:</strong> {userProfile.name || 'Not set'}</p>
                  <p><strong>Display Name:</strong> {userProfile.display_name || 'Not set'}</p>
                  <p><strong>Profile Completed:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      userProfile.profile_completed 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {userProfile.profile_completed ? 'Yes' : 'No'}
                    </span>
                  </p>
                </div>
                <div>
                  <p><strong>Bio:</strong> {userProfile.bio || 'Not set'}</p>
                  <p><strong>Gender:</strong> {userProfile.gender || 'Not set'}</p>
                  <p><strong>Reason:</strong> {userProfile.reason || 'Not set'}</p>
                  <p><strong>Interests:</strong> {userProfile.interests || 'Not set'}</p>
                  <p><strong>Created:</strong> {new Date(userProfile.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {!userProfile.profile_completed && (
              <div className="backdrop-blur-xl bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-800 shadow-2xl p-6">
                <h3 className="text-yellow-800 dark:text-yellow-200 font-semibold mb-2">Profile Not Completed</h3>
                <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                  Your profile is not marked as completed. This might be causing the redirect issue.
                </p>
                <Button onClick={fixProfile} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                  Fix Profile Completion
                </Button>
              </div>
            )}

            <div className="backdrop-blur-xl bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-2xl p-6">
              <h3 className="text-blue-800 dark:text-blue-200 font-semibold mb-2">Navigation</h3>
              <div className="flex gap-4">
                <Link href="/welcome">
                  <Button variant="outline">Go to Welcome</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline">Go to Dashboard</Button>
                </Link>
                <Link href="/profile-setup">
                  <Button variant="outline">Go to Profile Setup</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 