"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Edit, Trash, Calendar } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { getDaysLeft, isSubscriptionActive } from "@/lib/subscription-service"
import type { Subscription } from "@/lib/types"
import Link from "next/link"

interface MembersListProps {
  members: Subscription[]
}

export function MembersList({ members = [] }: MembersListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { t } = useLanguage()

  // Filter members based on search query
  const filteredMembers = members.filter((member) => {
    if (!member.profile) return false

    const fullName = `${member.profile.first_name || ""} ${member.profile.last_name || ""}`.toLowerCase()
    const email = member.profile.email?.toLowerCase() || ""
    const query = searchQuery.toLowerCase()

    return fullName.includes(query) || email.includes(query)
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-spark-silver-500" />
          <Input
            type="search"
            placeholder={t("admin.search_members")}
            className="w-full pl-8 premium-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="premium-button">
          <Calendar className="mr-2 h-4 w-4" />
          {t("admin.export")}
        </Button>
      </div>

      <div className="rounded-md border border-spark-dark-600">
        <Table>
          <TableHeader className="bg-spark-dark-700">
            <TableRow className="hover:bg-spark-dark-700/50">
              <TableHead className="text-spark-silver-300">{t("admin.member")}</TableHead>
              <TableHead className="text-spark-silver-300">{t("admin.status")}</TableHead>
              <TableHead className="text-spark-silver-300">{t("admin.plan")}</TableHead>
              <TableHead className="text-spark-silver-300">{t("admin.joined")}</TableHead>
              <TableHead className="text-spark-silver-300">{t("admin.expires")}</TableHead>
              <TableHead className="text-spark-silver-300 text-right">{t("admin.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => {
                const active = isSubscriptionActive(member)
                const daysLeft = getDaysLeft(member.end_date)

                return (
                  <TableRow key={member.id} className="hover:bg-spark-dark-700/50">
                    <TableCell className="font-medium text-spark-silver-100">
                      <div className="flex flex-col">
                        <span>
                          {member.profile?.first_name || ""} {member.profile?.last_name || ""}
                        </span>
                        <span className="text-xs text-spark-silver-400">{member.profile?.email || ""}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${
                          active ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                        }`}
                      >
                        {active ? t("admin.active") : t("admin.expired")}
                      </div>
                    </TableCell>
                    <TableCell className="text-spark-silver-200">
                      {member.plan_type ? member.plan_type.charAt(0).toUpperCase() + member.plan_type.slice(1) : ""}
                    </TableCell>
                    <TableCell className="text-spark-silver-200">
                      {member.start_date ? new Date(member.start_date).toLocaleDateString() : ""}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-spark-silver-200">
                          {member.end_date ? new Date(member.end_date).toLocaleDateString() : ""}
                        </span>
                        {active && (
                          <span className="text-xs text-spark-silver-400">
                            {daysLeft} {t("admin.days_left")}
                          </span>
                        )}
                      </div>
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
                          <Link href={`/admin/members/${member.user_id || "#"}`} passHref>
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
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-spark-silver-400">
                  {searchQuery ? t("admin.no_results") : t("admin.no_members")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

