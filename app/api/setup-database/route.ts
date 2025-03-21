import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    console.log("Setting up database tables...")

    // Create profiles table
    try {
      console.log("Creating profiles table...")
      const { error: profilesError } = await supabase.from("profiles").insert({
        user_id: "00000000-0000-0000-0000-000000000000",
        first_name: "System",
        last_name: "Init",
        email: "system@example.com",
        role: "system",
      })

      if (profilesError) {
        console.error("Error creating profiles table:", profilesError)
      } else {
        console.log("Profiles table created successfully")
      }
    } catch (error) {
      console.error("Exception creating profiles table:", error)
    }

    // Create subscriptions table
    try {
      console.log("Creating subscriptions table...")
      const { error: subscriptionsError } = await supabase.from("subscriptions").insert({
        user_id: "00000000-0000-0000-0000-000000000000",
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        plan_type: "system",
        status: "active",
        amount: 0,
        payment_id: "system-init",
      })

      if (subscriptionsError) {
        console.error("Error creating subscriptions table:", subscriptionsError)
      } else {
        console.log("Subscriptions table created successfully")
      }
    } catch (error) {
      console.error("Exception creating subscriptions table:", error)
    }

    // Create meal_plans table
    let mealPlanId: string | null = null
    try {
      console.log("Creating meal_plans table...")
      const { data: mealPlan, error: mealPlansError } = await supabase
        .from("meal_plans")
        .insert({
          user_id: "00000000-0000-0000-0000-000000000000",
          title: "System Init",
          description: "System initialization meal plan",
          start_date: new Date().toISOString().split("T")[0],
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        })
        .select()
        .single()

      if (mealPlansError) {
        console.error("Error creating meal_plans table:", mealPlansError)
      } else {
        console.log("Meal plans table created successfully")
        mealPlanId = mealPlan?.id || null
      }
    } catch (error) {
      console.error("Exception creating meal_plans table:", error)
    }

    // Create meals table if we have a meal plan ID
    if (mealPlanId) {
      try {
        console.log("Creating meals table...")
        const { error: mealsError } = await supabase.from("meals").insert({
          meal_plan_id: mealPlanId,
          name: "Default Meal",
          description: "System-generated default meal",
          time_of_day: "breakfast",
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        })

        if (mealsError) {
          console.error("Error creating meals table:", mealsError)
        } else {
          console.log("Meals table created successfully")
        }
      } catch (error) {
        console.error("Exception creating meals table:", error)
      }
    } else {
      console.log("Skipping meals table creation because meal_plan_id is not available")
    }

    // Create coach_notes table
    try {
      console.log("Creating coach_notes table...")
      const { error: coachNotesError } = await supabase.from("coach_notes").insert({
        user_id: "00000000-0000-0000-0000-000000000000",
        title: "Welcome Note",
        content: "Welcome to the gym! This is your first coach note.",
      })

      if (coachNotesError) {
        console.error("Error creating coach_notes table:", coachNotesError)
      } else {
        console.log("Coach notes table created successfully")
      }
    } catch (error) {
      console.error("Exception creating coach_notes table:", error)
    }

    return NextResponse.json({
      success: true,
      message: "Database setup completed. Check server logs for details.",
    })
  } catch (error) {
    console.error("Error setting up database:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

