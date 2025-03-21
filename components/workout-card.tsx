"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Play, Video } from "lucide-react"
import Link from "next/link"
import { ExerciseDemoModal } from "@/components/exercise-demo-modal"
import { getExerciseByName } from "@/lib/exercise-data"

export function WorkoutCard() {
  const [selectedExercise, setSelectedExercise] = useState<any>(null)
  const [demoModalOpen, setDemoModalOpen] = useState(false)

  const exercises = [
    { name: "Bench Press", sets: 4, reps: "8-10", weight: "135 lbs" },
    { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", weight: "40 lbs" },
    { name: "Lat Pulldown", sets: 4, reps: "10-12", weight: "120 lbs" },
    { name: "Seated Cable Row", sets: 3, reps: "12-15", weight: "100 lbs" },
    { name: "Shoulder Press", sets: 3, reps: "8-10", weight: "35 lbs" },
    { name: "Bicep Curls", sets: 3, reps: "12-15", weight: "25 lbs" },
    { name: "Tricep Pushdown", sets: 3, reps: "12-15", weight: "45 lbs" },
  ]

  const openDemoModal = (exercise: any) => {
    try {
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
    } catch (error) {
      console.error("Error opening demo modal:", error)
      // Provide a fallback exercise object if there's an error
      setSelectedExercise({
        name: exercise.name,
        description: "Learn the proper form and technique for this exercise.",
        steps: [],
        tips: [],
        imageUrls: [],
        videoUrl: "",
      })
      setDemoModalOpen(true)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-maroon-500" />
          <span className="text-gray-100">Estimated time: 60 minutes</span>
        </div>
        <Link href="/workout-timer" passHref>
          <Button size="sm" className="bg-maroon-600 hover:bg-maroon-700">
            <Play className="mr-2 h-4 w-4" />
            Start Workout
          </Button>
        </Link>
      </div>

      <div className="space-y-2">
        {exercises.map((exercise, index) => (
          <Card key={index} className="overflow-hidden bg-gray-800 border-gray-700">
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4">
                <div className="font-medium text-gray-100">{exercise.name}</div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-200 hover:text-white"
                    onClick={() => openDemoModal(exercise)}
                  >
                    <Video className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Demo</span>
                  </Button>
                  <div className="text-sm text-gray-200">
                    {exercise.sets} sets × {exercise.reps}
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
                <div className="text-sm text-gray-100">Previous: {exercise.weight}</div>
                <Link href={`/workout-log/${index}`} passHref>
                  <Button variant="ghost" size="sm" className="text-gray-100">
                    Log Exercise
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedExercise && (
        <ExerciseDemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} exercise={selectedExercise} />
      )}
    </div>
  )
}

