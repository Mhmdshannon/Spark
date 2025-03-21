"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, CheckCircle, Clock } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import { getUserSubscription, getDaysLeft, isSubscriptionActive } from "@/lib/subscription-service"
import type { Subscription } from "@/lib/types"
import { Progress } from "@/components/ui/progress"

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { t } = useLanguage()

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        const subscriptionData = await getUserSubscription(user.id)
        setSubscription(subscriptionData)
      } catch (error) {
        console.error("Error fetching subscription:", error)
        setSubscription(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubscription()
  }, [user])

  const daysLeft = subscription ? getDaysLeft(subscription.end_date) : 0
  const totalDays = subscription ? 
    Math.ceil((new Date(subscription.end_date).getTime() - new Date(subscription.start_date).getTime()) / (1000 * 60 * 60 * 24)) :
    30
  const percentLeft = Math.max(0, Math.min(100, Math.round((daysLeft / totalDays) * 100)))
  const active = isSubscriptionActive(subscription)

  if (isLoading) {\
    return ( * 100)))
  const active = isSubscriptionActive(subscription)

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
        <h1 className="text-3xl font-bold tracking-tight premium-text-gradient">{t("subscription.title")}</h1>

        {subscription ? (
          <Card className="premium-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-spark-silver-100">
                  {subscription.plan_type ? 
                    (subscription.plan_type.charAt(0).toUpperCase() + subscription.plan_type.slice(1)) : ''} {t("subscription.plan")}
                </CardTitle>
                <div className={`px-3 py-1 rounded-full text-sm ${active ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'}`}>
                  {active ? t("subscription.active") : t("subscription.expired")}
                </div>
              </div>
              <CardDescription className="text-spark-silver-400">
                {active ? `${daysLeft} ${t("subscription.days_left")}` : t("subscription.expired_message")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-spark-silver-300">
                    <Calendar className="mr-2 h-4 w-4 text-spark-silver-400" />
                    <span>{t("subscription.joined")}</span>
                  </div>
                  <p className="text-xl font-medium text-spark-silver-100">
                    {subscription.start_date ? new Date(subscription.start_date).toLocaleDateString() : ''}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-spark-silver-300">
                    <Clock className="mr-2 h-4 w-4 text-spark-silver-400" />
                    <span>{t("subscription.expires")}</span>
                  </div>
                  <p className="text-xl font-medium text-spark-silver-100">
                    {subscription.end_date ? new Date(subscription.end_date).toLocaleDateString() : ''}
                  </p>
                </div>
              </div>

              {active && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-spark-silver-300">{t("subscription.progress")}</span>
                    <span className="text-spark-silver-300">{percentLeft}%</span>
                  </div>
                  <Progress value={percentLeft} className="h-2 bg-spark-dark-600" indicatorClassName="bg-spark-red-500" />
                </div>
              )}

              <div className="pt-4">
                <Link href="/payment" passHref>
                  <Button className="w-full premium-button">
                    {t("subscription.renew")}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="text-spark-silver-100">{t("subscription.no_subscription")}</CardTitle>
              <CardDescription className="text-spark-silver-400">
                {t("subscription.no_subscription_desc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/payment" passHref>
                <Button className="w-full premium-button">
                  {t("subscription.get_started")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="text-spark-silver-100">{t("subscription.membership_benefits")}</CardTitle>
            <CardDescription className="text-spark-silver-400">
              {t("subscription.benefits_desc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                t("subscription.benefit_1"),
                t("subscription.benefit_2"),
                t("subscription.benefit_3"),
                t("subscription.benefit_4"),
                t("subscription.benefit_5"),
              ].map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-spark-red-500 shrink-0 mt-0.5" />
                  <span className="text-spark-silver-200">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

