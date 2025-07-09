import { createClient } from '../../../../supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Check if user has completed profile
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: userProfile } = await supabase
          .from('users')
          .select('profile_completed')
          .eq('id', user.id)
          .single()

        if (userProfile?.profile_completed) {
          // User has completed profile, redirect to dashboard or next
          return NextResponse.redirect(`${origin}${next}`)
        } else {
          // User hasn't completed profile, redirect to profile setup
          return NextResponse.redirect(`${origin}/profile-setup`)
        }
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
} 