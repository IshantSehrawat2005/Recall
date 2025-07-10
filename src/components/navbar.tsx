"use client";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "../../supabase/client";
import { Button } from "./ui/button";
import UserProfile from "./user-profile";
import { useEffect, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { ThemeSwitcher } from "./theme-switcher";
import { Home, Network, Users, BookOpen, Menu, X } from "lucide-react";

export default function Navbar() {
  const supabase = createClient();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Graph", href: "/graph", icon: Network },
    { name: "Community", href: "/groups", icon: Users },
    { name: "Notes", href: "/notes", icon: BookOpen },
  ];

  return (
    <nav className="w-full glass-card sticky top-0 z-50 border-b border-gray-200/50 dark:border-gray-800/50 animate-fade-in-up">
      <div className="container mx-auto px-4 flex justify-between items-center py-3">
        <Link href="/" prefetch className="flex items-center gap-2">
          <span className="sr-only">Recall Home</span>
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Recall
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex gap-8 items-center">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:scale-105 group"
                >
                  <Icon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeSwitcher />
          {user ? (
            <UserProfile />
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="rounded-full px-6 py-2 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="rounded-full px-6 py-2 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeSwitcher />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200/50 dark:border-gray-800/50 bg-white/95 dark:bg-black/95 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}

              {user ? (
                <div className="pt-4 border-t border-gray-200/50 dark:border-gray-800/50">
                  <UserProfile />
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-4 border-t border-gray-200/50 dark:border-gray-800/50">
                  <Link
                    href="/sign-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
