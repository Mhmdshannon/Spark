"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Edit, Trash, Eye, Users } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import Link from "next/link"

// Mock data for workouts
const mockWorkouts = [
  {
    id: "1",
    name: "Upper Body Strength",
    type: "Strength",
    assignedTo: 12,
    coach: "Mike Johnson",
    created_at: "2023-01-15T00:00:00Z",
  },
  {
    id: "2",
    name: "Lower Body Power",
    type: "Power",
    assignedTo: 8,
    coach: "Sarah Smith",
    created_at: "2023-02-10T00:00:00Z",
  },
  {
    id: "3",
    name: "Core & Stability",
    type: "Functional",
    assignedTo: 15,
    coach: "Mike Johnson",
    created_at: "2023-03-05T00:00:00Z",
  },
  {
    id: "4",
    name: "HIIT Cardio",
    type: "Cardio",
    assignedTo: 20,
    coach: "Sarah Smith",
    created_at: "2023-04-20T00:00:00Z",
  },
]

export function WorkoutsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const { t } = useLanguage()

  // Filter workouts based on search query
  const filteredWorkouts = mockWorkouts.filter((workout) => {
    const name = workout.name.toLowerCase()
    const type = workout.type.toLowerCase()
    const coach = workout.coach.toLowerCase()
    const query = searchQuery.toLowerCase()

    return name.includes(query) || type.includes(query) || coach.includes(query)
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-spark-silver-500" />
          <Input
            type="search"
            placeholder={t("admin.search_workouts")}
            className="w-full pl-8 premium-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Link href="/admin/add-workout" passHref>
          <Button className="premium-button">{t("admin.add_workout")}</Button>
        </Link>
      </div>

      <div className="rounded-md border border-spark-dark-600">
        <Table>
          <TableHeader className="bg-spark-dark-700">
            <TableRow className="hover:bg-spark-dark-700/50">
              <TableHead className="text-spark-silver-300">{t("admin.workout")}</TableHead>
              <TableHead className="text-spark-silver-300">{t("admin.type")}</TableHead>
              <TableHead className="text-spark-silver-300">{t("admin.assigned")}</TableHead>
              <TableHead className="text-spark-silver-300">{t("admin.coach")}</TableHead>
              <TableHead className="text-spark-silver-300">{t("admin.created")}</TableHead>
              <TableHead className="text-spark-silver-300 text-right">{t("admin.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWorkouts.length > 0 ? (
              filteredWorkouts.map((workout) => (
                <TableRow key={workout.id} className="hover:bg-spark-dark-700/50">
                  <TableCell className="font-medium text-spark-silver-100">{workout.name}</TableCell>
                  <TableCell className="text-spark-silver-200">{workout.type}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-spark-silver-400" />
                      <span className="text-spark-silver-200">{workout.assignedTo}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-spark-silver-200">{workout.coach}</TableCell>
                  <TableCell className="text-spark-silver-200">
                    {new Date(workout.created_at).toLocaleDateString()}
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
                        <Link href={`/admin/workouts/${workout.id}`} passHref>
                          <DropdownMenuItem className="hover:bg-spark-dark-600">
                            <Eye className="mr-2 h-4 w-4" />
                            {t("admin.view")}
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/admin/workouts/${workout.id}/edit`} passHref>
                          <DropdownMenuItem className="hover:bg-spark-dark-600">
                            <Edit className="mr-2 h-4 w-4" />
                            {t("admin.edit")}
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/admin/workouts/${workout.id}/assign`} passHref>
                          <DropdownMenuItem className="hover:bg-spark-dark-600">
                            <Users className="mr-2 h-4 w-4" />
                            {t("admin.assign")}
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
                <TableCell colSpan={6} className="h-24 text-center text-spark-silver-400">
                  {searchQuery ? t("admin.no_results") : t("admin.no_workouts")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

