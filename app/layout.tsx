<<<<<<< HEAD
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/auth-context'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Spark Fitness Dashboard',
  description: 'Track your fitness journey with Spark',
=======
import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import { LanguageProvider } from "@/context/language-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Spark Fitness",
  description: "Your personal fitness companion",
  generator: 'v0.dev'
>>>>>>> 6015cc09c10c2cd329d84a9fa2937cc768733d37
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
<<<<<<< HEAD
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
} 
=======
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="spark-theme"
          disableTransitionOnChange
        >
          <AuthProvider>
            <LanguageProvider>
              {children}
              <Toaster />
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'
>>>>>>> 6015cc09c10c2cd329d84a9fa2937cc768733d37
