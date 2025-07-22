import { createClient } from '../../../../supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  // Get all users data
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            User Data
          </h1>
          <p className="text-muted-foreground mt-2">
            All user profiles and their information
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-semibold">Name</th>
                  <th className="text-left p-3 font-semibold">Email</th>
                  <th className="text-left p-3 font-semibold">Display Name</th>
                  <th className="text-left p-3 font-semibold">Gender</th>
                  <th className="text-left p-3 font-semibold">Reason</th>
                  <th className="text-left p-3 font-semibold">Profile Completed</th>
                  <th className="text-left p-3 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-3">{user.name || 'N/A'}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.display_name || 'N/A'}</td>
                    <td className="p-3">{user.gender || 'N/A'}</td>
                    <td className="p-3">{user.reason || 'N/A'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.profile_completed 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {user.profile_completed ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Total Users: {users?.length || 0}
            </p>
            <p className="text-muted-foreground text-sm">
              Completed Profiles: {users?.filter(u => u.profile_completed).length || 0}
            </p>
          </div>
        </div>

        <div className="mt-8 bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold mb-4">Database Information</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Table:</strong> users</p>
            <p><strong>Database:</strong> Supabase PostgreSQL</p>
            <p><strong>Location:</strong> Supabase Dashboard → Table Editor → users</p>
            <p><strong>Direct Access:</strong> <a href="https://supabase.com/dashboard/project/qotalhnrodkhocjxmgne/editor" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Supabase Dashboard</a></p>
          </div>
        </div>
      </div>
    </div>
  )
} 