import { supabase } from "./supabase"
import type { Profile } from "./types"
import type { DatabaseInitResult } from "./db-init"
import type { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js"

// Helper function to check if a table exists
async function tableExists(tableName: string): Promise<boolean> {
  const now = Date.now()
  const cached = tableCheckCache.get(tableName)
  if (cached && (now - cached.timestamp < TABLE_CHECK_TTL)) {
    return cached.exists
  }

  try {
    const query = supabase.from(tableName).select('id').limit(1)
    const { error } = await withTimeout(
      () => Promise.resolve(query),
      1000 // Increased timeout for table checks
    )
    const exists = !error
    tableCheckCache.set(tableName, { exists, timestamp: now })
    return exists
  } catch (error) {
    return false
  }
}

// Helper function to ensure database is initialized
async function ensureDatabaseInitialized(): Promise<DatabaseInitResult> {
  try {
    const { initializeDatabase } = await import("./db-init")
    const result = await initializeDatabase()
    return result
  } catch (error) {
    console.error("Failed to initialize database:", error)
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Helper function for consistent date formatting
function getISOString() {
  const date = new Date();
  // Remove milliseconds to ensure consistency
  return date.toISOString().split('.')[0] + 'Z';
}

// Enhanced cache implementation with token-based invalidation
const profileCache = new Map<string, { profile: Profile | null; timestamp: number; token: string }>()
const CACHE_TTL = 10000 // Reduced to 10 seconds
const tableCheckCache = new Map<string, { exists: boolean; timestamp: number }>()
const TABLE_CHECK_TTL = 30000 // Reduced to 30 seconds

// Helper function for timeouts
async function withTimeout<T>(
  operation: () => Promise<PostgrestSingleResponse<T>>, 
  ms: number = 800 // Default timeout increased to 800ms for better reliability
): Promise<PostgrestSingleResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  
  try {
    const result = await Promise.race([
      Promise.resolve(operation()),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Operation timed out')), ms)
      )
    ]);
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    // Check cache first
    const cached = profileCache.get(userId)
    const now = Date.now()
    if (cached && (now - cached.timestamp < CACHE_TTL)) {
      return cached.profile
    }

    // Fast path: Try to get profile directly first
    const query = supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single()

    const { data, error } = await withTimeout<Profile>(
      () => Promise.resolve(query),
      800 // Increased timeout for profile fetch
    )

    if (!error) {
      // Cache successful result
      profileCache.set(userId, { profile: data, timestamp: now, token: userId })
      return data
    }

    // Only check table existence if we got an error
    if (error.message?.includes("relation") || error.code === "PGRST116") {
      const profilesExist = await tableExists("profiles")
      if (!profilesExist) {
        const initialized = await ensureDatabaseInitialized()
        if (!initialized.success) {
          return null
        }
        // Try creating default profile immediately after initialization
        return createDefaultProfile(userId)
      }
    }

    // Handle not found case
    if (error.code === "PGRST116") {
      return createDefaultProfile(userId)
    }

    console.error("Error fetching profile:", error)
    return null
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error("Profile fetch timed out")
      return null
    }
    console.error("Error in getProfile:", error)
    return null
  }
}

async function createDefaultProfile(userId: string): Promise<Profile | null> {
  try {
    // Check if profiles table exists
    const profilesExist = await tableExists("profiles")

    if (!profilesExist) {
      console.log("Profiles table doesn't exist when creating default profile, initializing database...")
      const initialized = await ensureDatabaseInitialized()
      if (!initialized.success) {
        console.error("Failed to initialize database:", initialized.message)
        return null
      }
    }

    // Get user data from auth
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData || !userData.user) {
      console.error("Error fetching user data:", userError)
      // Create a minimal profile even without user data
      const minimalProfile: Partial<Profile> = {
        user_id: userId,
        first_name: "New",
        last_name: "User",
        email: "unknown@example.com",
        role: "member",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Try to insert the profile
      try {
        const { data, error } = await supabase.from("profiles").insert([minimalProfile]).select().single()

        if (error) {
          console.error("Error creating minimal profile:", error)
          return minimalProfile as Profile // Return the minimal profile even if we couldn't save it
        }

        return data
      } catch (insertError) {
        console.error("Exception creating minimal profile:", insertError)
        return minimalProfile as Profile
      }
    }

    const user = userData.user

    // Create a default profile
    const defaultProfile: Partial<Profile> = {
      user_id: userId,
      first_name: user.user_metadata?.first_name || "",
      last_name: user.user_metadata?.last_name || "",
      email: user.email || "",
      role: "member",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Try to insert the profile
    try {
      const { data, error } = await supabase.from("profiles").insert([defaultProfile]).select().single()

      if (error) {
        console.error("Error creating default profile:", error)
        return defaultProfile as Profile // Return the default profile even if we couldn't save it
      }

      return data
    } catch (insertError) {
      console.error("Exception creating default profile:", insertError)
      return defaultProfile as Profile
    }
  } catch (error) {
    console.error("Error in createDefaultProfile:", error)
    // Return a minimal profile as fallback
    return {
      id: "",
      user_id: userId,
      first_name: "New",
      last_name: "User",
      email: "unknown@example.com",
      role: "member",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Profile
  }
}

export async function updateProfile(userId: string, profileData: Partial<Profile>): Promise<Profile | null> {
  try {
    // Invalidate cache immediately
    profileCache.delete(userId)

    // Fast path: Try update directly first
    const query = supabase
      .from("profiles")
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single()

    const { data, error } = await withTimeout<Profile>(
      () => Promise.resolve(query),
      500
    )

    if (!error) {
      profileCache.set(userId, { profile: data, timestamp: Date.now(), token: userId })
      return data
    }

    // Handle table not existing
    if (error.message?.includes("relation")) {
      const initialized = await ensureDatabaseInitialized()
      if (!initialized.success) {
        return null
      }
      // Create new profile with provided data
      return createProfile({
        user_id: userId,
        ...profileData,
      })
    }

    // Handle profile not found
    if (error.code === "PGRST116") {
      return createProfile({
        user_id: userId,
        ...profileData,
      })
    }

    console.error("Error updating profile:", error)
    return null
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error("Profile update timed out")
      return null
    }
    console.error("Error in updateProfile:", error)
    return null
  }
}

export async function createProfile(profileData: Partial<Profile>): Promise<Profile | null> {
  try {
    // Ensure required fields are present
    const profile = {
      user_id: profileData.user_id || "",
      first_name: profileData.first_name || "New",
      last_name: profileData.last_name || "User",
      email: profileData.email || "unknown@example.com",
      role: profileData.role || "member",
      created_at: getISOString(),
      updated_at: getISOString(),
    };

    console.log("Attempting to create profile with data:", profile);

    // Try to insert the profile
    const { data, error } = await supabase
      .from("profiles")
      .insert([profile])
      .select()
      .single();

    if (error) {
      console.error("Full error object:", JSON.stringify(error, null, 2));
      
      // If the error is about the table not existing, try to create it
      if (error.message?.includes("does not exist")) {
        console.log("Table does not exist, attempting to initialize database...");
        // Try to initialize the database
        const response = await fetch("/api/init-db");
        const initResult = await response.json();
        console.log("Database initialization result:", initResult);
        
        if (!response.ok) {
          console.error("Failed to initialize database:", initResult);
          return profile as Profile;
        }
        
        // Try inserting again after initialization
        console.log("Retrying profile creation after database initialization...");
        const { data: retryData, error: retryError } = await supabase
          .from("profiles")
          .insert([profile])
          .select()
          .single();

        if (retryError) {
          console.error("Error creating profile after initialization:", JSON.stringify(retryError, null, 2));
          return profile as Profile;
        }

        return retryData;
      }

      // Check for permission errors
      if (error.code === 'PGRST301' || error.message?.includes('permission')) {
        console.error("Permission error creating profile. Check RLS policies.");
      }

      return profile as Profile;
    }

    console.log("Profile created successfully:", data);
    return data;
  } catch (error) {
    console.error("Exception in createProfile:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    // Return a minimal profile as fallback
    return {
      id: "",
      user_id: profileData.user_id || "",
      first_name: profileData.first_name || "New",
      last_name: profileData.last_name || "User",
      email: profileData.email || "unknown@example.com",
      role: profileData.role || "member",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Profile;
  }
}

// Test function to verify database setup
export async function testDatabaseSetup(): Promise<{ success: boolean; message: string }> {
  try {
    // Test if we can access the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Error accessing profiles table:', error)
      return { 
        success: false, 
        message: `Database setup error: ${error.message}` 
      }
    }

    return { 
      success: true, 
      message: 'Database setup verified successfully' 
    }
  } catch (error) {
    console.error('Error testing database setup:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error testing database setup' 
    }
  }
}

