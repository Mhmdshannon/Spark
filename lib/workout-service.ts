import { supabase } from "./supabase"
import type { Workout, WorkoutExercise, WorkoutLog, ExerciseLog } from "./types"

// Get all workouts
export async function getWorkouts(): Promise<Workout[]> {
  const { data, error } = await supabase.from("workouts").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching workouts:", error)
    return []
  }

  return data || []
}

// Get a specific workout with its exercises
export async function getWorkoutWithExercises(
  workoutId: string,
): Promise<{ workout: Workout | null; exercises: WorkoutExercise[] }> {
  // Get the workout
  const { data: workout, error: workoutError } = await supabase
    .from("workouts")
    .select("*")
    .eq("id", workoutId)
    .single()

  if (workoutError) {
    console.error("Error fetching workout:", workoutError)
    return { workout: null, exercises: [] }
  }

  // Get the exercises for this workout
  const { data: exercises, error: exercisesError } = await supabase
    .from("workout_exercises")
    .select(`
      *,
      exercise:exercises(*)
    `)
    .eq("workout_id", workoutId)
    .order("order_num", { ascending: true })

  if (exercisesError) {
    console.error("Error fetching workout exercises:", exercisesError)
    return { workout, exercises: [] }
  }

  return { workout, exercises: exercises || [] }
}

// Log a completed workout
export async function logWorkout(
  workoutLog: Partial<WorkoutLog>,
  exerciseLogs: Partial<ExerciseLog>[],
): Promise<{ success: boolean; workoutLogId?: string }> {
  // Insert the workout log
  const { data: workoutLogData, error: workoutLogError } = await supabase
    .from("workout_logs")
    .insert([workoutLog])
    .select()
    .single()

  if (workoutLogError) {
    console.error("Error logging workout:", workoutLogError)
    return { success: false }
  }

  // If there are exercise logs, insert them
  if (exerciseLogs.length > 0) {
    const exerciseLogsWithWorkoutId = exerciseLogs.map((log) => ({
      ...log,
      workout_log_id: workoutLogData.id,
    }))

    const { error: exerciseLogError } = await supabase.from("exercise_logs").insert(exerciseLogsWithWorkoutId)

    if (exerciseLogError) {
      console.error("Error logging exercises:", exerciseLogError)
      // Even if exercise logs fail, the workout log was created
      return { success: true, workoutLogId: workoutLogData.id }
    }
  }

  return { success: true, workoutLogId: workoutLogData.id }
}

// Get workout logs for a user
export async function getWorkoutLogs(userId: string): Promise<WorkoutLog[]> {
  const { data, error } = await supabase
    .from("workout_logs")
    .select(`
      *,
      workout:workouts(*)
    `)
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching workout logs:", error)
    return []
  }

  return data || []
}

// Get a specific workout log with its exercise logs
export async function getWorkoutLogWithExercises(
  workoutLogId: string,
): Promise<{ workoutLog: WorkoutLog | null; exerciseLogs: ExerciseLog[] }> {
  // Get the workout log
  const { data: workoutLog, error: workoutLogError } = await supabase
    .from("workout_logs")
    .select(`
      *,
      workout:workouts(*)
    `)
    .eq("id", workoutLogId)
    .single()

  if (workoutLogError) {
    console.error("Error fetching workout log:", workoutLogError)
    return { workoutLog: null, exerciseLogs: [] }
  }

  // Get the exercise logs for this workout log
  const { data: exerciseLogs, error: exerciseLogsError } = await supabase
    .from("exercise_logs")
    .select(`
      *,
      exercise:exercises(*)
    `)
    .eq("workout_log_id", workoutLogId)

  if (exerciseLogsError) {
    console.error("Error fetching exercise logs:", exerciseLogsError)
    return { workoutLog, exerciseLogs: [] }
  }

  return { workoutLog, exerciseLogs: exerciseLogs || [] }
}

