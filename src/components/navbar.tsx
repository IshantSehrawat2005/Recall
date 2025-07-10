"use client"
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '../../supabase/client'
import { Button } from './ui/button'
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
    <nav className="w-full glass sticky top-0 z-50 border-b border-gray-200 dark:border-black animate-fade-in-up">
      <div className="container mx-auto px-4 flex justify-between items-center py-2">
        <Link href="/" prefetch className="flex items-center gap-2">
          <span className="sr-only">Recall Home</span>
          <Image
            src="/light-mode-logo.png"
            alt="Recall Logo"
            width={100}
            height={40}
            className="h-10 w-auto block dark:hidden"
            priority
          />
          <Image
            src="/dark-mode-logo.png"
            alt="Recall Logo Dark"
            width={100}
            height={40}
            className="h-10 w-auto hidden dark:block"
            priority
          />
        </Link>
        <div className="flex-1 flex justify-center">
          <div className="flex gap-2 md:gap-6 items-center">
            <Link href="/dashboard" className="px-5 py-2 rounded-full text-base font-medium text-white bg-black border-2 border-transparent hover:border-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all">
              Dashboard
            </Link>
            <Link href="/graph" className="px-5 py-2 rounded-full text-base font-medium text-white bg-black border-2 border-transparent hover:border-gradient-to-r hover:from-green-400 hover:to-blue-500 transition-all">
              Graph
            </Link>
            <Link href="/groups" className="px-5 py-2 rounded-full text-base font-medium text-white bg-black border-2 border-transparent hover:border-gradient-to-r hover:from-yellow-400 hover:to-pink-500 transition-all">
              Community
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3 h-full">
          <ThemeSwitcher />
          {user ? (
            <UserProfile />
          ) : (
            <>
              <Link href="/sign-in">
                <Button className="btn-glass rounded-full px-5 py-2 text-base font-semibold text-black dark:text-white hover:shadow-lg hover:border hover:border-blue-400 transition-all">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="btn-glass rounded-full px-5 py-2 text-base font-semibold text-white dark:text-black hover:shadow-lg hover:border hover:border-blue-400 transition-all bg-black/80 dark:bg-white/90">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
