import { supabase } from "./supabase"
import type { Subscription } from "./types"
import { initializeDatabase } from "./db-init"

// Get subscription for a user
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("end_date", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      // Check if the error is because the table doesn't exist
      if (error.message.includes("relation") && error.message.includes("does not exist")) {
        console.log("Subscriptions table doesn't exist, initializing database")
        await initializeDatabase()
        return null
      }

      // PGRST116 is the error code for "no rows returned"
      if (error.code === "PGRST116") {
        return null
      }

      console.error("Error fetching subscription:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getUserSubscription:", error)
    return null
  }
}

// Create or update a subscription
export async function createOrUpdateSubscription(subscription: Partial<Subscription>): Promise<Subscription | null> {
  try {
    // Check if subscriptions table exists
    const { count, error: countError } = await supabase
      .from("subscriptions")
      .select("*", { count: "exact", head: true })

    // If table doesn't exist or there's an error, try to initialize the database
    if (countError && countError.message.includes("relation") && countError.message.includes("does not exist")) {
      await initializeDatabase()
    }

    // Check if user already has a subscription
    const { data: existingSubscription, error: fetchError } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", subscription.user_id!)
      .order("end_date", { ascending: false })
      .limit(1)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is the error code for "no rows returned"
      console.error("Error checking existing subscription:", fetchError)
      return null
    }

    if (existingSubscription) {
      // Update existing subscription
      const { data, error } = await supabase
        .from("subscriptions")
        .update({
          ...subscription,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSubscription.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating subscription:", error)
        return null
      }

      return data
    } else {
      // Create new subscription
      const { data, error } = await supabase
        .from("subscriptions")
        .insert([
          {
            ...subscription,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("Error creating subscription:", error)
        return null
      }

      return data
    }
  } catch (error) {
    console.error("Error in createOrUpdateSubscription:", error)
    return null
  }
}

// Get all subscriptions (admin only)
export async function getAllSubscriptions(): Promise<Subscription[]> {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select(`
        *,
        profile:profiles(first_name, last_name, email)
      `)
      .order("end_date", { ascending: false })

    if (error) {
      // Check if the error is because the table doesn't exist
      if (error.message.includes("relation") && error.message.includes("does not exist")) {
        console.log("Subscriptions table doesn't exist, initializing database")
        await initializeDatabase()
        return []
      }

      console.error("Error fetching all subscriptions:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getAllSubscriptions:", error)
    return []
  }
}

// Calculate days left in subscription
export function getDaysLeft(endDate: string): number {
  if (!endDate) return 0

  const end = new Date(endDate)
  const today = new Date()

  // Reset time to compare just the dates
  end.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  const diffTime = end.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return Math.max(0, diffDays)
}

// Check if subscription is active
export function isSubscriptionActive(subscription: Subscription | null): boolean {
  if (!subscription) return false

  const today = new Date()
  const endDate = new Date(subscription.end_date)

  return endDate >= today && subscription.status === "active"
}

