"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react"

export function WorkoutTimer() {
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [timerType, setTimerType] = useState<"workout" | "rest">("workout")

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1)
      }, 1000)
    } else if (!isActive && seconds !== 0 && interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, seconds])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setSeconds(0)
    setIsActive(false)
  }

  const startRestTimer = () => {
    setTimerType("rest")
    setSeconds(0)
    setIsActive(true)
  }

  const startWorkoutTimer = () => {
    setTimerType("workout")
    setSeconds(0)
    setIsActive(true)
  }

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <Card className={`bg-gray-800 border-gray-700 text-gray-100 ${timerType === "rest" ? "bg-gray-700" : ""}`}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-sm font-medium text-gray-200">
            {timerType === "workout" ? "Workout Timer" : "Rest Timer"}
          </div>
          <div className="text-5xl font-bold">{formatTime(seconds)}</div>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={resetTimer}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant={isActive ? "outline" : "default"}
              className={isActive ? "" : "bg-maroon-600 hover:bg-maroon-700"}
              onClick={toggleTimer}
            >
              {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isActive ? "Pause" : "Start"}
            </Button>
            {timerType === "workout" ? (
              <Button variant="outline" onClick={startRestTimer}>
                <SkipForward className="mr-2 h-4 w-4" />
                Rest
              </Button>
            ) : (
              <Button variant="outline" onClick={startWorkoutTimer}>
                <SkipForward className="mr-2 h-4 w-4" />
                Workout
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

