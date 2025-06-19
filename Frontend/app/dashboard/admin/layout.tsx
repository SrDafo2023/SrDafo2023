import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Simular usuario admin para demo, puedes cambiar esto por el usuario real
  const userRole = "admin"
  const userName = "Administrador"
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar userRole={userRole} userName={userName} />
      <div className="flex-1 flex flex-col">
        {/* Aquí podrías agregar el DashboardHeader si lo deseas */}
        {children}
      </div>
    </div>
  )
}
