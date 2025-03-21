'use client'

import { useAuth } from '@/context/auth-context'

export default function Home() {
  const { user, signOut } = useAuth()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Welcome to Spark Fitness</h1>
        {user ? (
          <div>
            <p>Welcome back, {user.email}</p>
            <button
              onClick={signOut}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <p>Please sign in to continue</p>
        )}
      </div>
    </main>
  )
} 