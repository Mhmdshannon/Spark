import { NextResponse } from 'next/server'
import { testDatabaseSetup } from '@/lib/profile-service'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export async function GET() {
  try {
    // First verify Supabase client is initialized
    if (!isSupabaseConfigured()) {
      console.error('Supabase client not properly configured')
      return NextResponse.json({ 
        success: false, 
        message: 'Supabase client not properly configured. Please check your environment variables.' 
      }, { status: 500 })
    }

    const result = await testDatabaseSetup()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in test-db route:', error)
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error in test-db route' 
    }, { status: 500 })
  }
} 