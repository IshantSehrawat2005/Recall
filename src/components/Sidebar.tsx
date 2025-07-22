"use client";
import React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { PlusCircle, Home, Network, Users, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '../../supabase/client';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Graph', href: '/graph', icon: Network },
  { name: 'Community', href: '/community', icon: Users },
];

export default function Sidebar({ onAddNote }: { onAddNote?: () => void }) {
  const { theme, systemTheme } = useTheme();
  const isDark = (theme === 'dark') || (theme === 'system' && systemTheme === 'dark');
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/sign-in');
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-40 bg-black border-r border-gray-900 flex flex-col items-center w-20 py-6`}
    >
      {/* Logo */}
      <div className="mb-8 flex items-center justify-center w-full">
        <Link href="/dashboard" className="flex items-center justify-center w-full">
          <Image
            src={isDark ? '/light-mode-logo.png' : '/dark-mode-logo.png'}
            alt="Recall Logo"
            width={60}
            height={32}
            className="object-contain"
            priority
          />
        </Link>
      </div>
      {/* Navigation */}
      <nav className="flex flex-col gap-6 w-full items-center mb-8">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center gap-1 text-gray-300 hover:text-white transition-colors"
          >
            <item.icon className="w-7 h-7" />
            <span className="text-xs font-medium mt-1">{item.name}</span>
          </Link>
        ))}
      </nav>
      {/* Add Button */}
      <button
        className="my-6 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:scale-110 transition-transform text-2xl"
        onClick={onAddNote}
        aria-label="Add Note"
      >
        <PlusCircle className="w-7 h-7" />
      </button>
      {/* Spacer */}
      <div className="flex-1" />
      {/* Sign Out Button */}
      <button
        className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 text-red-400 hover:bg-red-600 hover:text-white transition-all"
        onClick={handleSignOut}
        aria-label="Sign Out"
      >
        <LogOut className="w-6 h-6" />
      </button>
    </aside>
  );
} 