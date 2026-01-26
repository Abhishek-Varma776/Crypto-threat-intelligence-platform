"use client"

import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { DemoControl } from "@/components/demo-control"
import { AlertCard } from "@/components/alert-card"
import { mockAlerts, type Alert } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Bell, BellOff, Check, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [filter, setFilter] = useState<string>("all")
  const [isLive, setIsLive] = useState(true)
  const [isPresentationMode, setIsPresentationMode] = useState(false)

  // Simulate real-time alerts
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      const newAlert: Alert = {
        id: Date.now().toString(),
        type: ["high-risk", "suspicious-pii", "rapid-activity", "new-wallet"][
          Math.floor(Math.random() * 4)
        ] as Alert["type"],
        message: [
          "New high-risk wallet detected with ML confidence 94%",
          "PII extraction complete - 3 new identifiers found",
          "Unusual transaction velocity detected - 25 tx/hour",
          "Cross-chain bridge activity flagged for review",
        ][Math.floor(Math.random() * 4)],
        walletAddress: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 8)}`,
        timestamp: new Date().toISOString(),
        severity: ["critical", "high", "medium", "low"][Math.floor(Math.random() * 4)] as Alert["severity"],
      }
      setAlerts((prev) => [newAlert, ...prev].slice(0, 50))
    }, 8000)

    return () => clearInterval(interval)
  }, [isLive])

  const filteredAlerts = filter === "all" ? alerts : alerts.filter((a) => a.severity === filter)

  const severityCounts = {
    critical: alerts.filter((a) => a.severity === "critical").length,
    high: alerts.filter((a) => a.severity === "high").length,
    medium: alerts.filter((a) => a.severity === "medium").length,
    low: alerts.filter((a) => a.severity === "low").length,
  }

  return (
    <div className={cn("min-h-screen bg-background", isPresentationMode && "presentation-mode")}>
      <Sidebar />
      <TopBar
        onPresentationToggle={() => setIsPresentationMode(!isPresentationMode)}
        isPresentationMode={isPresentationMode}
      />

      <main className="ml-64 pt-14 p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Real-Time Alerts</h1>
            <p className="mt-1 text-muted-foreground">Live threat monitoring and notifications</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={isLive ? "default" : "outline"}
              size="sm"
              className={cn("gap-2", !isLive && "bg-transparent")}
              onClick={() => setIsLive(!isLive)}
            >
              {isLive ? (
                <>
                  <Bell className="h-4 w-4 animate-pulse" />
                  Live
                </>
              ) : (
                <>
                  <BellOff className="h-4 w-4" />
                  Paused
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Clock className="h-4 w-4" />
              Snooze 30min
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Check className="h-4 w-4" />
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            )}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setFilter("critical")}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              filter === "critical"
                ? "bg-destructive text-destructive-foreground"
                : "bg-destructive/20 text-destructive hover:bg-destructive/30",
            )}
          >
            Critical ({severityCounts.critical})
          </button>
          <button
            onClick={() => setFilter("high")}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              filter === "high" ? "bg-warning text-white" : "bg-warning/20 text-warning hover:bg-warning/30",
            )}
          >
            High ({severityCounts.high})
          </button>
          <button
            onClick={() => setFilter("medium")}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              filter === "medium" ? "bg-chart-2 text-white" : "bg-chart-2/20 text-chart-2 hover:bg-chart-2/30",
            )}
          >
            Medium ({severityCounts.medium})
          </button>
          <button
            onClick={() => setFilter("low")}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              filter === "low" ? "bg-success text-white" : "bg-success/20 text-success hover:bg-success/30",
            )}
          >
            Low ({severityCounts.low})
          </button>
        </div>

        {/* Live Indicator */}
        {isLive && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3">
            <div className="relative">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <div className="absolute inset-0 h-2 w-2 rounded-full bg-primary animate-ping" />
            </div>
            <span className="text-sm font-medium text-primary">WebSocket connected — Receiving live alerts</span>
          </div>
        )}

        {/* Alerts List */}
        <div className="space-y-3">
          {filteredAlerts.map((alert, index) => (
            <div key={alert.id} className={cn(index === 0 && isLive && "animate-slide-in")}>
              <AlertCard alert={alert} />
            </div>
          ))}
        </div>
      </main>

      <DemoControl />
    </div>
  )
}
