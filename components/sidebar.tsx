"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, AlertTriangle, Bell, Settings, Shield, Activity, FolderOpen, Radio } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Latest", href: "/wallets", icon: Radio },
  { name: "High Risk", href: "/high-risk", icon: AlertTriangle },
  { name: "Alerts", href: "/alerts", icon: Bell },
  { name: "Cases", href: "/cases", icon: FolderOpen },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary animate-glow">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">CACS-X</h1>
            <p className="text-xs text-muted-foreground">Threat Intelligence</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Investigation
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/20 text-primary border-l-2 border-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                {item.name}
                {(item.name === "Latest" || item.name === "Alerts") && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-success animate-pulse" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* System Status */}
        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-sidebar-accent p-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-sidebar-foreground">System Status</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-success" />
                <div className="absolute inset-0 h-2 w-2 rounded-full bg-success animate-pulse-ring" />
              </div>
              <span className="text-xs text-muted-foreground">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
