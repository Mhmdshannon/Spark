"use client"

import Link from "next/link"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { SparkLogoFull } from "./spark-logo"
import { LanguageSelector } from "./language-selector"
import { useState, useEffect } from "react"
import { getProfile } from "@/lib/profile-service"

export function Header() {
  const { user, signOut } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const profile = await getProfile(user.id)
          setIsAdmin(profile?.role === "admin")
        } catch (error) {
          console.error("Error checking admin status:", error)
          setIsAdmin(false)
        }
      }
    }

    checkAdminStatus()
  }, [user])

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Success",
        description: "You have been logged out",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.user_metadata) return "U"

    const firstName = user.user_metadata.first_name || ""
    const lastName = user.user_metadata.last_name || ""

    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-spark-dark-600 bg-spark-dark-800 px-4 md:px-6 backdrop-blur-sm bg-opacity-90">
      <Link href="/" className="flex items-center gap-2 font-semibold text-white">
        <SparkLogoFull />
      </Link>
      <div className="ml-auto flex items-center gap-4">
        <form className="relative hidden md:flex">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-spark-silver-500" />
          <Input type="search" placeholder={t("nav.search")} className="w-64 rounded-lg premium-input pl-8" />
        </form>
        <LanguageSelector />
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-spark-silver-300 hover:text-white hover:bg-spark-dark-700"
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-spark-dark-700">
              <Avatar className="h-8 w-8 border-spark-dark-600">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                <AvatarFallback className="bg-spark-dark-600 text-spark-silver-200">{getUserInitials()}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Profile</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-spark-dark-700 border-spark-dark-600 text-spark-silver-100">
            <DropdownMenuLabel>{t("nav.profile")}</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-spark-dark-600" />
            <DropdownMenuItem className="hover:bg-spark-dark-600" onClick={() => router.push("/profile")}>
              {t("nav.profile")}
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-spark-dark-600" onClick={() => router.push("/subscription")}>
              {t("nav.subscription")}
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-spark-dark-600" onClick={() => router.push("/settings")}>
              {t("nav.settings")}
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuSeparator className="bg-spark-dark-600" />
                <DropdownMenuItem className="hover:bg-spark-dark-600" onClick={() => router.push("/admin")}>
                  {t("nav.admin")}
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator className="bg-spark-dark-600" />
            <DropdownMenuItem className="hover:bg-spark-dark-600" onClick={handleSignOut}>
              {t("nav.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

