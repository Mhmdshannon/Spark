"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Edit, Trash, Eye } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import type { CoachNote } from "@/lib/types"
import Link from "next/link"

interface CoachNotesListProps {
  coachNotes: CoachNote[]
}

export function CoachNotesList({ coachNotes = [] }: CoachNotesListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { t } = useLanguage()

  // Filter coach notes based on search query
  const filteredNotes = coachNotes.filter((note) => {
    if (!note) return false

    const title = note.title?.toLowerCase() || ""
    const memberName = note.user ? `${note.user.first_name || ""} ${note.user.last_name || ""}`.toLowerCase() : ""
    const coachName = note.coach ? `${note.coach.first_name || ""} ${note.coach.last_name || ""}`.toLowerCase() : ""
    const query = searchQuery.toLowerCase()

    return title.includes(query) || memberName.includes(query) || coachName.includes(query)
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-spark-silver-500" />
          <Input
            type="search"
            placeholder={t("admin.search_notes")}
            className="w-full pl-8 premium-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Link href="/admin/add-note" passHref>
          <Button className="premium-button">{t("admin.add_note")}</Button>
        </Link>
      </div>

      <div className="rounded-md border border-spark-dark-600">
        <Table>
          <TableHeader className="bg-spark-dark-700">
            <TableRow className="hover:bg-spark-dark-700/50">
              <TableHead className="text-spark-silver-300">{t("admin.title")}</TableHead>
              <TableHead className="text-spark-silver-300">{t("admin.member")}</TableHead>
              <TableHead className="text-spark-silver-300">{t("admin.coach")}</TableHead>
              <TableHead className="text-spark-silver-300">{t("admin.date")}</TableHead>
              <TableHead className="text-spark-silver-300 text-right">{t("admin.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <TableRow key={note.id} className="hover:bg-spark-dark-700/50">
                  <TableCell className="font-medium text-spark-silver-100">{note.title || ""}</TableCell>
                  <TableCell className="text-spark-silver-200">
                    {note.user ? `${note.user.first_name || ""} ${note.user.last_name || ""}` : ""}
                  </TableCell>
                  <TableCell className="text-spark-silver-200">
                    {note.coach ? `${note.coach.first_name || ""} ${note.coach.last_name || ""}` : ""}
                  </TableCell>
                  <TableCell className="text-spark-silver-200">
                    {note.created_at ? new Date(note.created_at).toLocaleDateString() : ""}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-spark-silver-300">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">{t("admin.open_menu")}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-spark-dark-700 border-spark-dark-600">
                        <Link href={`/admin/notes/${note.id || "#"}`} passHref>
                          <DropdownMenuItem className="hover:bg-spark-dark-600">
                            <Eye className="mr-2 h-4 w-4" />
                            {t("admin.view")}
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/admin/notes/${note.id || "#"}/edit`} passHref>
                          <DropdownMenuItem className="hover:bg-spark-dark-600">
                            <Edit className="mr-2 h-4 w-4" />
                            {t("admin.edit")}
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem className="text-red-400 hover:bg-spark-dark-600 hover:text-red-400">
                          <Trash className="mr-2 h-4 w-4" />
                          {t("admin.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-spark-silver-400">
                  {searchQuery ? t("admin.no_results") : t("admin.no_notes")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

