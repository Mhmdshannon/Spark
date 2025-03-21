import { supabase } from "./supabase"
import type { Exercise } from "./types"

// Get all exercises
export async function getExercises(): Promise<Exercise[]> {
  const { data, error } = await supabase.from("exercises").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching exercises:", error)
    return []
  }

  return data || []
}

// Get exercises by category
export async function getExercisesByCategory(category: string): Promise<Exercise[]> {
  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .eq("category", category)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching exercises by category:", error)
    return []
  }

  return data || []
}

// Get a specific exercise
export async function getExercise(exerciseId: string): Promise<Exercise | null> {
  const { data, error } = await supabase.from("exercises").select("*").eq("id", exerciseId).single()

  if (error) {
    console.error("Error fetching exercise:", error)
    return null
  }

  return data
}

// Search exercises
export async function searchExercises(query: string): Promise<Exercise[]> {
  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error searching exercises:", error)
    return []
  }

  return data || []
}

