"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Globe, Bell, Lock, User } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useLanguage } from "@/context/language-context"

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage()
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    workout: true,
    updates: false,
  })

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
        <h1 className="text-3xl font-bold tracking-tight premium-text-gradient">{t("nav.settings")}</h1>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <nav className="flex flex-col space-y-1">
              <Button variant="ghost" className="justify-start text-spark-silver-100 bg-spark-dark-700">
                <Globe className="mr-2 h-4 w-4" />
                {t("settings.language")}
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-spark-silver-300 hover:text-white hover:bg-spark-dark-700"
              >
                <Bell className="mr-2 h-4 w-4" />
                {t("settings.notifications")}
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-spark-silver-300 hover:text-white hover:bg-spark-dark-700"
              >
                <Lock className="mr-2 h-4 w-4" />
                {t("settings.security")}
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-spark-silver-300 hover:text-white hover:bg-spark-dark-700"
              >
                <User className="mr-2 h-4 w-4" />
                {t("settings.account")}
              </Button>
            </nav>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-spark-silver-100">{t("settings.language")}</CardTitle>
                <CardDescription className="text-spark-silver-400">{t("settings.language_desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={language}
                  onValueChange={(value) => setLanguage(value as "en" | "ar")}
                  className="space-y-4"
                >
                  <div
                    className={`flex items-center space-x-2 rounded-md border p-4 ${language === "en" ? "border-spark-red-500 bg-spark-dark-700" : "border-spark-dark-600"}`}
                  >
                    <RadioGroupItem value="en" id="en" className="border-spark-silver-400" />
                    <Label htmlFor="en" className="flex flex-1 cursor-pointer">
                      <div>
                        <div className="font-medium text-spark-silver-100">{t("settings.english")}</div>
                        <div className="text-sm text-spark-silver-400">English</div>
                      </div>
                    </Label>
                  </div>
                  <div
                    className={`flex items-center space-x-2 rounded-md border p-4 ${language === "ar" ? "border-spark-red-500 bg-spark-dark-700" : "border-spark-dark-600"}`}
                  >
                    <RadioGroupItem value="ar" id="ar" className="border-spark-silver-400" />
                    <Label htmlFor="ar" className="flex flex-1 cursor-pointer">
                      <div>
                        <div className="font-medium text-spark-silver-100">{t("settings.arabic")}</div>
                        <div className="text-sm text-spark-silver-400">العربية</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-spark-silver-100">{t("settings.notifications")}</CardTitle>
                <CardDescription className="text-spark-silver-400">{t("settings.notifications_desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-spark-silver-100">{t("settings.email_notifications")}</h3>
                      <p className="text-sm text-spark-silver-400">{t("settings.email_notifications_desc")}</p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-spark-silver-100">{t("settings.push_notifications")}</h3>
                      <p className="text-sm text-spark-silver-400">{t("settings.push_notifications_desc")}</p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-spark-silver-100">{t("settings.workout_reminders")}</h3>
                      <p className="text-sm text-spark-silver-400">{t("settings.workout_reminders_desc")}</p>
                    </div>
                    <Switch
                      checked={notifications.workout}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, workout: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-spark-silver-100">{t("settings.product_updates")}</h3>
                      <p className="text-sm text-spark-silver-400">{t("settings.product_updates_desc")}</p>
                    </div>
                    <Switch
                      checked={notifications.updates}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, updates: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

