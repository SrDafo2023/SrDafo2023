import type React from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex-1 overflow-auto bg-gray-100">{children}</div>
    </div>
  )
}
