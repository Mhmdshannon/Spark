"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MessageSquare } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import { getUserCoachNotes } from "@/lib/coach-notes-service"
import type { CoachNote } from "@/lib/types"

export default function CoachNotesPage() {
  const [notes, setNotes] = useState<CoachNote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { t } = useLanguage()

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        const notesData = await getUserCoachNotes(user.id)
        setNotes(notesData)
      } catch (error) {
        console.error("Error fetching coach notes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotes()
  }, [user])

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8 max-w-5xl">
        <div className="flex justify-center items-center h-64">
          <p className="text-spark-silver-400">{t("loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">
      <div className="mb-6">
        <Link href="/dashboard" passHref>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("back_to_dashboard")}
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold tracking-tight premium-text-gradient">{t("coach_notes.title")}</h1>

        {notes.length > 0 ? (
          <div className="space-y-4">
            {notes.map((note) => (
              <Link href={`/coach-notes/${note.id}`} key={note.id} passHref>
                <Card className="premium-card hover:shadow-premium-hover transition-all cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-spark-silver-100">{note.title}</CardTitle>
                      <div className="text-sm text-spark-silver-400">
                        {new Date(note.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <CardDescription className="text-spark-silver-400">
                      {t("coach_notes.from")} {note.coach?.first_name} {note.coach?.last_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-spark-silver-200 line-clamp-2">{note.content}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="premium-card">
            <CardHeader>
              <CardTitle className="text-spark-silver-100">{t("coach_notes.no_notes")}</CardTitle>
              <CardDescription className="text-spark-silver-400">{t("coach_notes.no_notes_desc")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <MessageSquare className="h-16 w-16 text-spark-silver-600 mb-4" />
              <p className="text-spark-silver-300 text-center max-w-md">{t("coach_notes.no_notes_message")}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

