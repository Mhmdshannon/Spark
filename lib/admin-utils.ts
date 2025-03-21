import { supabase, isSupabaseConfigured } from "./supabase"
import { updateProfile, getProfile } from "./profile-service"
import { initializeDatabase } from "./db-init"

/**
 * Makes a user an admin based on their email address
 */
export async function makeUserAdmin(email: string): Promise<{ success: boolean; message: string }> {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        message: "Supabase is not properly configured. Please check your environment variables.",
      }
    }

    // Initialize database if needed
    await initializeDatabase()

    // Find the user by email
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers()

    if (userError) {
      console.error("Error fetching users:", userError)
      return { success: false, message: `Error fetching users: ${userError.message}` }
    }

    // Find the user with the specified email
    const user = userData.users.find((u) => u.email === email)

    if (!user) {
      return { success: false, message: `User with email ${email} not found` }
    }

    // Check if the user already has a profile
    const profile = await getProfile(user.id)

    if (profile) {
      // Update the existing profile
      const updatedProfile = await updateProfile(user.id, { role: "admin" })

      if (!updatedProfile) {
        return { success: false, message: "Failed to update profile" }
      }

      return { success: true, message: `User ${email} is now an admin` }
    } else {
      // Create a new profile with admin role
      const newProfile = await updateProfile(user.id, {
        user_id: user.id,
        email: user.email || "",
        first_name: user.user_metadata?.first_name || "",
        last_name: user.user_metadata?.last_name || "",
        role: "admin",
      })

      if (!newProfile) {
        return { success: false, message: "Failed to create profile" }
      }

      return { success: true, message: `User ${email} is now an admin` }
    }
  } catch (error) {
    console.error("Error making user admin:", error)
    return { success: false, message: `Error: ${error instanceof Error ? error.message : String(error)}` }
  }
}

