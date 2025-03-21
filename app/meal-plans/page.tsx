"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Utensils } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import { getUserMealPlans } from "@/lib/meal-plan-service"
import type { MealPlan } from "@/lib/types"

export default function MealPlansPage() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { t } = useLanguage()

  useEffect(() => {
    const fetchMealPlans = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        const mealPlansData = await getUserMealPlans(user.id)
        setMealPlans(mealPlansData)
      } catch (error) {
        console.error("Error fetching meal plans:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMealPlans()
  }, [user])

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-5xl">
        <div className="flex justify-center items-center h-64">
          <p className="text-spark-silver-400">{t("loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">
      <div className="mb-6">
        <Link href="/dashboard" passHref>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("back_to_dashboard")}
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold tracking-tight premium-text-gradient">{t("meal_plans.title")}</h1>

        {mealPlans.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {mealPlans.map((mealPlan) => (
              <Link href={`/meal-plans/${mealPlan.id}`} key={mealPlan.id} passHref>
                <Card className="premium-card hover:shadow-premium-hover transition-all cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-spark-silver-100">{mealPlan.title}</CardTitle>
                    <CardDescription className="text-spark-silver-400">
                      {new Date(mealPlan.start_date).toLocaleDateString()} -{" "}
                      {new Date(mealPlan.end_date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-spark-silver-200">
                      <Calendar className="mr-2 h-4 w-4 text-spark-red-500" />
                      <span>
                        {Math.ceil(
                          (new Date(mealPlan.end_date).getTime() - new Date(mealPlan.start_date).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}{" "}
                        {t("meal_plans.days")}
                      </span>
                    </div>
                    {mealPlan.description && (
                      <p className="mt-2 text-sm text-spark-silver-300">{mealPlan.description}</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="text-spark-silver-100">{t("meal_plans.no_plans")}</CardTitle>
              <CardDescription className="text-spark-silver-400">{t("meal_plans.no_plans_desc")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Utensils className="h-16 w-16 text-spark-silver-600 mb-4" />
              <p className="text-spark-silver-300 text-center max-w-md">{t("meal_plans.no_plans_message")}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

