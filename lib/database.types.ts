export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          first_name: string | null
          last_name: string | null
          email: string | null
          role: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          role?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          role?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      // Add other tables as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
</QuickEdit>

Let's update the auth context to handle potential Supabase errors better:

```typescriptreact file="context/auth-context.tsx"
[v0-no-op-code-block-prefix]"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { supabase, safeSupabaseOperation } from "@/lib/supabase"
import { updateProfile } from "@/lib/profile-service"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await safeSupabaseOperation(() => supabase.auth.getSession(), { data: { session: null } })

        setSession(session)
        setUser(session?.user ?? null)

        // If user exists, ensure profile exists
        if (session?.user) {
          try {
            // Try to create/update profile with basic info
            await updateProfile(session.user.id, {
              user_id: session.user.id,
              email: session.user.email,
              first_name: session.user.user_metadata?.first_name || "",
              last_name: session.user.user_metadata?.last_name || "",
              role: "member",
            })
          } catch (error) {
            console.error("Error ensuring profile exists:", error)
          }
        }
      } catch (error) {
        console.error("Error getting initial session:", error)
        setSession(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        setSession(session)
        setUser(session?.user ?? null)

        // If user exists, ensure profile exists
        if (session?.user) {
          try {
            // Try to create/update profile with basic info
            await updateProfile(session.user.id, {
              user_id: session.user.id,
              email: session.user.email,
              first_name: session.user.user_metadata?.first_name || "",
              last_name: session.user.user_metadata?.last_name || "",
              role: "member",
            })
          } catch (error) {
            console.error("Error ensuring profile exists:", error)
          }
        }
      } catch (error) {
        console.error("Error handling auth state change:", error)
      } finally {
        setIsLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await safeSupabaseOperation(() => supabase.auth.signOut(), { error: null })
  }

  const value = {
    user,
    session,
    isLoading,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

