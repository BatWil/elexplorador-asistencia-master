"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const SidebarContext = React.createContext<{
  expanded: boolean
  setExpanded: (expanded: boolean) => void
  miniExpanded: boolean
  setMiniExpanded: (expanded: boolean) => void
}>({
  expanded: true,
  setExpanded: () => {},
  miniExpanded: false,
  setMiniExpanded: () => {},
})

export function Sidebar({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  const [expanded, setExpanded] = React.useState(true)
  const [miniExpanded, setMiniExpanded] = React.useState(false)

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded, miniExpanded, setMiniExpanded }}>
      <aside
        className={cn(
          "relative flex flex-col bg-background transition-all duration-300 ease-in-out",
          expanded ? "w-64" : miniExpanded ? "w-20" : "w-16",
          className,
        )}
      >
        {children}
      </aside>
    </SidebarContext.Provider>
  )
}

export function SidebarToggle() {
  const { expanded, setExpanded, miniExpanded, setMiniExpanded } = React.useContext(SidebarContext)

  return (
    <button
      onClick={() => {
        if (expanded) {
          setExpanded(false)
          setMiniExpanded(true)
        } else if (miniExpanded) {
          setMiniExpanded(false)
        } else {
          setExpanded(true)
        }
      }}
      className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-md"
    >
      <ChevronIcon expanded={expanded} miniExpanded={miniExpanded} />
    </button>
  )
}

function ChevronIcon({ expanded, miniExpanded }: { expanded: boolean; miniExpanded: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("transition-transform duration-300", expanded ? "" : miniExpanded ? "rotate-180" : "rotate-180")}
    >
      <path
        d="M6.66667 4L10.6667 8L6.66667 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

