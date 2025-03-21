"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"
import { SparkLogoFull } from "@/components/spark-logo"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Update the handleSubmit function to include better error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Email and password are required",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Check if Supabase is configured
      if (!supabase) {
        throw new Error("Supabase client is not initialized. Please check your environment variables.")
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      // Successful login
      toast({
        title: "Success",
        description: "You have successfully logged in",
      })

      router.push("/dashboard")
      router.refresh()
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to login. Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center premium-gradient px-4 py-12">
      <Card className="w-full max-w-md premium-card">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <SparkLogoFull />
          </div>
          <CardTitle className="text-2xl font-bold text-center premium-text-gradient">Login to Spark Fitness</CardTitle>
          <CardDescription className="text-center text-spark-silver-400">
            Enter your email and password to access your workout plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-spark-silver-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="premium-input"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-spark-silver-200">
                  Password
                </Label>
                <Link href="/forgot-password" className="text-sm text-spark-red-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="premium-input"
              />
            </div>
            <Button type="submit" className="w-full premium-button" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-spark-silver-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-spark-red-400 hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

