"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Camera, Edit, Dumbbell, Calendar, TrendingUp, Award } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/auth-context"
import { getProfile } from "@/lib/profile-service"
import type { Profile } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

// Helper function for consistent date formatting
function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return 'Invalid date';
  }
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        const profileData = await getProfile(user.id)
        setProfile(profileData)
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  // Get user's full name
  const getFullName = () => {
    if (profile) {
      return `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
    }

    if (user?.user_metadata) {
      return `${user.user_metadata.first_name || ""} ${user.user_metadata.last_name || ""}`.trim()
    }

    return "User"
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    const fullName = getFullName()
    if (!fullName || fullName === "User") return "U"

    const nameParts = fullName.split(" ")
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase()

    return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase()
  }

  // Only render the component after it's mounted on the client
  if (!mounted) {
    return null
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-5xl">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-400">Loading profile...</p>
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
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="relative">
            <Avatar className="h-32 w-32">
              <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Profile" />
              <AvatarFallback className="bg-gray-700 text-gray-200 text-4xl">{getUserInitials()}</AvatarFallback>
            </Avatar>
            <Button size="icon" className="absolute bottom-0 right-0 rounded-full bg-maroon-600 hover:bg-maroon-700">
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-gray-100">{getFullName()}</h1>
          {user && (
            <p className="text-gray-400">
              Member since {formatDate(user.created_at)}
            </p>
          )}
          <Button variant="outline" size="sm" className="mt-2">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        <div className="flex-1 space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-100">Profile Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-1 text-gray-100">Personal Information</h3>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-gray-400">Email:</span> {user?.email}
                    </p>
                    <p>
                      <span className="text-gray-400">Age:</span> {profile?.age || "Not set"}
                    </p>
                    <p>
                      <span className="text-gray-400">Height:</span> {profile?.height || "Not set"}
                    </p>
                    <p>
                      <span className="text-gray-400">Weight:</span>{" "}
                      {profile?.weight ? `${profile.weight} lbs` : "Not set"}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-1 text-gray-100">Fitness Goals</h3>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-gray-400">Primary Goal:</span> {profile?.primary_goal || "Build Muscle"}
                    </p>
                    <p>
                      <span className="text-gray-400">Target Weight:</span>{" "}
                      {profile?.target_weight ? `${profile.target_weight} lbs` : "Not set"}
                    </p>
                    <p>
                      <span className="text-gray-400">Weekly Workouts:</span> {profile?.weekly_workouts || 5}
                    </p>
                    <p>
                      <span className="text-gray-400">Coach:</span> {profile?.coach || "Mike Johnson"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-100">Current Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-100">Weight Goal</span>
                    <span className="text-sm font-medium text-gray-100">
                      {profile?.weight || 175} / {profile?.target_weight || 185} lbs
                    </span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-100">Strength Progress</span>
                    <span className="text-sm font-medium text-gray-100">70%</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-100">Workout Consistency</span>
                    <span className="text-sm font-medium text-gray-100">90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress Photos</TabsTrigger>
          <TabsTrigger value="stats">Workout Stats</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">Workout Summary</CardTitle>
              <CardDescription className="text-gray-200">Your fitness activity over the past 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-100">Total Workouts</h3>
                  <p className="text-3xl font-bold text-gray-100">18</p>
                  <p className="text-sm text-gray-400">+3 from last month</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-100">Workout Hours</h3>
                  <p className="text-3xl font-bold text-gray-100">22.5</p>
                  <p className="text-sm text-gray-400">+4.5 from last month</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-100">Avg. Workout Duration</h3>
                  <p className="text-3xl font-bold text-gray-100">75 min</p>
                  <p className="text-sm text-gray-400">+5 min from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">Recent Achievements</CardTitle>
              <CardDescription className="text-gray-200">Your latest milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-700 p-2 rounded-full">
                    <Dumbbell className="h-5 w-5 text-maroon-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-100">New PR: Bench Press</h3>
                    <p className="text-sm text-gray-400">You reached 185 lbs on bench press</p>
                    <p className="text-xs text-gray-400">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-700 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-maroon-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-100">Consistency Streak</h3>
                    <p className="text-sm text-gray-400">You've worked out for 12 days in a row</p>
                    <p className="text-xs text-gray-400">Ongoing</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-700 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-maroon-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-100">Weight Goal Progress</h3>
                    <p className="text-sm text-gray-400">You're 85% of the way to your target weight</p>
                    <p className="text-xs text-gray-400">Updated 1 week ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">Progress Photos</CardTitle>
              <CardDescription className="text-gray-200">Track your physical transformation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-100">Upload New Photo</h3>
                  <Button className="bg-maroon-600 hover:bg-maroon-700">
                    <Camera className="mr-2 h-4 w-4" />
                    Add Photo
                  </Button>
                </div>

                <div>
                  <h3 className="font-medium mb-4 text-gray-100">Photo Timeline</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="space-y-2">
                        <div className="relative aspect-square overflow-hidden rounded-md border">
                          <img
                            src="/placeholder.svg?height=300&width=300"
                            alt={`Progress ${index + 1}`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <p className="text-sm font-medium text-gray-100">
                          {new Date(2023, 6 - index, 15).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-400">Weight: {175 - index} lbs</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">Strength Progress</CardTitle>
              <CardDescription className="text-gray-200">Track your lifting improvements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4 text-gray-100">Main Lifts</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-gray-100">Bench Press</span>
                        <span className="text-gray-100">185 lbs (+15 lbs)</span>
                      </div>
                      <Progress value={75} className="h-2" />
                      <div className="flex justify-between mt-1 text-xs text-gray-400">
                        <span>Starting: 135 lbs</span>
                        <span>Goal: 225 lbs</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-gray-100">Squat</span>
                        <span className="text-gray-100">225 lbs (+25 lbs)</span>
                      </div>
                      <Progress value={65} className="h-2" />
                      <div className="flex justify-between mt-1 text-xs text-gray-400">
                        <span>Starting: 185 lbs</span>
                        <span>Goal: 315 lbs</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-gray-100">Deadlift</span>
                        <span className="text-gray-100">275 lbs (+20 lbs)</span>
                      </div>
                      <Progress value={80} className="h-2" />
                      <div className="flex justify-between mt-1 text-xs text-gray-400">
                        <span>Starting: 225 lbs</span>
                        <span>Goal: 365 lbs</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4 text-gray-100">Workout Volume</h3>
                  <div className="h-[200px] bg-muted rounded-md flex items-center justify-center">
                    <p className="text-gray-400">Workout volume chart will appear here</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">Your Achievements</CardTitle>
              <CardDescription className="text-gray-200">Milestones and badges you've earned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Consistency King", desc: "Workout 5+ days per week for a month", completed: true },
                  { name: "Strength Milestone", desc: "Bench press your body weight", completed: true },
                  { name: "Early Bird", desc: "Complete 10 workouts before 7am", completed: true },
                  { name: "Progress Tracker", desc: "Log 30 consecutive workouts", completed: false },
                  { name: "Weight Goal", desc: "Reach your target weight", completed: false },
                  { name: "Squat Master", desc: "Squat 1.5x your body weight", completed: false },
                  { name: "Dedication", desc: "Complete 100 workouts", completed: false },
                  { name: "Photo Journey", desc: "Upload 12 progress photos", completed: false },
                ].map((achievement, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 flex flex-col items-center text-center border-gray-700 ${
                      achievement.completed ? "bg-gray-700" : "bg-gray-800"
                    }`}
                  >
                    <div className={`p-3 rounded-full mb-2 ${achievement.completed ? "bg-maroon-900" : "bg-gray-700"}`}>
                      <Award className={`h-6 w-6 ${achievement.completed ? "text-maroon-500" : "text-gray-400"}`} />
                    </div>
                    <h3 className="font-medium text-sm text-gray-100">{achievement.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">{achievement.desc}</p>
                    {achievement.completed && (
                      <span className="inline-flex items-center rounded-full bg-maroon-900 px-2 py-1 text-xs font-medium text-maroon-300 mt-2">
                        Completed
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

