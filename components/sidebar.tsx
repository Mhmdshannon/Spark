"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Home,
  Settings,
  Users,
  Dumbbell,
  Camera,
  Clock,
  BookOpen,
  CreditCard,
  Utensils,
  MessageSquare,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/language-context"

export function Sidebar() {
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    <div className="hidden border-r border-spark-dark-600 bg-spark-dark-800 md:block md:w-64">
      <div className="flex h-full flex-col gap-2 p-4">
        <nav className="grid gap-1">
          <Link href="/dashboard" passHref>
            <Button
              variant="ghost"
              className={cn(
                "flex w-full items-center justify-start gap-2 text-spark-silver-300 hover:text-white",
                pathname === "/dashboard" && "bg-spark-dark-700 text-white",
              )}
            >
              <Home className="h-5 w-5" />
              {t("nav.dashboard")}
            </Button>
          </Link>
          <Link href="/workouts/upper-body" passHref>
            <Button
              variant="ghost"
              className={cn(
                "flex w-full items-center justify-start gap-2 text-spark-silver-300 hover:text-white",
                pathname.startsWith("/workouts") && "bg-spark-dark-700 text-white",
              )}
            >
              <Dumbbell className="h-5 w-5" />
              {t("nav.workouts")}
            </Button>
          </Link>
          <Link href="/exercise-library" passHref>
            <Button
              variant="ghost"
              className={cn(
                "flex w-full items-center justify-start gap-2 text-spark-silver-300 hover:text-white",
                pathname === "/exercise-library" && "bg-spark-dark-700 text-white",
              )}
            >
              <BookOpen className="h-5 w-5" />
              {t("nav.exercises")}
            </Button>
          </Link>
          <Link href="/meal-plans" passHref>
            <Button
              variant="ghost"
              className={cn(
                "flex w-full items-center justify-start gap-2 text-spark-silver-300 hover:text-white",
                pathname.startsWith("/meal-plans") && "bg-spark-dark-700 text-white",
              )}
            >
              <Utensils className="h-5 w-5" />
              {t("nav.meal_plans")}
            </Button>
          </Link>
          <Link href="/coach-notes" passHref>
            <Button
              variant="ghost"
              className={cn(
                "flex w-full items-center justify-start gap-2 text-spark-silver-300 hover:text-white",
                pathname.startsWith("/coach-notes") && "bg-spark-dark-700 text-white",
              )}
            >
              <MessageSquare className="h-5 w-5" />
              {t("nav.coach_notes")}
            </Button>
          </Link>
          <Link href="/workout-timer" passHref>
            <Button
              variant="ghost"
              className={cn(
                "flex w-full items-center justify-start gap-2 text-spark-silver-300 hover:text-white",
                pathname === "/workout-timer" && "bg-spark-dark-700 text-white",
              )}
            >
              <Clock className="h-5 w-5" />
              {t("nav.timer")}
            </Button>
          </Link>
          <Link href="/profile" passHref>
            <Button
              variant="ghost"
              className={cn(
                "flex w-full items-center justify-start gap-2 text-spark-silver-300 hover:text-white",
                pathname === "/profile" && "bg-spark-dark-700 text-white",
              )}
            >
              <Users className="h-5 w-5" />
              {t("nav.profile")}
            </Button>
          </Link>
          <Link href="/progress" passHref>
            <Button
              variant="ghost"
              className={cn(
                "flex w-full items-center justify-start gap-2 text-spark-silver-300 hover:text-white",
                pathname === "/progress" && "bg-spark-dark-700 text-white",
              )}
            >
              <Camera className="h-5 w-5" />
              {t("nav.progress")}
            </Button>
          </Link>
          <Link href="/analytics" passHref>
            <Button
              variant="ghost"
              className={cn(
                "flex w-full items-center justify-start gap-2 text-spark-silver-300 hover:text-white",
                pathname === "/analytics" && "bg-spark-dark-700 text-white",
              )}
            >
              <BarChart3 className="h-5 w-5" />
              {t("nav.analytics")}
            </Button>
          </Link>
          <Link href="/subscription" passHref>
            <Button
              variant="ghost"
              className={cn(
                "flex w-full items-center justify-start gap-2 text-spark-silver-300 hover:text-white",
                pathname === "/subscription" && "bg-spark-dark-700 text-white",
              )}
            >
              <CreditCard className="h-5 w-5" />
              {t("nav.subscription")}
            </Button>
          </Link>
          <Link href="/settings" passHref>
            <Button
              variant="ghost"
              className={cn(
                "flex w-full items-center justify-start gap-2 text-spark-silver-300 hover:text-white",
                pathname === "/settings" && "bg-spark-dark-700 text-white",
              )}
            >
              <Settings className="h-5 w-5" />
              {t("nav.settings")}
            </Button>
          </Link>
        </nav>
      </div>
    </div>
  )
}

