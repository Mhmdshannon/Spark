"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ExerciseDemoModalProps {
  isOpen: boolean
  onClose: () => void
  exercise: {
    name: string
    description?: string
    videoUrl?: string
    imageUrls?: string[]
    steps?: string[]
    tips?: string[]
  }
}

export function ExerciseDemoModal({ isOpen, onClose, exercise }: ExerciseDemoModalProps) {
  const [activeTab, setActiveTab] = useState("video")
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl bg-gray-800 border-gray-700 text-gray-100">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-100">{exercise.name}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-gray-300">
            {exercise.description || "Learn the proper form and technique for this exercise."}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="video" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
          </TabsList>

          <TabsContent value="video" className="mt-0">
            <div className="aspect-video bg-gray-900 rounded-md overflow-hidden">
              {exercise.videoUrl ? (
                <iframe
                  src={exercise.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onError={() => console.error("Video failed to load:", exercise.videoUrl)}
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <p>Video demonstration coming soon</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="images" className="mt-0">
            <div className="grid grid-cols-2 gap-4">
              {exercise.imageUrls && exercise.imageUrls.length > 0 ? (
                exercise.imageUrls.map((url, index) => (
                  <div key={index} className="aspect-square bg-gray-900 rounded-md overflow-hidden">
                    {imageErrors[index] ? (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <p>Image failed to load</p>
                      </div>
                    ) : (
                      <img
                        src={url || "/placeholder.svg?text=Image+Not+Available"}
                        alt={`${exercise.name} demonstration ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(index)}
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-2 aspect-video bg-gray-900 rounded-md flex items-center justify-center text-gray-400">
                  <p>Image demonstrations coming soon</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="instructions" className="mt-0">
            <div className="space-y-4">
              {exercise.steps && exercise.steps.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-100">Steps</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-gray-200">
                    {exercise.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {exercise.tips && exercise.tips.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-100">Tips</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-200">
                    {exercise.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {(!exercise.steps || exercise.steps.length === 0) && (!exercise.tips || exercise.tips.length === 0) && (
                <div className="py-8 text-center text-gray-400">
                  <p>Detailed instructions coming soon</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

