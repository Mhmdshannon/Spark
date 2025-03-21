import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define routes as simple path prefixes for faster checks
const PROTECTED_PREFIXES = ["/dashboard", "/profile", "/workout-timer", "/workouts", "/exercise-library"]
const AUTH_PATHS = ["/login", "/register"]
const PUBLIC_PATHS = ["/", "/about", "/contact", "/privacy", "/terms"]

// Enhanced session cache with token-based invalidation
const sessionCache = new Map<string, { session: any; timestamp: number; token: string }>()
const SESSION_CACHE_TTL = 30000 // 30 seconds

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  
  // Fast path for public routes
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  // Fast path checks using startsWith
  const isProtectedRoute = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix))
  const isAuthRoute = AUTH_PATHS.includes(pathname)

  // Skip middleware for non-matching routes
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next()
  }

  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    // Get current token
    const currentToken = req.cookies.get('sb-access-token')?.value || 'no-token'
    
    // Check cache first with token validation
    const cached = sessionCache.get(currentToken)
    const now = Date.now()

    let session = null
    if (cached && (now - cached.timestamp < SESSION_CACHE_TTL) && cached.token === currentToken) {
      session = cached.session
    } else {
      // Fast session check with 500ms timeout
      const sessionPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Auth timeout')), 500)
        supabase.auth.getSession()
          .then(resolve)
          .catch(reject)
          .finally(() => clearTimeout(timeout))
      }) as Promise<{ data: { session: any }, error: any }>

      const { data: { session: newSession }, error } = await sessionPromise
      
      if (!error) {
        session = newSession
        // Cache the successful result with token
        sessionCache.set(currentToken, { 
          session: newSession, 
          timestamp: now,
          token: currentToken 
        })
      }
    }

    // Quick return for auth errors on non-protected routes
    if (!session && !isProtectedRoute) {
      return res
    }

    // Handle redirects
    if (!session && isProtectedRoute) {
      const redirectUrl = new URL("/login", req.url)
      redirectUrl.searchParams.set("from", pathname)
      return NextResponse.redirect(redirectUrl)
    }

    if (session && isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return res
  } catch (error) {
    // Only redirect protected routes on error
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/workout-timer/:path*",
    "/workouts/:path*",
    "/exercise-library/:path*",
    "/login",
    "/register",
  ],
}

