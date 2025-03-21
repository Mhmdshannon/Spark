import { supabase } from "./supabase"
import type { MealPlan, Meal } from "./types"

// Get meal plans for a user
export async function getUserMealPlans(userId: string): Promise<MealPlan[]> {
  const { data, error } = await supabase
    .from("meal_plans")
    .select("*")
    .eq("user_id", userId)
    .order("start_date", { ascending: false })

  if (error) {
    console.error("Error fetching meal plans:", error)
    return []
  }

  return data || []
}

// Get a specific meal plan with its meals
export async function getMealPlanWithMeals(mealPlanId: string): Promise<{ mealPlan: MealPlan | null; meals: Meal[] }> {
  // Get the meal plan
  const { data: mealPlan, error: mealPlanError } = await supabase
    .from("meal_plans")
    .select("*")
    .eq("id", mealPlanId)
    .single()

  if (mealPlanError) {
    console.error("Error fetching meal plan:", mealPlanError)
    return { mealPlan: null, meals: [] }
  }

  // Get the meals for this meal plan
  const { data: meals, error: mealsError } = await supabase
    .from("meals")
    .select("*")
    .eq("meal_plan_id", mealPlanId)
    .order("time_of_day", { ascending: true })

  if (mealsError) {
    console.error("Error fetching meals:", mealsError)
    return { mealPlan, meals: [] }
  }

  return { mealPlan, meals: meals || [] }
}

// Create a meal plan (admin only)
export async function createMealPlan(mealPlan: Partial<MealPlan>): Promise<MealPlan | null> {
  const { data, error } = await supabase
    .from("meal_plans")
    .insert([
      {
        ...mealPlan,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error creating meal plan:", error)
    return null
  }

  return data
}

// Add a meal to a meal plan (admin only)
export async function addMealToMealPlan(meal: Partial<Meal>): Promise<Meal | null> {
  const { data, error } = await supabase
    .from("meals")
    .insert([
      {
        ...meal,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error adding meal:", error)
    return null
  }

  return data
}

// Get all meal plans (admin only)
export async function getAllMealPlans(): Promise<MealPlan[]> {
  const { data, error } = await supabase
    .from("meal_plans")
    .select(`
      *,
      profile:profiles(first_name, last_name, email)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching all meal plans:", error)
    return []
  }

  return data || []
}

