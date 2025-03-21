"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Clock, Play, Save, Video, Info } from "lucide-react"
import { ExerciseDemoModal } from "@/components/exercise-demo-modal"
import { getExerciseByName } from "@/lib/exercise-data"

export default function WorkoutDetailPage() {
  const params = useParams()
  const workoutType = params.type
  const [selectedExercise, setSelectedExercise] = useState<any>(null)
  const [demoModalOpen, setDemoModalOpen] = useState(false)

  // Format the workout type for display
  const formatWorkoutName = (type: string) => {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const workoutName = formatWorkoutName(workoutType as string)

  // Mock data for exercises based on workout type
  const getExercises = () => {
    switch (workoutType) {
      case "upper-body":
        return [
          { name: "Bench Press", sets: 4, reps: "8-10", weight: "135 lbs" },
          { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", weight: "40 lbs" },
          { name: "Lat Pulldown", sets: 4, reps: "10-12", weight: "120 lbs" },
          { name: "Seated Cable Row", sets: 3, reps: "12-15", weight: "100 lbs" },
          { name: "Shoulder Press", sets: 3, reps: "8-10", weight: "35 lbs" },
          { name: "Bicep Curls", sets: 3, reps: "12-15", weight: "25 lbs" },
          { name: "Tricep Pushdown", sets: 3, reps: "12-15", weight: "45 lbs" },
        ]
      case "lower-body":
        return [
          { name: "Barbell Squat", sets: 4, reps: "8-10", weight: "185 lbs" },
          { name: "Romanian Deadlift", sets: 3, reps: "10-12", weight: "135 lbs" },
          { name: "Leg Press", sets: 3, reps: "12-15", weight: "250 lbs" },
          { name: "Walking Lunges", sets: 3, reps: "10 each leg", weight: "20 lbs" },
          { name: "Leg Extension", sets: 3, reps: "12-15", weight: "70 lbs" },
          { name: "Leg Curl", sets: 3, reps: "12-15", weight: "60 lbs" },
          { name: "Calf Raises", sets: 4, reps: "15-20", weight: "Body weight" },
        ]
      case "core":
        return [
          { name: "Plank", sets: 3, reps: "60 seconds", weight: "Body weight" },
          { name: "Russian Twists", sets: 3, reps: "20 each side", weight: "15 lbs" },
          { name: "Hanging Leg Raises", sets: 3, reps: "12-15", weight: "Body weight" },
          { name: "Ab Rollout", sets: 3, reps: "10-12", weight: "Body weight" },
          { name: "Side Plank", sets: 3, reps: "45 seconds each", weight: "Body weight" },
          { name: "Cable Woodchoppers", sets: 3, reps: "12 each side", weight: "30 lbs" },
          { name: "Bicycle Crunches", sets: 3, reps: "20 each side", weight: "Body weight" },
        ]
      default:
        return [
          { name: "Exercise 1", sets: 3, reps: "10-12", weight: "100 lbs" },
          { name: "Exercise 2", sets: 3, reps: "10-12", weight: "100 lbs" },
          { name: "Exercise 3", sets: 3, reps: "10-12", weight: "100 lbs" },
        ]
    }
  }

  const exercises = getExercises()

  const openDemoModal = (exercise: any) => {
    const exerciseData = getExerciseByName(exercise.name) || {
      name: exercise.name,
      description: "Learn the proper form and technique for this exercise.",
      steps: [],
      tips: [],
      imageUrls: [],
      videoUrl: "",
    }

    setSelectedExercise(exerciseData)
    setDemoModalOpen(true)
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">{workoutName}</h1>
          <p className="text-muted-foreground text-gray-200">Coach Mike • 60 minutes</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Rest Timer
          </Button>
          <Button className="bg-maroon-600 hover:bg-maroon-700" size="sm">
            <Play className="mr-2 h-4 w-4" />
            Start Workout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="workout" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workout">Workout</TabsTrigger>
          <TabsTrigger value="log">Log</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="workout" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700 text-gray-100">
            <CardHeader>
              <CardTitle>Workout Details</CardTitle>
              <CardDescription>Follow this plan created by your coach</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {exercises.map((exercise, index) => (
                <div key={index} className="border rounded-lg overflow-hidden border-gray-700">
                  <div className="bg-gray-700 p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-100">{exercise.name}</h3>
                      <p className="text-sm text-muted-foreground text-gray-200">
                        {exercise.sets} sets × {exercise.reps}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-200 hover:text-white"
                        onClick={() => openDemoModal(exercise)}
                      >
                        <Video className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Demo</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-200 hover:text-white"
                        onClick={() => openDemoModal(exercise)}
                      >
                        <Info className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Info</span>
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    <p className="text-sm text-gray-100">Previous: {exercise.weight}</p>
                    <div className="grid grid-cols-4 gap-2">
                      {Array.from({ length: exercise.sets }).map((_, setIndex) => (
                        <div key={setIndex} className="space-y-1">
                          <Label htmlFor={`set-${index}-${setIndex}`} className="text-gray-100">
                            Set {setIndex + 1}
                          </Label>
                          <Input
                            id={`set-${index}-${setIndex}`}
                            placeholder="Weight"
                            className="bg-gray-700 border-gray-600 text-gray-100"
                          />
                          <Input placeholder="Reps" className="bg-gray-700 border-gray-600 text-gray-100" />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="log" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700 text-gray-100">
            <CardHeader>
              <CardTitle>Workout Log</CardTitle>
              <CardDescription>Track your progress for this workout</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="workout-date" className="text-gray-100">
                      Date
                    </Label>
                    <Input id="workout-date" type="date" className="bg-gray-700 border-gray-600 text-gray-100" />
                  </div>
                  <div>
                    <Label htmlFor="workout-duration" className="text-gray-100">
                      Duration (minutes)
                    </Label>
                    <Input
                      id="workout-duration"
                      type="number"
                      placeholder="60"
                      className="bg-gray-700 border-gray-600 text-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="workout-notes" className="text-gray-100">
                    Notes
                  </Label>
                  <textarea
                    id="workout-notes"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-gray-700 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-gray-100 border-gray-600"
                    placeholder="How did the workout feel? Any PRs or challenges?"
                  />
                </div>

                <div>
                  <Label className="text-gray-100">Progress Photo (optional)</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="h-40 w-40 rounded-md border border-dashed border-gray-300 flex items-center justify-center">
                      <Button variant="ghost" className="h-full w-full rounded-md">
                        + Add Photo
                      </Button>
                    </div>
                    <div className="space-y-1 text-sm text-gray-100">
                      <p>Upload a progress photo to track your transformation</p>
                      <p className="text-muted-foreground text-gray-200">JPG, PNG or GIF, up to 5MB</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-maroon-600 hover:bg-maroon-700">
                    <Save className="mr-2 h-4 w-4" />
                    Save Workout Log
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700 text-gray-100">
            <CardHeader>
              <CardTitle>Workout History</CardTitle>
              <CardDescription>Your previous {workoutName} workouts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="border rounded-lg p-4 border-gray-700">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-100">
                          {new Date(2023, 5 - index, 15 - index * 7).toLocaleDateString()}
                        </h3>
                        <p className="text-sm text-muted-foreground text-gray-200">Duration: 65 minutes</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                    <div className="text-sm text-gray-100">
                      <p>Bench Press: 135 lbs × 10, 10, 8, 8</p>
                      <p>Incline Dumbbell Press: 40 lbs × 12, 10, 10</p>
                      <p>Lat Pulldown: 120 lbs × 12, 12, 10, 10</p>
                      <p className="text-muted-foreground mt-2 text-gray-200">
                        Note: Felt strong today, increased weight on bench press for last two sets.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedExercise && (
        <ExerciseDemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} exercise={selectedExercise} />
      )}
    </div>
  )
}

