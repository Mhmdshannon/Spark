"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { WorkoutTimer } from "@/components/workout-timer"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"

export default function WorkoutTimerPage() {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [completedExercises, setCompletedExercises] = useState<number[]>([])
  const [exercises, setExercises] = useState([
    { name: "Bench Press", sets: 4, reps: "8-10", weight: "135 lbs" },
    { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", weight: "40 lbs" },
    { name: "Lat Pulldown", sets: 4, reps: "10-12", weight: "120 lbs" },
    { name: "Seated Cable Row", sets: 3, reps: "12-15", weight: "100 lbs" },
    { name: "Shoulder Press", sets: 3, reps: "8-10", weight: "35 lbs" },
    { name: "Bicep Curls", sets: 3, reps: "12-15", weight: "25 lbs" },
    { name: "Tricep Pushdown", sets: 3, reps: "12-15", weight: "45 lbs" },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const toggleExerciseCompletion = (index: number) => {
    setCompletedExercises((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index)
      } else {
        return [...prev, index]
      }
    })
  }

  const completeWorkout = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to complete a workout",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Create a workout log entry
      const { data: workoutLog, error: workoutLogError } = await supabase
        .from("workout_logs")
        .insert([
          {
            user_id: user.id,
            workout_id: null, // This is a custom workout
            date: new Date().toISOString().split("T")[0],
            duration: 60, // Default duration in minutes
            notes: "Completed via workout timer",
          },
        ])
        .select()
        .single()

      if (workoutLogError) {
        throw workoutLogError
      }

      // Log completed exercises
      const exerciseLogs = completedExercises.map((index) => ({
        workout_log_id: workoutLog.id,
        exercise_name: exercises[index].name,
        sets: JSON.stringify(
          Array(exercises[index].sets).fill({ weight: exercises[index].weight, reps: exercises[index].reps }),
        ),
        notes: "Completed",
      }))

      if (exerciseLogs.length > 0) {
        const { error: exerciseLogError } = await supabase.from("exercise_logs").insert(exerciseLogs)

        if (exerciseLogError) {
          console.error("Error logging exercises:", exerciseLogError)
          // Continue even if exercise logging fails
        }
      }

      toast({
        title: "Success",
        description: "Workout completed successfully!",
      })

      // Reset the completed exercises
      setCompletedExercises([])
    } catch (error) {
      console.error("Error completing workout:", error)
      toast({
        title: "Error",
        description: "Failed to save workout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card className="bg-gray-800 border border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">Upper Body Workout</CardTitle>
              <CardDescription className="text-gray-200">Coach Mike • 60 minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <WorkoutTimer />
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">Current Exercise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-gray-700 rounded-lg bg-gray-700">
                  <h3 className="text-xl font-bold text-gray-100">{exercises[currentExercise].name}</h3>
                  <p className="text-muted-foreground text-gray-200">
                    {exercises[currentExercise].sets} sets × {exercises[currentExercise].reps}
                  </p>
                  <p className="text-sm mt-2 text-gray-200">Previous weight: {exercises[currentExercise].weight}</p>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="flex-1 text-gray-100"
                    onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                    disabled={currentExercise === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    className="flex-1 bg-maroon-600 hover:bg-maroon-700 text-gray-100"
                    onClick={() => setCurrentExercise(Math.min(exercises.length - 1, currentExercise + 1))}
                    disabled={currentExercise === exercises.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800 border border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">Workout Progress</CardTitle>
            <CardDescription className="text-gray-200">Track your exercises</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exercises.map((exercise, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg flex items-center justify-between border-gray-700 ${
                    completedExercises.includes(index) ? "bg-gray-700" : ""
                  } ${currentExercise === index ? "border-maroon-500" : ""}`}
                >
                  <div>
                    <h3 className="font-medium text-gray-100">{exercise.name}</h3>
                    <p className="text-sm text-muted-foreground text-gray-200">
                      {exercise.sets} sets × {exercise.reps}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${completedExercises.includes(index) ? "text-maroon-400" : ""} text-gray-100`}
                    onClick={() => toggleExerciseCompletion(index)}
                  >
                    <CheckCircle2
                      className={`h-5 w-5 ${completedExercises.includes(index) ? "text-maroon-500" : ""}`}
                    />
                  </Button>
                </div>
              ))}

              <div className="pt-4 border-t border-gray-600">
                <div className="flex justify-between items-center mb-2 text-gray-100">
                  <span>Workout Progress</span>
                  <span>
                    {completedExercises.length}/{exercises.length} exercises
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-maroon-600 h-2.5 rounded-full"
                    style={{ width: `${(completedExercises.length / exercises.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <Button
                className="w-full mt-4 bg-maroon-600 hover:bg-maroon-700 text-gray-100"
                disabled={completedExercises.length !== exercises.length || isLoading}
                onClick={completeWorkout}
              >
                {isLoading ? "Saving..." : "Complete Workout"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

