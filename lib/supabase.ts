import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined')
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined')
}

// Create a custom fetch implementation with proper timeouts and caching
const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const controller = new AbortController()
  const url = input.toString()
  
  // Use appropriate timeouts for different operations
  const isAuthRequest = url.includes('/auth/')
  const isInitialSetup = url.includes('/rest/v1/profiles?select=id&limit=1')
  const timeout = isAuthRequest ? 5000 : // 5s for auth
                 isInitialSetup ? 3000 : // 3s for setup
                 800 // 800ms for regular requests
  
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  // Don't cache auth or mutation requests
  const shouldCache = !isAuthRequest && 
                     !url.includes('/storage/') && 
                     init?.method !== 'POST' && 
                     init?.method !== 'PUT' && 
                     init?.method !== 'DELETE'

  try {
    const response = await fetch(input, {
      ...init,
      signal: controller.signal,
      cache: shouldCache ? 'force-cache' : 'no-store',
      headers: {
        ...init?.headers,
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Cache-Control': shouldCache ? 'max-age=5' : 'no-cache',
        'Pragma': shouldCache ? 'cache' : 'no-cache'
      }
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

// Configure Supabase client with proper auth settings
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
)

// Helper function to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey && supabase)
}

// Helper function to safely execute Supabase operations with timeout
export async function safeSupabaseOperation<T>(
  operation: () => Promise<T>,
  fallback: T,
  timeout = 800 // Reduced default timeout to 800ms
): Promise<T> {
  if (!isSupabaseConfigured()) {
    console.error('Supabase is not properly configured')
    return fallback
  }

  try {
    const result = await Promise.race([
      operation(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Operation timeout')), timeout)
      )
    ]) as T;
    return result;
  } catch (error) {
    if (error instanceof Error && error.message === 'Operation timeout') {
      console.warn('Supabase operation timed out, using fallback')
    } else {
      console.error('Supabase operation failed:', error)
    }
    return fallback
  }
}

