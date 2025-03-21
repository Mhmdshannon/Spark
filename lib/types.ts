export type User = {
  id: string
  email: string
  first_name: string
  last_name: string
  created_at: string
}

export type Profile = {
  id: string
  user_id: string
  first_name: string
  last_name: string
  email: string
  age?: number
  height?: string
  weight?: number
  target_weight?: number
  primary_goal?: string
  weekly_workouts?: number
  coach?: string
  role?: "member" | "admin" | "coach"
  created_at: string
  updated_at: string
}

export type Workout = {
  id: string
  name: string
  type: string
  description: string
  duration: number
  coach: string
  created_at: string
}

export type Exercise = {
  id: string
  name: string
  category: string
  description: string
  video_url?: string
  image_urls?: string[]
  steps?: string[]
  tips?: string[]
  muscles: string[]
  equipment: string[]
}

export type WorkoutExercise = {
  id: string
  workout_id: string
  exercise_id: string
  sets: number
  reps: string
  weight: string
  order: number
}

export type WorkoutLog = {
  id: string
  user_id: string
  workout_id: string
  date: string
  duration: number
  notes?: string
  created_at: string
}

export type ExerciseLog = {
  id: string
  workout_log_id: string
  exercise_id: string
  sets: {
    weight: number
    reps: number
  }[]
  notes?: string
}

export type ProgressPhoto = {
  id: string
  user_id: string
  photo_url: string
  weight?: number
  date: string
  created_at: string
}

export type Subscription = {
  id: string
  user_id: string
  start_date: string
  end_date: string
  plan_type: "monthly" | "quarterly" | "yearly"
  status: "active" | "expired" | "cancelled"
  amount: number
  payment_id?: string
  created_at: string
  updated_at: string
  profile?: Profile
}

export type MealPlan = {
  id: string
  user_id: string
  title: string
  description?: string
  start_date: string
  end_date: string
  created_by: string
  created_at: string
  updated_at: string
  profile?: Profile
}

export type Meal = {
  id: string
  meal_plan_id: string
  name: string
  description?: string
  time_of_day: "breakfast" | "lunch" | "dinner" | "snack"
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  recipe?: string
  image_url?: string
  created_at: string
}

export type CoachNote = {
  id: string
  user_id: string
  coach_id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  coach?: {
    first_name: string
    last_name: string
  }
  user?: Profile
}

