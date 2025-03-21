import type React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Dumbbell, TrendingUp, User } from "lucide-react"
import { WorkoutCard } from "@/components/workout-card"
import { UpcomingWorkouts } from "@/components/upcoming-workouts"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-spark-dark-900 text-spark-silver-200">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight premium-text-gradient">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Link href="/profile" passHref>
            <Button
              variant="outline"
              size="sm"
              className="h-9 border-spark-dark-600 text-spark-silver-200 hover:bg-spark-dark-700"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </Link>
          <Link href="/workout-timer" passHref>
            <Button size="sm" className="h-9 premium-button">
              <Clock className="mr-2 h-4 w-4" />
              Start Workout
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-spark-dark-700 border border-spark-dark-600">
          <TabsTrigger value="overview" className="data-[state=active]:bg-spark-dark-800">
            Overview
          </TabsTrigger>
          <TabsTrigger value="workouts" className="data-[state=active]:bg-spark-dark-800">
            Workouts
          </TabsTrigger>
          <TabsTrigger value="progress" className="data-[state=active]:bg-spark-dark-800">
            Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="premium-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-spark-silver-100">Weekly Workouts</CardTitle>
                <Dumbbell className="h-4 w-4 text-spark-silver-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-spark-silver-100">4/5</div>
                <p className="text-xs text-spark-silver-400">1 workout remaining this week</p>
                <Progress value={80} className="mt-2 bg-spark-dark-600" indicatorClassName="bg-spark-red-500" />
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-spark-silver-100">Workout Streak</CardTitle>
                <TrendingUp className="h-4 w-4 text-spark-silver-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-spark-silver-100">12 days</div>
                <p className="text-xs text-spark-silver-400">+3 days from last week</p>
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-spark-silver-100">Next Workout</CardTitle>
                <Calendar className="h-4 w-4 text-spark-silver-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-spark-silver-100">Today</div>
                <p className="text-xs text-spark-silver-400">Upper Body - 5:00 PM</p>
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-spark-silver-100">Monthly Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-spark-silver-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-spark-silver-100">+8%</div>
                <p className="text-xs text-spark-silver-400">Strength increase this month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 premium-card">
              <CardHeader>
                <CardTitle className="text-spark-silver-100">Today&apos;s Workout</CardTitle>
                <CardDescription className="text-spark-silver-400">Upper Body Strength - Coach Mike</CardDescription>
              </CardHeader>
              <CardContent>
                <WorkoutCard />
              </CardContent>
            </Card>

            <Card className="col-span-3 premium-card">
              <CardHeader>
                <CardTitle className="text-spark-silver-100">Upcoming Workouts</CardTitle>
                <CardDescription className="text-spark-silver-400">Your schedule for the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingWorkouts />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workouts" className="space-y-4">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="text-spark-silver-100">Your Workout Plan</CardTitle>
              <CardDescription className="text-spark-silver-400">
                Personalized by Coach Mike - Updated 3 days ago
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Link href="/workouts/upper-body" passHref>
                  <Button
                    variant="outline"
                    className="w-full justify-between border-spark-dark-600 text-spark-silver-200 hover:bg-spark-dark-700"
                  >
                    Upper Body Strength
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/workouts/lower-body" passHref>
                  <Button
                    variant="outline"
                    className="w-full justify-between border-spark-dark-600 text-spark-silver-200 hover:bg-spark-dark-700"
                  >
                    Lower Body Power
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/workouts/core" passHref>
                  <Button
                    variant="outline"
                    className="w-full justify-between border-spark-dark-600 text-spark-silver-200 hover:bg-spark-dark-700"
                  >
                    Core & Stability
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/workouts/cardio" passHref>
                  <Button
                    variant="outline"
                    className="w-full justify-between border-spark-dark-600 text-spark-silver-200 hover:bg-spark-dark-700"
                  >
                    HIIT Cardio
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/workouts/recovery" passHref>
                  <Button
                    variant="outline"
                    className="w-full justify-between border-spark-dark-600 text-spark-silver-200 hover:bg-spark-dark-700"
                  >
                    Active Recovery
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="text-spark-silver-100">Progress Tracking</CardTitle>
              <CardDescription className="text-spark-silver-400">Your fitness journey visualized</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium text-spark-silver-100">Progress Photos</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="relative aspect-square overflow-hidden rounded-md border border-spark-dark-600">
                    <img src="/placeholder.svg?height=200&width=200" alt="Progress" className="object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 text-xs text-white">
                      Jan 2023
                    </div>
                  </div>
                  <div className="relative aspect-square overflow-hidden rounded-md border border-spark-dark-600">
                    <img src="/placeholder.svg?height=200&width=200" alt="Progress" className="object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 text-xs text-white">
                      Mar 2023
                    </div>
                  </div>
                  <div className="relative aspect-square overflow-hidden rounded-md border border-spark-dark-600">
                    <img src="/placeholder.svg?height=200&width=200" alt="Progress" className="object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 text-xs text-white">
                      Jun 2023
                    </div>
                  </div>
                </div>
                <Link href="/profile/progress" passHref>
                  <Button
                    variant="outline"
                    className="mt-2 w-full border-spark-dark-600 text-spark-silver-200 hover:bg-spark-dark-700"
                  >
                    View All Photos
                  </Button>
                </Link>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-spark-silver-100">Strength Progress</h3>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between">
                      <span className="text-spark-silver-200">Bench Press</span>
                      <span className="font-medium text-spark-silver-100">185 lbs (+15 lbs)</span>
                    </div>
                    <Progress value={75} className="h-2 bg-spark-dark-600" indicatorClassName="bg-spark-red-500" />
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span className="text-spark-silver-200">Squat</span>
                      <span className="font-medium text-spark-silver-100">225 lbs (+25 lbs)</span>
                    </div>
                    <Progress value={65} className="h-2 bg-spark-dark-600" indicatorClassName="bg-spark-red-500" />
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span className="text-spark-silver-200">Deadlift</span>
                      <span className="font-medium text-spark-silver-100">275 lbs (+20 lbs)</span>
                    </div>
                    <Progress value={80} className="h-2 bg-spark-dark-600" indicatorClassName="bg-spark-red-500" />
                  </div>
                </div>
                <Link href="/profile/strength" passHref>
                  <Button
                    variant="outline"
                    className="mt-2 w-full border-spark-dark-600 text-spark-silver-200 hover:bg-spark-dark-700"
                  >
                    View Detailed Progress
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

