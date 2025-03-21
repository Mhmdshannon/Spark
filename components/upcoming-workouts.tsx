import { Calendar } from "lucide-react"

export function UpcomingWorkouts() {
  const workouts = [
    { day: "Today", name: "Upper Body Strength", time: "5:00 PM", coach: "Mike" },
    { day: "Tomorrow", name: "Lower Body Power", time: "6:30 PM", coach: "Sarah" },
    { day: "Wednesday", name: "Rest Day", time: "", coach: "" },
    { day: "Thursday", name: "Core & Stability", time: "5:00 PM", coach: "Mike" },
    { day: "Friday", name: "HIIT Cardio", time: "6:00 PM", coach: "Sarah" },
    { day: "Saturday", name: "Active Recovery", time: "10:00 AM", coach: "Mike" },
    { day: "Sunday", name: "Rest Day", time: "", coach: "" },
  ]

  return (
    <div className="space-y-4">
      {workouts.map((workout, index) => (
        <div key={index} className="flex items-start space-x-4">
          <Calendar className={`h-5 w-5 ${workout.name === "Rest Day" ? "text-gray-400" : "text-maroon-500"}`} />
          <div className="space-y-1">
            <p className="font-medium text-gray-100">{workout.day}</p>
            <p className={workout.name === "Rest Day" ? "text-gray-400" : "text-gray-200"}>{workout.name}</p>
            {workout.time && (
              <p className="text-sm text-gray-400">
                {workout.time} with Coach {workout.coach}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

