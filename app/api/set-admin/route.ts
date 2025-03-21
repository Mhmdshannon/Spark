import { NextResponse } from "next/server"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { updateProfile, getProfile } from "@/lib/profile-service"

export async function GET(request: Request) {
  // Check if request is valid
  if (!request || !request.url) {
    return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 })
  }

  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: false, message: "Supabase is not properly configured" }, { status: 500 })
  }

  try {
    // Get the email from the query string
    const url = new URL(request.url)
    const searchParams = url.searchParams
    const email = searchParams.get("email")
    const key = searchParams.get("key")

    // Simple security check - require a key
    if (key !== "spark-admin-setup") {
      return NextResponse.json({ success: false, message: "Invalid key" }, { status: 401 })
    }

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 })
    }

    // Find the user by email - using getUser instead of admin.listUsers
    const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(email)

    if (userError) {
      // Fallback to a simpler approach if admin API fails
      try {
        // Try to get all users who have signed up
        const { data: signUps } = await supabase.from("profiles").select("*").eq("email", email).single()

        if (!signUps) {
          return NextResponse.json({ success: false, message: `User with email ${email} not found` }, { status: 404 })
        }

        // Update the user's profile directly
        await updateProfile(signUps.user_id, { role: "admin" })

        return NextResponse.json({
          success: true,
          message: `User ${email} is now an admin`,
        })
      } catch (fallbackError) {
        return NextResponse.json(
          {
            success: false,
            message: `Error finding user: ${userError.message}. Fallback also failed: ${fallbackError instanceof Error ? fallbackError.message : "Unknown error"}`,
          },
          { status: 500 },
        )
      }
    }

    if (!userData || !userData.user) {
      return NextResponse.json({ success: false, message: `User with email ${email} not found` }, { status: 404 })
    }

    const user = userData.user

    // Update the user's profile
    const profile = await getProfile(user.id)

    if (profile) {
      await updateProfile(user.id, { role: "admin" })
    } else {
      await updateProfile(user.id, {
        user_id: user.id,
        email: user.email || "",
        first_name: user.user_metadata?.first_name || "",
        last_name: user.user_metadata?.last_name || "",
        role: "admin",
      })
    }

    return NextResponse.json({
      success: true,
      message: `User ${email} is now an admin`,
    })
  } catch (error) {
    console.error("Error setting admin:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}

