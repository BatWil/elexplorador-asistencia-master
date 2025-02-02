"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Home,
  Users,
  Settings,
  Search,
  LogOut,
  Moon,
  Sun,
  Bell,
  PieChart,
  Heart,
  Wallet,
  GraduationCap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Sidebar, SidebarToggle } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

import LoginPage from "../app/login-page"





const menuItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: PieChart, label: "Análisis", href: "/analisis" },
  { icon: Users, label: "Asistencia", href: "/asistencia" },
  { icon: GraduationCap, label: "Estudiantes", href: "/estudiantes" },
  { icon: Heart, label: "Progreso", href: "/progreso" },
  { icon: Settings, label: "Configuración", href: "/configuracion" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])


  return (
    <Sidebar className="border-r">
      <SidebarToggle />
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4">
          <div className="flex items-center gap-3 px-2 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>EE</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold truncate">El Explorador</span>
              <span className="text-xs text-muted-foreground truncate">Wil.dev</span>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9 bg-muted/50" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted",
                pathname === item.href && "bg-muted text-foreground",
                "my-1",
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto p-4 space-y-4">

          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span className="text-sm">{isDark ? "Dark" : "Light"} Mode</span>
            </div>
            <Switch checked={isDark} onCheckedChange={setIsDark} />
          </div>
        </div>
      </div>
    </Sidebar>
  )
}

export default AppSidebar;

