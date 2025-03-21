import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const email = "mohammedmshannon@icloud.com"

    // Try to find the user in profiles
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single()

    if (profileError) {
      // If profile not found, try to find the user in auth
      const { data: authData, error: authError } = await supabase.auth
        .signInWithPassword({
          email: email,
          password: "temporary-password-for-testing-only",
        })
        .catch(() => ({ data: null, error: new Error("Failed to authenticate") }))

      if (authError || !authData || !authData.user) {
        return NextResponse.json(
          {
            success: false,
            message: `Could not find user with email ${email}. Please register this user first.`,
          },
          { status: 404 },
        )
      }

      // Create a profile for this user
      const { error: insertError } = await supabase.from("profiles").insert({
        user_id: authData.user.id,
        email: email,
        role: "admin",
        first_name: "Admin",
        last_name: "User",
      })

      if (insertError) {
        return NextResponse.json(
          {
            success: false,
            message: `Error creating profile: ${insertError.message}`,
          },
          { status: 500 },
        )
      }

      return NextResponse.json({
        success: true,
        message: `User ${email} is now an admin`,
      })
    }

    // Update the existing profile to be an admin
    const { error: updateError } = await supabase.from("profiles").update({ role: "admin" }).eq("email", email)

    if (updateError) {
      return NextResponse.json(
        {
          success: false,
          message: `Error updating profile: ${updateError.message}`,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: `User ${email} is now an admin`,
    })
  } catch (error) {
    console.error("Error making admin:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}

