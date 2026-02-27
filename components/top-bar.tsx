"use client"

import { useState, useEffect } from "react"
import { Shield, Clock, Database, Wifi, Monitor, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TopBarProps {
  onPresentationToggle?: () => void
  isPresentationMode?: boolean
}

export function TopBar({ onPresentationToggle, isPresentationMode }: TopBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [lastSync, setLastSync] = useState(12)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      setLastSync((prev) => (prev >= 60 ? 0 : prev + 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }

  return (
    <header className="fixed top-0 left-64 right-0 z-30 h-14 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left section - Project name and status */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">CACS-X</span>
            {/* Environment Badge */}
            <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary animate-pulse">
              DEMO
            </span>
          </div>

          {/* System status indicators */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Database className="h-4 w-4 text-success" />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-success" />
              </div>
              <span className="text-muted-foreground">DB</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Wifi className="h-4 w-4 text-success" />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-success" />
              </div>
              <span className="text-muted-foreground">WS</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Synced {lastSync}s ago</span>
            </div>
          </div>
        </div>

        {/* Right section - Time and controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-mono text-sm text-foreground">
              {isHydrated ? formatTime(currentTime) : '00:00:00'}
            </span>
          </div>

          <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={onPresentationToggle}>
            {isPresentationMode ? (
              <>
                <Monitor className="h-4 w-4" />
                Exit Presentation
              </>
            ) : (
              <>
                <Sun className="h-4 w-4" />
                Presentation
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
