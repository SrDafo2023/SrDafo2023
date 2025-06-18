import type React from "react"
import { DashboardHeader } from "@/components/dashboard-header"

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader />
      {children}
    </div>
  )
}
