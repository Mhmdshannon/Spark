import { supabase } from "./supabase"

// Helper function to safely execute Supabase operations
async function safeSupabaseOperation<T>(
  operation: () => Promise<{ data: T | null; error: any }>,
  errorMessage: string,
): Promise<{ success: boolean; data: T | null; error: any }> {
  try {
    const { data, error } = await operation()
    if (error) {
      console.error(`${errorMessage}:`, error)
      return { success: false, data: null, error }
    }
    return { success: true, data, error: null }
  } catch (error) {
    console.error(`Exception in ${errorMessage}:`, error)
    return { success: false, data: null, error }
  }
}

// Helper function to check if a table exists
async function tableExists(tableName: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', tableName)
      .single()
    
    return !error && data !== null
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error)
    return false
  }
}

// Helper function to execute SQL directly
async function executeSql(sql: string): Promise<{ success: boolean; error?: any }> {
  try {
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql })
    if (error) {
      console.error('Error executing SQL:', error)
      return { success: false, error }
    }
    return { success: true }
  } catch (error) {
    console.error('Exception executing SQL:', error)
    return { success: false, error }
  }
}

export interface DatabaseInitResult {
  success: boolean;
  message: string;
}

export async function initializeDatabase(): Promise<DatabaseInitResult> {
  console.log("Initializing database...")

  try {
    // Check if profiles table exists
    const profilesExist = await tableExists("profiles")
    if (!profilesExist) {
      console.log("Creating profiles table...")
      
      // Create the profiles table
      const createProfilesTable = `
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
          first_name TEXT,
          last_name TEXT,
          email TEXT,
          age INTEGER,
          height TEXT,
          weight NUMERIC,
          target_weight NUMERIC,
          primary_goal TEXT,
          weekly_workouts INTEGER,
          coach TEXT,
          role TEXT DEFAULT 'member',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          CONSTRAINT unique_user_id UNIQUE (user_id)
        );
      `
      const createResult = await executeSql(createProfilesTable)
      if (!createResult.success) {
        return { 
          success: false, 
          message: `Failed to create profiles table: ${createResult.error?.message || 'Unknown error'}` 
        }
      }

      // Create indexes
      const createIndexes = `
        CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
        CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
        CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
      `
      const indexResult = await executeSql(createIndexes)
      if (!indexResult.success) {
        return { 
          success: false, 
          message: `Failed to create indexes: ${indexResult.error?.message || 'Unknown error'}` 
        }
      }

      // Enable RLS and create policies
      const createPolicies = `
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Users can view own profile"
          ON profiles FOR SELECT
          USING (auth.uid() = user_id);

        CREATE POLICY "Users can update own profile"
          ON profiles FOR UPDATE
          USING (auth.uid() = user_id)
          WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can insert own profile"
          ON profiles FOR INSERT
          WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can delete own profile"
          ON profiles FOR DELETE
          USING (auth.uid() = user_id);

        CREATE POLICY "Admins have full access"
          ON profiles
          USING (auth.uid() IN (
            SELECT p.user_id 
            FROM profiles p 
            WHERE p.role = 'admin'
          ));
      `
      const policiesResult = await executeSql(createPolicies)
      if (!policiesResult.success) {
        return { 
          success: false, 
          message: `Failed to create RLS policies: ${policiesResult.error?.message || 'Unknown error'}` 
        }
      }
    }

    return { success: true, message: "Database initialized successfully" }
  } catch (error) {
    console.error("Error initializing database:", error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error initializing database" 
    }
  }
}

