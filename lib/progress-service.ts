import { supabase } from "./supabase"
import type { ProgressPhoto } from "./types"

// Upload a progress photo
export async function uploadProgressPhoto(
  userId: string,
  file: File,
  weight?: number,
): Promise<{ success: boolean; photoUrl?: string }> {
  try {
    // Upload the file to Supabase Storage
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`
    const filePath = `progress-photos/${fileName}`

    const { error: uploadError } = await supabase.storage.from("user-uploads").upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    // Get the public URL
    const { data: urlData } = supabase.storage.from("user-uploads").getPublicUrl(filePath)

    const photoUrl = urlData.publicUrl

    // Create a record in the progress_photos table
    const { error: dbError } = await supabase.from("progress_photos").insert([
      {
        user_id: userId,
        photo_url: photoUrl,
        weight,
        date: new Date().toISOString().split("T")[0],
      },
    ])

    if (dbError) {
      throw dbError
    }

    return { success: true, photoUrl }
  } catch (error) {
    console.error("Error uploading progress photo:", error)
    return { success: false }
  }
}

// Get progress photos for a user
export async function getProgressPhotos(userId: string): Promise<ProgressPhoto[]> {
  const { data, error } = await supabase
    .from("progress_photos")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching progress photos:", error)
    return []
  }

  return data || []
}

// Delete a progress photo
export async function deleteProgressPhoto(photoId: string): Promise<boolean> {
  try {
    // Get the photo record first to get the URL
    const { data: photo, error: fetchError } = await supabase
      .from("progress_photos")
      .select("photo_url")
      .eq("id", photoId)
      .single()

    if (fetchError) {
      throw fetchError
    }

    // Delete the photo from storage
    const photoUrl = photo.photo_url
    const filePath = photoUrl.split("/").slice(-2).join("/")

    const { error: storageError } = await supabase.storage.from("user-uploads").remove([`progress-photos/${filePath}`])

    if (storageError) {
      console.error("Error deleting photo from storage:", storageError)
      // Continue with database deletion even if storage deletion fails
    }

    // Delete the record from the database
    const { error: dbError } = await supabase.from("progress_photos").delete().eq("id", photoId)

    if (dbError) {
      throw dbError
    }

    return true
  } catch (error) {
    console.error("Error deleting progress photo:", error)
    return false
  }
}

