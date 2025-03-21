import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Create profiles table if it doesn't exist
    const { error: createTableError } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1)
      .single()

    if (createTableError?.message?.includes('does not exist')) {
      const { error: createError } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: '00000000-0000-0000-0000-000000000000',
            first_name: 'System',
            last_name: 'Init',
            email: 'system@init.local',
            role: 'member'
          }
        ])

      if (createError) {
        console.error("Error creating profiles table:", createError)
        return NextResponse.json(
          {
            success: false,
            error: createError.message,
          },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database initialization completed successfully.",
    })
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

