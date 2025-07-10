import { createClient } from '../../../supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  // Get user profile
  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // If profile not completed, redirect to profile setup
  if (!userProfile?.profile_completed) {
    redirect('/profile-setup')
  }

  // If user is coming from welcome page, stay here, otherwise redirect to welcome
  // This allows the home page to be accessed directly after welcome

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Welcome back, {userProfile?.display_name || userProfile?.name}!
            </h1>
            <p className="text-xl text-muted-foreground">
              Ready to continue your journey?
            </p>
          </div>

          {/* User Profile Card */}
          <div className="backdrop-blur-xl bg-white/70 dark:bg-black/70 rounded-2xl border border-white/20 shadow-2xl p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Your Profile</h2>
                <p className="text-muted-foreground">Here's what we know about you</p>
              </div>
              <Link 
                href="/admin/users" 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                View All Users
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Display Name</label>
                  <p className="text-lg">{userProfile?.display_name || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-lg">{userProfile?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Gender</label>
                  <p className="text-lg capitalize">{userProfile?.gender || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                  <p className="text-lg">
                    {userProfile?.date_of_birth 
                      ? new Date(userProfile.date_of_birth).toLocaleDateString()
                      : 'Not specified'
                    }
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Bio</label>
                  <p className="text-lg">{userProfile?.bio || 'No bio added yet'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Reason for Joining</label>
                  <p className="text-lg capitalize">{userProfile?.reason || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Interests</label>
                  <p className="text-lg">{userProfile?.interests || 'No interests added yet'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                  <p className="text-lg">
                    {userProfile?.created_at 
                      ? new Date(userProfile.created_at).toLocaleDateString()
                      : 'Unknown'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="backdrop-blur-xl bg-white/70 dark:bg-black/70 rounded-xl border border-white/20 shadow-xl p-6 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-3xl mb-4">📝</div>
              <h3 className="text-lg font-semibold mb-2">Edit Profile</h3>
              <p className="text-muted-foreground text-sm mb-4">Update your information anytime</p>
              <Link 
                href="/profile-setup" 
                className="inline-block px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
              >
                Edit Profile
              </Link>
            </div>
            
            <div className="backdrop-blur-xl bg-white/70 dark:bg-black/70 rounded-xl border border-white/20 shadow-xl p-6 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold mb-2">View Data</h3>
              <p className="text-muted-foreground text-sm mb-4">See all user data in the database</p>
              <Link 
                href="/admin/users" 
                className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                View Users
              </Link>
            </div>
            
            <div className="backdrop-blur-xl bg-white/70 dark:bg-black/70 rounded-xl border border-white/20 shadow-xl p-6 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-3xl mb-4">🚪</div>
              <h3 className="text-lg font-semibold mb-2">Sign Out</h3>
              <p className="text-muted-foreground text-sm mb-4">Log out of your account</p>
              <Link 
                href="/sign-out" 
                className="inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Sign Out
              </Link>
            </div>
          </div>

          {/* Database Info */}
          <div className="mt-12 backdrop-blur-xl bg-white/70 dark:bg-black/70 rounded-xl border border-white/20 shadow-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Database Information</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Profile Status:</strong> 
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs">
                    Completed
                  </span>
                </p>
                <p><strong>Last Updated:</strong> 
                  {userProfile?.updated_at 
                    ? new Date(userProfile.updated_at).toLocaleString()
                    : 'Never'
                  }
                </p>
              </div>
              <div>
                <p><strong>Database:</strong> Supabase PostgreSQL</p>
                <p><strong>Table:</strong> users</p>
                <p><strong>Total Fields:</strong> 12 columns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 