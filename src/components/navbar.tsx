'use client'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '../../supabase/client'
import { Button } from './ui/button'
import { User as LucideUser, UserCircle } from 'lucide-react'
import UserProfile from './user-profile'
import { useEffect, useState } from 'react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { ThemeSwitcher } from './theme-switcher'

export default function Navbar() {
  const supabase = createClient()
  const [user, setUser] = useState<SupabaseUser | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  return (
    <nav className="w-full border-b border-gray-200 bg-white dark:bg-black dark:border-black glass py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="flex items-center text-xl font-bold">
          <span className="sr-only">Recall Home</span>
          <Image
            src="/light-mode-logo.png"
            alt="Recall Logo"
            width={180}
            height={60}
            className="block dark:hidden h-16 w-auto"
            priority
          />
          <Image
            src="/dark-mode-logo.png"
            alt="Recall Logo Dark"
            width={180}
            height={60}
            className="hidden dark:block h-16 w-auto"
            priority
          />
        </Link>
        <div className="flex gap-2 md:gap-4 items-center">
          <ThemeSwitcher />
          <Link href="/notes">
            <Button variant="secondary" className="rounded-full px-4 py-2 text-sm font-medium">
              Notes
            </Button>
          </Link>
          {user ? (
            <>
              <Link href="/dashboard">
                <Button className="rounded-full px-4 py-2 text-sm font-medium">
                  Dashboard
                </Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="outline" className="rounded-full px-4 py-2 text-sm font-medium">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="default" className="rounded-full px-4 py-2 text-sm font-medium">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
