"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Edit, Trash, Eye } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import type { MealPlan } from "@/lib/types"
import Link from "next/link"

interface MealPlansListProps {
  mealPlans: MealPlan[]
}

export function MealPlansList({ mealPlans = [] }: MealPlansListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { t } = useLanguage()

  // Filter meal plans based on search query
  const filteredMealPlans = mealPlans.filter((mealPlan) => {
    if (!mealPlan) return false

    const title = mealPlan.title?.toLowerCase() || ""
    const fullName = mealPlan.profile
      ? `${mealPlan.profile.first_name || ""} ${mealPlan.profile.last_name || ""}`.toLowerCase()
      : ""
    const query = searchQuery.toLowerCase()

    return title.includes(query) || fullName.includes(query)
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-spark-silver-500" />
          <Input
            type="search"
            placeholder={t("admin.search_meal_plans")}
            className="w-full pl-8 premium-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Link href="/admin/add-meal-plan" passHref>
          <Button className="premium-button">{t("admin.add_meal")}</Button>
        </Link>
      </div>

      <div className="rounded-md border border-spark-dark-600">
        <Table>
          <TableHeader className="bg-spark-dark-700">
            <TableRow className="hover:bg-spark-dark-700/50">
              <TableHead className="text-spark-silver-300">{t("admin.meal_plan")}</TableHead>
              <TableHead className="text-spark-silver-300">{t("admin.assigned_to")}</TableHead>
              <TableHead className="text-spark-silver-300">{t("admin.start_date")}</TableHead>
              <TableHead className="text-spark-silver-300">{t("admin.end_date")}</TableHead>
              <TableHead className="text-spark-silver-300 text-right">{t("admin.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMealPlans.length > 0 ? (
              filteredMealPlans.map((mealPlan) => (
                <TableRow key={mealPlan.id} className="hover:bg-spark-dark-700/50">
                  <TableCell className="font-medium text-spark-silver-100">{mealPlan.title || ""}</TableCell>
                  <TableCell className="text-spark-silver-200">
                    {mealPlan.profile ? `${mealPlan.profile.first_name || ""} ${mealPlan.profile.last_name || ""}` : ""}
                  </TableCell>
                  <TableCell className="text-spark-silver-200">
                    {mealPlan.start_date ? new Date(mealPlan.start_date).toLocaleDateString() : ""}
                  </TableCell>
                  <TableCell className="text-spark-silver-200">
                    {mealPlan.end_date ? new Date(mealPlan.end_date).toLocaleDateString() : ""}
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
                        <Link href={`/admin/meal-plans/${mealPlan.id || "#"}`} passHref>
                          <DropdownMenuItem className="hover:bg-spark-dark-600">
                            <Eye className="mr-2 h-4 w-4" />
                            {t("admin.view")}
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/admin/meal-plans/${mealPlan.id || "#"}/edit`} passHref>
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
                  {searchQuery ? t("admin.no_results") : t("admin.no_meal_plans")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

