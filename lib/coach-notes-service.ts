import { supabase } from "./supabase"
import type { CoachNote } from "./types"

// Get coach notes for a user
export async function getUserCoachNotes(userId: string): Promise<CoachNote[]> {
  const { data, error } = await supabase
    .from("coach_notes")
    .select(`
      *,
      coach:profiles!coach_id(first_name, last_name)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching coach notes:", error)
    return []
  }

  return data || []
}

// Get a specific coach note
export async function getCoachNote(noteId: string): Promise<CoachNote | null> {
  const { data, error } = await supabase
    .from("coach_notes")
    .select(`
      *,
      coach:profiles!coach_id(first_name, last_name)
    `)
    .eq("id", noteId)
    .single()

  if (error) {
    console.error("Error fetching coach note:", error)
    return null
  }

  return data
}

// Create a coach note (admin only)
export async function createCoachNote(note: Partial<CoachNote>): Promise<CoachNote | null> {
  const { data, error } = await supabase
    .from("coach_notes")
    .insert([
      {
        ...note,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error creating coach note:", error)
    return null
  }

  return data
}

// Update a coach note (admin only)
export async function updateCoachNote(noteId: string, note: Partial<CoachNote>): Promise<CoachNote | null> {
  const { data, error } = await supabase
    .from("coach_notes")
    .update({
      ...note,
      updated_at: new Date().toISOString(),
    })
    .eq("id", noteId)
    .select()
    .single()

  if (error) {
    console.error("Error updating coach note:", error)
    return null
  }

  return data
}

// Get all coach notes (admin only)
export async function getAllCoachNotes(): Promise<CoachNote[]> {
  const { data, error } = await supabase
    .from("coach_notes")
    .select(`
      *,
      user:profiles!user_id(first_name, last_name, email),
      coach:profiles!coach_id(first_name, last_name)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching all coach notes:", error)
    return []
  }

  return data || []
}

