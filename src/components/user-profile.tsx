"use client";
import {
  UserCircle,
  User,
  Settings,
  LogOut,
  BookOpen,
  BarChart3,
  Heart,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function UserProfile() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
        setUserProfile(profile);
      }
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          <Avatar className="h-10 w-10 border-2 border-blue-200 dark:border-blue-800">
            <AvatarImage
              src={userProfile?.avatar_url || user?.user_metadata?.avatar_url}
              alt={userProfile?.display_name || user?.email}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
              {userProfile?.display_name?.charAt(0) ||
                user?.email?.charAt(0) ||
                "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 glass-card border-white/20 shadow-2xl"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2 p-2">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={
                    userProfile?.avatar_url || user?.user_metadata?.avatar_url
                  }
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {userProfile?.display_name?.charAt(0) ||
                    user?.email?.charAt(0) ||
                    "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-semibold leading-none">
                  {userProfile?.display_name || "User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground mt-1">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/20 dark:bg-gray-800/50" />

        <DropdownMenuItem
          asChild
          className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          <Link href="/profile" className="flex items-center">
            <User className="mr-3 h-4 w-4 text-blue-600" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20"
        >
          <Link href="/dashboard" className="flex items-center">
            <BookOpen className="mr-3 h-4 w-4 text-purple-600" />
            <span>My Highlights</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20"
        >
          <Link href="/graph" className="flex items-center">
            <BarChart3 className="mr-3 h-4 w-4 text-green-600" />
            <span>Knowledge Graph</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/20"
        >
          <Link href="/favorites" className="flex items-center">
            <Heart className="mr-3 h-4 w-4 text-pink-600" />
            <span>Favorites</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/20"
        >
          <Link href="/settings" className="flex items-center">
            <Settings className="mr-3 h-4 w-4 text-gray-600" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/20 dark:bg-gray-800/50" />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-red-600 dark:text-red-400 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20"
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
