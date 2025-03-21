"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Users, Dumbbell, Utensils, MessageSquare, Plus } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import { getProfile } from "@/lib/profile-service"
import { getAllSubscriptions } from "@/lib/subscription-service"
import { getAllMealPlans } from "@/lib/meal-plan-service"
import { getAllCoachNotes } from "@/lib/coach-notes-service"
import { MembersList } from "@/components/admin/members-list"
import { MealPlansList } from "@/components/admin/meal-plans-list"
import { CoachNotesList } from "@/components/admin/coach-notes-list"
import { WorkoutsList } from "@/components/admin/workouts-list"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { initializeDatabase } from "@/lib/db-init"
import { isSupabaseConfigured } from "@/lib/supabase"

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("members")
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [members, setMembers] = useState([])
  const [mealPlans, setMealPlans] = useState([])
  const [coachNotes, setCoachNotes] = useState([])
  const { user } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        router.push("/login")
        return
      }

      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        toast({
          title: "Configuration Error",
          description: "Supabase is not properly configured. Please check your environment variables.",
          variant: "destructive",
        })
        router.push("/dashboard")
        return
      }

      setIsLoading(true)
      try {
        // Initialize database if needed
        await initializeDatabase()

        const profile = await getProfile(user.id)

        // Check if the user is an admin
        if (!profile || profile?.role !== "admin") {
          // Check if this is the specific user we want to make admin
          if (user.email === "mohammedmshannon@icloud.com") {
            // Update user to be admin
            const { updateProfile } = await import("@/lib/profile-service")
            await updateProfile(user.id, { role: "admin" })
            setIsAdmin(true)
          } else {
            toast({
              title: "Access Denied",
              description: "You do not have permission to access the admin dashboard",
              variant: "destructive",
            })
            router.push("/dashboard")
            return
          }
        } else {
          setIsAdmin(true)
        }

        // Load initial data
        try {
          const subscriptionsData = await getAllSubscriptions()
          setMembers(subscriptionsData || [])
        } catch (error) {
          console.error("Error fetching subscriptions:", error)
          setMembers([])
        }

        try {
          const mealPlansData = await getAllMealPlans()
          setMealPlans(mealPlansData || [])
        } catch (error) {
          console.error("Error fetching meal plans:", error)
          setMealPlans([])
        }

        try {
          const coachNotesData = await getAllCoachNotes()
          setCoachNotes(coachNotesData || [])
        } catch (error) {
          console.error("Error fetching coach notes:", error)
          setCoachNotes([])
        }
      } catch (error) {
        console.error("Error checking admin status:", error)
        router.push("/dashboard")
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminStatus()
  }, [user, router])

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <div className="flex justify-center items-center h-64">
          <p className="text-spark-silver-400">{t("loading")}</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null // This will be handled by the useEffect redirect
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <div className="mb-6">
        <Link href="/dashboard" passHref>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("back_to_dashboard")}
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight premium-text-gradient">{t("admin.dashboard")}</h1>
          <div className="flex gap-2">
            <Link href="/admin/add-workout" passHref>
              <Button size="sm" className="premium-button">
                <Plus className="mr-2 h-4 w-4" />
                {t("admin.add_workout")}
              </Button>
            </Link>
            <Link href="/admin/add-meal-plan" passHref>
              <Button size="sm" className="premium-button">
                <Plus className="mr-2 h-4 w-4" />
                {t("admin.add_meal")}
              </Button>
            </Link>
            <Link href="/admin/add-note" passHref>
              <Button size="sm" className="premium-button">
                <Plus className="mr-2 h-4 w-4" />
                {t("admin.add_note")}
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="premium-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-spark-silver-100">{t("admin.total_members")}</CardTitle>
              <Users className="h-4 w-4 text-spark-silver-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-spark-silver-100">{members.length}</div>
              <p className="text-xs text-spark-silver-400">{t("admin.active_members")}</p>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-spark-silver-100">{t("admin.total_workouts")}</CardTitle>
              <Dumbbell className="h-4 w-4 text-spark-silver-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-spark-silver-100">24</div>
              <p className="text-xs text-spark-silver-400">{t("admin.assigned_workouts")}</p>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-spark-silver-100">{t("admin.total_meal_plans")}</CardTitle>
              <Utensils className="h-4 w-4 text-spark-silver-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-spark-silver-100">{mealPlans.length}</div>
              <p className="text-xs text-spark-silver-400">{t("admin.active_meal_plans")}</p>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-spark-silver-100">{t("admin.total_notes")}</CardTitle>
              <MessageSquare className="h-4 w-4 text-spark-silver-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-spark-silver-100">{coachNotes.length}</div>
              <p className="text-xs text-spark-silver-400">{t("admin.coach_feedback")}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-spark-dark-700 border border-spark-dark-600">
            <TabsTrigger value="members" className="data-[state=active]:bg-spark-dark-800">
              {t("admin.members")}
            </TabsTrigger>
            <TabsTrigger value="workouts" className="data-[state=active]:bg-spark-dark-800">
              {t("admin.workouts")}
            </TabsTrigger>
            <TabsTrigger value="meal-plans" className="data-[state=active]:bg-spark-dark-800">
              {t("admin.meal_plans")}
            </TabsTrigger>
            <TabsTrigger value="notes" className="data-[state=active]:bg-spark-dark-800">
              {t("admin.notes")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-4">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-spark-silver-100">{t("admin.members_list")}</CardTitle>
                <CardDescription className="text-spark-silver-400">{t("admin.members_list_desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <MembersList members={members} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workouts" className="space-y-4">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-spark-silver-100">{t("admin.workouts_list")}</CardTitle>
                <CardDescription className="text-spark-silver-400">{t("admin.workouts_list_desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <WorkoutsList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meal-plans" className="space-y-4">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-spark-silver-100">{t("admin.meal_plans_list")}</CardTitle>
                <CardDescription className="text-spark-silver-400">{t("admin.meal_plans_list_desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <MealPlansList mealPlans={mealPlans} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-spark-silver-100">{t("admin.notes_list")}</CardTitle>
                <CardDescription className="text-spark-silver-400">{t("admin.notes_list_desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <CoachNotesList coachNotes={coachNotes} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

