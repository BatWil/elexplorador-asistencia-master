"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Settings, Search, LogOut, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useSidebar } from "@/context/SidebarContext";



const menuItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Users, label: "Asistencia", href: "/asistencia" },
  { icon: Settings, label: "Configuración", href: "/configuracion" },
]



export function AppSidebar() {
  const pathname = usePathname()
  const [isDark, setIsDark] = useState(false)

  const { isOpen, toggleSidebar } = useSidebar();


  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDark])

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <button onClick={toggleSidebar}>Toggle Sidebar</button>
      <Sidebar className="border-r">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3 px-2">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>MA</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold">Monitor App</span>
              <span className="text-xs text-muted-foreground">Sistema de Asistencia</span>
            </div>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar..." className="pl-8" />
          </div>
        </SidebarHeader>
        <SidebarContent className="px-4">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href && "bg-accent text-accent-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start gap-2">
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <span className="text-sm">Modo Oscuro</span>
              </div>
              <Switch checked={isDark} onCheckedChange={setIsDark} />
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    </aside>
    
  )
}

