"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, Video, Info } from "lucide-react"
import { ExerciseDemoModal } from "@/components/exercise-demo-modal"
import { exerciseData, type Exercise } from "@/lib/exercise-data"

export default function ExerciseLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [demoModalOpen, setDemoModalOpen] = useState(false)

  // Get unique categories from exercise data
  const categories = ["all", ...new Set(Object.values(exerciseData).map((ex) => ex.category.toLowerCase()))]

  // Filter exercises based on search query and selected category
  const filteredExercises = Object.values(exerciseData).filter((exercise) => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.muscles.some((muscle) => muscle.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory =
      selectedCategory === "all" || exercise.category.toLowerCase() === selectedCategory.toLowerCase()

    return matchesSearch && matchesCategory
  })

  const openDemoModal = (exercise: Exercise) => {
    setSelectedExercise(exercise)
    setDemoModalOpen(true)
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">
      <div className="mb-6">
        <Link href="/dashboard" passHref>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Exercise Library</h1>
          <p className="text-muted-foreground text-gray-200">Learn proper form and technique for all exercises</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            className="pl-8 bg-gray-700 border-gray-600 text-gray-100"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-4">
        <TabsList className="flex flex-wrap">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredExercises.map((exercise) => (
              <Card key={exercise.id} className="bg-gray-800 border-gray-700 overflow-hidden">
                <div className="aspect-video bg-gray-900 relative">
                  {exercise.imageUrls && exercise.imageUrls.length > 0 ? (
                    <img
                      src={exercise.imageUrls[0] || "/placeholder.svg"}
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image available
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="font-medium text-white">{exercise.name}</h3>
                    <p className="text-xs text-gray-300">{exercise.category}</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-300 line-clamp-2 mb-4">{exercise.description}</p>
                  <div className="flex justify-between">
                    <p className="text-xs text-gray-400">
                      Targets: {exercise.muscles.slice(0, 2).join(", ")}
                      {exercise.muscles.length > 2 ? "..." : ""}
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-200 hover:text-white"
                        onClick={() => openDemoModal(exercise)}
                      >
                        <Video className="h-4 w-4 mr-1" />
                        Demo
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-200 hover:text-white"
                        onClick={() => openDemoModal(exercise)}
                      >
                        <Info className="h-4 w-4 mr-1" />
                        Info
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredExercises.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No exercises found matching your search criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedExercise && (
        <ExerciseDemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} exercise={selectedExercise} />
      )}
    </div>
  )
}

