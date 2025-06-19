import type React from "react"
import { DashboardHeader } from "@/components/dashboard-header"

interface Props {
  children: React.ReactNode
}

export default function PetShopLayout({ children }: Props) {
  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader />
      {children}
    </div>
  )
}
