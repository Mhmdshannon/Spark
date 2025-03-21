import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-gray-100">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}

