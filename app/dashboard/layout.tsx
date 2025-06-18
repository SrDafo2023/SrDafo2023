import type React from "react"
import { DashboardHeader } from "@/components/dashboard-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col">
      <DashboardHeader />
      <div className="flex-1 overflow-auto bg-gray-100">{children}</div>
    </div>
  )
}
