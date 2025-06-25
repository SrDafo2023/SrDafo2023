"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LucideIcon, LogOut } from "lucide-react"
import { auth } from "@/config/firebase/firebase"
import { signOut } from "firebase/auth"

interface GroomingNavProps {
  items: {
    title: string
    href: string
    icon: LucideIcon
  }[]
}

export function GroomingNav({ items }: GroomingNavProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <div className="w-64 bg-blue-600 flex flex-col">
      <ScrollArea className="flex-1 py-6">
        <div className="space-y-4">
          <div className="px-3">
            <h2 className="mb-2 px-4 text-lg font-semibold text-white">
              Panel de Grooming
            </h2>
            <div className="space-y-1">
              {items.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      pathname === item.href 
                        ? "bg-blue-700 text-white hover:bg-blue-800" 
                        : "text-white hover:bg-blue-700"
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-blue-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-blue-700"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
} 