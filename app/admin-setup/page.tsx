"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

export default function AdminSetupPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch(`/api/set-admin?email=${encodeURIComponent(email)}&key=spark-admin-setup`)
      const data = await response.json()

      setResult(data)

      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
        })
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error setting admin:", error)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      })
      toast({
        title: "Error",
        description: "Failed to set admin user. See console for details.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4 py-12">
      <Card className="w-full max-w-md bg-gray-800 text-gray-100 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Admin Setup</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter the email address of the user you want to make an admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-gray-100"
              />
            </div>
            <Button type="submit" className="w-full bg-maroon-600 hover:bg-maroon-700" disabled={isLoading}>
              {isLoading ? "Setting admin..." : "Make Admin"}
            </Button>
          </form>
          {result && (
            <div
              className={`mt-4 p-3 rounded ${
                result.success ? "bg-green-900 text-green-100" : "bg-red-900 text-red-100"
              }`}
            >
              {result.message}
            </div>
          )}
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-400">
          This will grant admin privileges to the specified user
        </CardFooter>
      </Card>
    </div>
  )
}

