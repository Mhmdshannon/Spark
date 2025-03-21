// This file contains detailed information about exercises including demonstration videos and images

export type Exercise = {
  id: string
  name: string
  category: string
  description: string
  videoUrl: string
  imageUrls: string[]
  steps: string[]
  tips: string[]
  muscles: string[]
  equipment: string[]
}

export const exerciseData: Record<string, Exercise> = {
  "bench-press": {
    id: "bench-press",
    name: "Bench Press",
    category: "Chest",
    description: "A compound exercise that targets the chest, shoulders, and triceps.",
    videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg",
    imageUrls: [
      "/placeholder.svg?height=400&width=400&text=Bench+Press+Start",
      "/placeholder.svg?height=400&width=400&text=Bench+Press+Bottom",
      "/placeholder.svg?height=400&width=400&text=Bench+Press+Top",
    ],
    steps: [
      "Lie on a flat bench with your feet flat on the floor.",
      "Grip the barbell slightly wider than shoulder-width apart.",
      "Unrack the barbell and position it over your chest with arms fully extended.",
      "Lower the barbell to your mid-chest, keeping your elbows at about a 45-degree angle to your body.",
      "Press the barbell back up to the starting position, fully extending your arms.",
    ],
    tips: [
      "Keep your wrists straight and directly above your elbows.",
      "Maintain a slight arch in your lower back.",
      "Keep your feet flat on the floor for stability.",
      "Don't bounce the bar off your chest.",
      "Breathe out as you push the weight up.",
    ],
    muscles: ["Chest", "Shoulders", "Triceps"],
    equipment: ["Barbell", "Bench"],
  },
  "incline-dumbbell-press": {
    id: "incline-dumbbell-press",
    name: "Incline Dumbbell Press",
    category: "Chest",
    description: "An upper chest focused exercise that also engages the shoulders and triceps.",
    videoUrl: "https://www.youtube.com/embed/8iPEnn-ltC8",
    imageUrls: [
      "/placeholder.svg?height=400&width=400&text=Incline+DB+Press+Start",
      "/placeholder.svg?height=400&width=400&text=Incline+DB+Press+Bottom",
    ],
    steps: [
      "Set an adjustable bench to a 30-45 degree incline.",
      "Sit on the bench with a dumbbell in each hand resting on your thighs.",
      "Kick the weights up one at a time as you lean back on the bench.",
      "Hold the dumbbells at shoulder width with palms facing forward.",
      "Press the dumbbells up until your arms are fully extended.",
      "Lower the weights back down to chest level with control.",
    ],
    tips: [
      "Keep your back flat against the bench.",
      "Don't arch your back excessively.",
      "Lower the weights to the sides of your chest, not to your shoulders.",
      "Keep your elbows at a 45-degree angle to your body.",
      "Focus on squeezing your chest at the top of the movement.",
    ],
    muscles: ["Upper Chest", "Shoulders", "Triceps"],
    equipment: ["Dumbbells", "Incline Bench"],
  },
  // Other exercises remain the same...
}

// Function to get exercise data by name
export function getExerciseByName(name: string): Exercise | undefined {
  try {
    // Convert the name to a format that matches our keys (lowercase, hyphenated)
    const formattedName = name.toLowerCase().replace(/\s+/g, "-")

    // First try direct match
    if (exerciseData[formattedName]) {
      return exerciseData[formattedName]
    }

    // If no direct match, try to find a partial match
    const keys = Object.keys(exerciseData)
    for (const key of keys) {
      if (exerciseData[key].name.toLowerCase() === name.toLowerCase()) {
        return exerciseData[key]
      }
    }

    // If still no match, return undefined
    return undefined
  } catch (error) {
    console.error("Error getting exercise data:", error)
    return {
      id: "fallback",
      name: name || "Exercise",
      category: "General",
      description: "Learn the proper form and technique for this exercise.",
      videoUrl: "",
      imageUrls: ["/placeholder.svg?height=400&width=400&text=Exercise+Image"],
      steps: [],
      tips: [],
      muscles: [],
      equipment: [],
    }
  }
}

