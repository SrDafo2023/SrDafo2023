import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function AdoptionCenterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Simular usuario del centro de adopción para la demo
  const userRole = "adoption-center"
  const userName = "Centro de Adopción"
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <DashboardSidebar userRole={userRole} userName={userName} />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  )
} 