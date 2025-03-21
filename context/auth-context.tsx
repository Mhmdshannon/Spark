"use client"

<<<<<<< HEAD
import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'
=======
import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import type { Session, User, AuthError } from "@supabase/supabase-js"
import { supabase, safeSupabaseOperation } from "@/lib/supabase"
import { updateProfile } from "@/lib/profile-service"
import { toast } from "@/hooks/use-toast"
>>>>>>> 6015cc09c10c2cd329d84a9fa2937cc768733d37

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
<<<<<<< HEAD
=======
  error: AuthError | null
>>>>>>> 6015cc09c10c2cd329d84a9fa2937cc768733d37
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
<<<<<<< HEAD
  signOut: async () => {}
})

export const AuthProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
=======
  error: null,
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)
  const profileUpdateInProgress = useRef<boolean>(false)
  const lastProfileUpdate = useRef<number>(0)
  const PROFILE_UPDATE_COOLDOWN = 10000 // 10 seconds
  const sessionCheckTimeout = useRef<NodeJS.Timeout | undefined>(undefined)

  // Memoize profile update function to prevent unnecessary recreations
  const ensureProfileExists = useCallback(async (sessionUser: User) => {
    if (profileUpdateInProgress.current) return
    
    const now = Date.now()
    if (now - lastProfileUpdate.current < PROFILE_UPDATE_COOLDOWN) return
    
    profileUpdateInProgress.current = true
    lastProfileUpdate.current = now

    try {
      await updateProfile(sessionUser.id, {
        user_id: sessionUser.id,
        email: sessionUser.email,
        first_name: sessionUser.user_metadata?.first_name || "",
        last_name: sessionUser.user_metadata?.last_name || "",
        role: "member",
      })
    } catch (error) {
      console.error("Error ensuring profile exists:", error)
      if (error instanceof Error) {
        toast({
          title: "Profile Update Error",
          description: error.message,
          variant: "destructive",
        })
      }
    } finally {
      profileUpdateInProgress.current = false
    }
  }, [])
>>>>>>> 6015cc09c10c2cd329d84a9fa2937cc768733d37

  useEffect(() => {
    const getInitialSession = async () => {
      try {
<<<<<<< HEAD
        const { data: { session }, error } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
        if (error) {
          toast({
            title: 'Authentication Error',
            description: error.message,
            variant: 'destructive'
          })
        }
      } catch (error) {
        console.error('Error getting session:', error)
=======
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          setError(sessionError)
          console.error("Error getting initial session:", sessionError)
          return
        }

        setSession(initialSession)
        setUser(initialSession?.user ?? null)

        if (initialSession?.user) {
          await ensureProfileExists(initialSession.user)
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error)
        if (error instanceof Error) {
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive",
          })
        }
>>>>>>> 6015cc09c10c2cd329d84a9fa2937cc768733d37
      } finally {
        setIsLoading(false)
      }
    }

<<<<<<< HEAD
    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [toast])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      toast({
        title: 'Signed out successfully',
        description: 'You have been logged out of your account.'
      })
    } catch (error) {
      console.error('Error signing out:', error)
      toast({
        title: 'Error signing out',
        description: 'There was a problem signing you out.',
        variant: 'destructive'
      })
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
=======
    // Get initial session
    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        setSession(session)
        setUser(session?.user ?? null)
        setError(null) // Clear any previous errors

        // If user exists, ensure profile exists
        if (session?.user) {
          await ensureProfileExists(session.user)
        }
      } catch (error) {
        console.error("Error handling auth state change:", error)
        if (error instanceof Error) {
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive",
          })
        }
      } finally {
        setIsLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
      if (sessionCheckTimeout.current) {
        clearTimeout(sessionCheckTimeout.current)
      }
    }
  }, [ensureProfileExists])

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error("Error signing out:", error)
      if (error instanceof Error) {
        toast({
          title: "Sign Out Error",
          description: error.message,
          variant: "destructive",
        })
      }
    }
  }

  const value = {
    user,
    session,
    isLoading,
    error,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
>>>>>>> 6015cc09c10c2cd329d84a9fa2937cc768733d37
}

